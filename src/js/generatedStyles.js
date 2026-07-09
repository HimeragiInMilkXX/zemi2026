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