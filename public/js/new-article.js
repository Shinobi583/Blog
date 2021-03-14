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
document.querySelector("#submit").addEventListener("click", function (e) {
    const inputs = document.querySelectorAll(".inputs");
    for (let input of inputs) {
        let isValid = checkValidity(input);
        if (!isValid) {
            e.preventDefault();
            e.stopPropagation();
            input.classList.add("invalid");
        }
        else {
            input.classList.remove("invalid");
        }
    }
});

function addParagraphAndSection() {
    const pNum = document.querySelectorAll("textarea").length;
    const newSection = document.createElement("section");
    const newTextArea = document.createElement("textarea");
    const deleteSect = document.createElement("button");
    deleteSect.textContent = "Delete Section";
    const deletePara = document.createElement("button");
    deletePara.textContent = "Delete Paragraph";
    
    setAttributes(newTextArea, { "class": "paragraph", "name": `content${pNum}`, "cols": "60", "rows": "10" });
    setAttributes(deleteSect, { "class": "del-section" });
    setAttributes(deletePara, { "class": "del-paragraph" });

    newSection.append(newTextArea, deletePara, deleteSect);

    document.querySelector("article").appendChild(newSection);
}

function deleteParagraph(btn) {
    const pgraph = btn.previousElementSibling;
    pgraph.remove();
    btn.remove();
    updateParagraphs();
}

function updateParagraphs() {
    const pgraphs = document.querySelectorAll("textarea");
    for (let i = 0, pNum = pgraphs.length; i < pNum; i++) {
        pgraphs[i].name = `content${i}`;
    }
}

function deleteSection(btn) {
    const sect = btn.parentElement;
    sect.remove();
    btn.remove();
    updateParagraphs();
}

function setAttributes(el, attr) {
    for (let key in attr) {
        el.setAttribute(key, attr[key]);
    }
}

function checkValidity(input) {
    if (input.value === '') {
        return false;
    }
    return true;
}