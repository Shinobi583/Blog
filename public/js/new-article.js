document.querySelector("#add-paragraph").addEventListener("click", function (e) {
    e.preventDefault();
    addParagraphAndSection();
});
document.querySelector("article").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.classList.contains("del-paragraph")) {
        deleteParagraph(e.target);
    }
    if (e.target.classList.contains("del-section")) {
        deleteSection(e.target);
    }
});

// Escape special characters

let pNum = 2;


function addParagraphAndSection() {
    let newSection = document.createElement("section");
    let newTextArea = document.createElement("textarea");
    let deleteSect = document.createElement("button");
    deleteSect.textContent = "Delete Section";
    let deletePara = document.createElement("button");
    deletePara.textContent = "Delete Paragraph";
    
    setAttributes(newTextArea, { "class": "paragraph", "name": `content${pNum++}`, "cols": "60", "rows": "10" });
    setAttributes(deleteSect, { "class": "del-section" });
    setAttributes(deletePara, { "class": "del-paragraph" });

    newSection.append(newTextArea, deletePara, deleteSect);

    document.querySelector("article").appendChild(newSection);
}

function deleteParagraph(btn) {
    let pgraph = btn.previousElementSibling;
    pgraph.remove();
    btn.remove();
}

function deleteSection(btn) {
    let sect = btn.parentElement;
    sect.remove();
    btn.remove();
}

function setAttributes(el, attr) {
    for (let key in attr) {
        el.setAttribute(key, attr[key]);
    }
}