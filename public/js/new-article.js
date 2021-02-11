document.querySelector("#add-paragraph").addEventListener("click", function (e) {
    e.preventDefault();
    addParagraph();
});

// Escape special characters

let i = 2;


function addParagraph() {

    let newSection = document.createElement("section");
    let newTextArea = document.createElement("textarea");
    
    setAttributes(newTextArea, { "class": "paragraph", "name": `content${i++}`, "cols": "60", "rows": "10" });

    newSection.appendChild(newTextArea);

    document.querySelector("article").appendChild(newSection);
}

function setAttributes(el, attr) {
    for (let key in attr) {
        el.setAttribute(key, attr[key]);
    }
}