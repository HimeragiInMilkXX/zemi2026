(function () {
    const target = document.querySelector(".closer .days-until .days");

    if (!target) return;

    const TWO_PI = Math.PI * 2;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let overlay;
    let revealed = false;
    let vertices = [];
    let indices = [];
    const fragments = [];

    function createOverlay() {
        overlay = document.createElement("div");
        overlay.className = "days-shatter-overlay";
        overlay.setAttribute("aria-hidden", "true");
        target.appendChild(overlay);

        watchForScrollReveal();
    }

    function watchForScrollReveal() {
        if (!("IntersectionObserver" in window)) {
            window.addEventListener("scroll", revealIfVisible, { passive: true });
            window.addEventListener("resize", revealIfVisible);
            revealIfVisible();
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            if (!entries.some(function (entry) { return entry.isIntersecting; })) return;

            observer.disconnect();
            revealFromViewport();
        }, {
            threshold: 0.5,
        });

        observer.observe(target);
    }

    function revealIfVisible() {
        if (revealed) return;

        const box = target.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const visibleY = box.top < viewportHeight * 0.75 && box.bottom > viewportHeight * 0.25;
        const visibleX = box.left < viewportWidth && box.right > 0;

        if (visibleY && visibleX) {
            window.removeEventListener("scroll", revealIfVisible);
            window.removeEventListener("resize", revealIfVisible);
            revealFromViewport();
        }
    }

    function revealFromViewport() {
        if (revealed) return;

        const box = target.getBoundingClientRect();
        const clickPosition = [box.width * 0.5, box.height * 0.5];

        if (reducedMotion || !window.Delaunay || !window.TweenMax || !window.TimelineMax) {
            revealWithoutAnimation();
            return;
        }

        revealed = true;
        target.classList.add("is-revealed");
        window.TweenMax.set(target, { perspective: 500 });

        triangulate(clickPosition, box.width, box.height);
        shatter(clickPosition, box.width, box.height);
    }

    function revealWithoutAnimation() {
        revealed = true;
        target.classList.add("is-revealed");
        removeOverlay();
    }

    function triangulate(clickPosition, width, height) {
        const rings = [
            { r: 50, c: 12 },
            { r: 150, c: 12 },
            { r: 300, c: 12 },
            { r: Math.max(width, height) * 2, c: 12 },
        ];

        vertices = [[clickPosition[0], clickPosition[1]]];

        rings.forEach(function (ring) {
            const variance = ring.r * 0.25;

            for (let i = 0; i < ring.c; i++) {
                const angle = (i / ring.c) * TWO_PI;
                const x = Math.cos(angle) * ring.r + clickPosition[0] + randomRange(-variance, variance);
                const y = Math.sin(angle) * ring.r + clickPosition[1] + randomRange(-variance, variance);

                vertices.push([
                    clamp(x, 0, width),
                    clamp(y, 0, height),
                ]);
            }
        });

        indices = window.Delaunay.triangulate(vertices);
    }

    function shatter(clickPosition, width, height) {
        const timeline = new window.TimelineMax({ onComplete: cleanupFragments });
        const introDuration = 0.06;
        const breakDelayFactor = 0.0008;
        const fallDelayFactor = 0.3;
        const fragmentAnimations = [];
        let maxDelay = 0;

        for (let i = 0; i < indices.length; i += 3) {
            const fragment = new Fragment(
                vertices[indices[i]],
                vertices[indices[i + 1]],
                vertices[indices[i + 2]],
            );

            const dx = fragment.centroid[0] - clickPosition[0];
            const dy = fragment.centroid[1] - clickPosition[1];
            const distance = Math.sqrt(dx * dx + dy * dy);
            const fallDistance = height + 500 + randomRange(0, 250);
            const delay = distance * breakDelayFactor * randomRange(0.9, 1.1);

            fragment.canvas.style.zIndex = String(20 + Math.floor(distance));
            window.TweenMax.set(fragment.canvas, { alpha: 0 });

            maxDelay = Math.max(maxDelay, delay);
            fragmentAnimations.push({
                canvas: fragment.canvas,
                delay: delay,
                fallDistance: fallDistance,
                driftX: dx * 0.6,
                rotationX: 30 * sign(dy),
                rotationY: 90 * -sign(dx),
                rotationZ: randomRange(-180, 180),
            });
            fragments.push(fragment);
            target.appendChild(fragment.canvas);
        }

        const fallStart = maxDelay + introDuration;

        fragmentAnimations.forEach(function (animation) {
            timeline.to(animation.canvas, introDuration, {
                alpha: 1,
                ease: window.Linear.easeNone,
            }, animation.delay);
            timeline.to(animation.canvas, 1.5, {
                y: "+=" + animation.fallDistance,
                x: "+=" + animation.driftX,
                rotationX: animation.rotationX,
                rotationY: animation.rotationY,
                rotationZ: animation.rotationZ,
                ease: window.Cubic.easeIn,
            }, fallStart + animation.delay * fallDelayFactor);
            timeline.to(animation.canvas, 0.4, { alpha: 0 }, fallStart + animation.delay * fallDelayFactor + 0.8);
        });

        timeline.call(removeOverlay, null, null, fallStart);
        disableOverlay();
    }

    function disableOverlay() {
        if (!overlay) return;

        overlay.style.pointerEvents = "none";
    }

    function removeOverlay() {
        if (!overlay) return;

        disableOverlay();
        overlay.remove();
        overlay = null;
    }

    function cleanupFragments() {
        fragments.forEach(function (fragment) {
            fragment.canvas.remove();
        });

        fragments.length = 0;
        vertices = [];
        indices = [];
    }

    function Fragment(v0, v1, v2) {
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;

        this.computeBoundingBox();
        this.computeCentroid();
        this.createCanvas();
        this.clip();
    }

    Fragment.prototype = {
        computeBoundingBox: function () {
            const xMin = Math.min(this.v0[0], this.v1[0], this.v2[0]);
            const xMax = Math.max(this.v0[0], this.v1[0], this.v2[0]);
            const yMin = Math.min(this.v0[1], this.v1[1], this.v2[1]);
            const yMax = Math.max(this.v0[1], this.v1[1], this.v2[1]);

            this.box = {
                x: xMin,
                y: yMin,
                w: Math.max(1, xMax - xMin),
                h: Math.max(1, yMax - yMin),
            };
        },
        computeCentroid: function () {
            this.centroid = [
                (this.v0[0] + this.v1[0] + this.v2[0]) / 3,
                (this.v0[1] + this.v1[1] + this.v2[1]) / 3,
            ];
        },
        createCanvas: function () {
            this.canvas = document.createElement("canvas");
            this.canvas.className = "days-shatter-fragment";
            this.canvas.width = Math.ceil(this.box.w);
            this.canvas.height = Math.ceil(this.box.h);
            this.canvas.style.width = this.box.w + "px";
            this.canvas.style.height = this.box.h + "px";
            this.canvas.style.left = this.box.x + "px";
            this.canvas.style.top = this.box.y + 5 + "px";
            this.ctx = this.canvas.getContext("2d");
        },
        clip: function () {
            this.ctx.translate(-this.box.x, -this.box.y);
            this.ctx.beginPath();
            this.ctx.moveTo(this.v0[0], this.v0[1]);
            this.ctx.lineTo(this.v1[0], this.v1[1]);
            this.ctx.lineTo(this.v2[0], this.v2[1]);
            this.ctx.closePath();
            this.ctx.fillStyle = "#000000";
            this.ctx.fill();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "#ffffff10";
            this.ctx.lineJoin = "round";
            this.ctx.stroke();
        },
    };

    function randomRange(min, max) {
        return min + (max - min) * Math.random();
    }

    function clamp(x, min, max) {
        return x < min ? min : x > max ? max : x;
    }

    function sign(x) {
        return x < 0 ? -1 : 1;
    }

    createOverlay();
})();
