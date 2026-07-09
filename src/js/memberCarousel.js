const dragScrollers = document.querySelectorAll(
    ".level-section:nth-of-type(2) .embla-wrapper, .level-section:nth-of-type(4) .image-cluster"
);

dragScrollers.forEach(scroller => {
    let isPointerDown = false;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    const dragThreshold = 6;

    scroller.addEventListener("pointerdown", event => {
        if (event.button !== 0 || event.pointerType !== "mouse") return;

        isPointerDown = true;
        isDragging = false;
        startX = event.clientX;
        startScrollLeft = scroller.scrollLeft;
        scroller.classList.add("is-pointer-down");
        scroller.setPointerCapture(event.pointerId);
    });

    scroller.addEventListener("pointermove", event => {
        if (!isPointerDown) return;

        const distance = event.clientX - startX;

        if (!isDragging && Math.abs(distance) < dragThreshold) return;

        isDragging = true;
        scroller.classList.add("is-dragging");
        scroller.scrollLeft = startScrollLeft - distance;
        event.preventDefault();
    });

    const endDrag = event => {
        if (!isPointerDown) return;

        isPointerDown = false;
        scroller.classList.remove("is-pointer-down", "is-dragging");

        if (event.pointerId && scroller.hasPointerCapture(event.pointerId)) {
            scroller.releasePointerCapture(event.pointerId);
        }

        window.setTimeout(() => {
            isDragging = false;
        }, 0);
    };

    scroller.addEventListener("pointerup", endDrag);
    scroller.addEventListener("pointercancel", endDrag);
    scroller.addEventListener("lostpointercapture", endDrag);
    scroller.addEventListener("dragstart", event => event.preventDefault());

    scroller.addEventListener("click", event => {
        if (!isDragging) return;

        event.preventDefault();
        event.stopPropagation();
    }, true);
});
