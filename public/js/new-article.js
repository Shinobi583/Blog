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

function addParagraphAndSection() {
    let pNum = document.querySelectorAll("textarea").length;
    let newSection = document.createElement("section");
    let newTextArea = document.createElement("textarea");
    let deleteSect = document.createElement("button");
    deleteSect.textContent = "Delete Section";
    let deletePara = document.createElement("button");
    deletePara.textContent = "Delete Paragraph";
    
    setAttributes(newTextArea, { "class": "paragraph", "name": `content${pNum}`, "cols": "60", "rows": "10" });
    setAttributes(deleteSect, { "class": "del-section" });
    setAttributes(deletePara, { "class": "del-paragraph" });

    newSection.append(newTextArea, deletePara, deleteSect);

    document.querySelector("article").appendChild(newSection);
}

function deleteParagraph(btn) {
    let pgraph = btn.previousElementSibling;
    pgraph.remove();
    btn.remove();
    updateParagraphs();
}

function updateParagraphs() {
    let pgraphs = document.querySelectorAll("textarea");
    for (let i = 0, pNum = pgraphs.length; i < pNum; i++) {
        pgraphs[i].name = `content${i}`;
    }
}

function deleteSection(btn) {
    let sect = btn.parentElement;
    sect.remove();
    btn.remove();
    updateParagraphs();
}

function setAttributes(el, attr) {
    for (let key in attr) {
        el.setAttribute(key, attr[key]);
    }
}