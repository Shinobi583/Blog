document.querySelector("#add-paragraph").addEventListener("click", function (event) {
    event.preventDefault();
    addParagraph();
});


function addParagraph() {

    let newSection = document.createElement("section");
    let newTextArea = document.createElement("textarea");
    
    setAttributes(newTextArea, { "class": "paragraph", "cols": "60", "rows": "10" });

    newSection.appendChild(newTextArea);

    document.querySelector("article").appendChild(newSection);
}

function setAttributes(el, attr) {
    for (let key in attr) {
        el.setAttribute(key, attr[key]);
    }
}