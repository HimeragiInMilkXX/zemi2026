const levelSections = document.querySelectorAll(".level-section");

levelSections.forEach( section => {

    const marginTop = section.dataset.mtop + "px";
    const marginBottom = section.dataset.mbottom + "px";
    const gap = section.dataset.gap + "px";

    section.style.marginTop = marginTop;
    section.style.marginBottom = marginBottom;
    section.style.gap = gap;

})

const detailButton = document.querySelectorAll(".detail-button");

detailButton.forEach( button => {

    const paddingTopBottom = button.dataset.ptb + "px";
    const paddingLeftRight = button.dataset.plr + "px";
    const fontSize = button.dataset.size + "px";

    button.style.padding = `${paddingTopBottom} ${paddingLeftRight}`;

    button.querySelector("span").style.fontSize = fontSize;

})

const zemiName = document.querySelector(".zemi-name");

if (zemiName) {
    zemiName.tabIndex = 0;
    zemiName.setAttribute("role", "button");

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    zemiName.addEventListener("click", scrollToTop);

    zemiName.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        scrollToTop();
    });
}
