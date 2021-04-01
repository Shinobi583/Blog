document.querySelector("#add-paragraph").addEventListener("click", function (e) {
    e.preventDefault();
    addSection();
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
document.querySelector("#del-article").addEventListener("click", function (e) {
    const form = document.querySelector("#deleteForm");
    showDelForm(this, form);
});

function addSection() {
    const pNum = document.querySelectorAll("textarea").length;
    const iNum = document.querySelectorAll(".img").length;
    const oNum = document.querySelectorAll(".owner").length;
    const newSection = document.createElement("section");
    const imgLabel = document.createElement("label");
    imgLabel.textContent = "Add Image";
    const addImg = document.createElement("input");
    addImg.type = "text";
    const owner = document.createElement("input");
    owner.type = "text";
    const newTextArea = document.createElement("textarea");
    const deleteSect = document.createElement("button");
    deleteSect.textContent = "Delete Section";
    const deletePara = document.createElement("button");
    deletePara.textContent = "Delete Paragraph";
    
    setAttributes(newSection, { "class": "article-section" });
    setAttributes(imgLabel, { "class": "d-block" });
    setAttributes(addImg, { "class": "img forms-text", "name": `img${iNum}`, "placeholder": "URL" });
    setAttributes(owner, { "class": "owner forms-text", "name": `owner${oNum}`, "placeholder": "Owner of Image" });
    setAttributes(newTextArea, { "class": "paragraph inputs", "name": `content${pNum}`, "rows": "12" });
    setAttributes(deleteSect, { "class": "del-section deleteBtn formBtn" });
    setAttributes(deletePara, { "class": "del-paragraph deleteBtn formBtn" });

    newSection.append(imgLabel, addImg, owner, newTextArea, deletePara, deleteSect);

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

function updateImgs() {
    const imgs = document.querySelectorAll(".img");
    for (let i = 0, iNum = imgs.length; i < iNum; i++) {
        imgs[i].name = `img${i}`;
    }
}

function updateOwners() {
    const owners = document.querySelectorAll(".owner");
    for (let i = 0, oNum = owners.length; i < oNum; i++) {
        owners[i].name = `owner${i}`;
    }
}

function deleteSection(btn) {
    const sect = btn.parentElement;
    sect.remove();
    btn.remove();
    updateParagraphs();
    updateImgs();
    updateOwners();
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

function showDelForm(btn, form) {
    btn.previousElementSibling.classList.toggle("d-none");
    form.classList.toggle("d-none");
    form.classList.toggle("d-inline");
    btn.classList.toggle("deleteBtn");
    btn.classList.toggle("postBtn");
    if (btn.textContent === "Cancel Deleting") {
        btn.textContent = "Delete Article";
    }
    else {
        btn.textContent = "Cancel Deleting";
    }
}