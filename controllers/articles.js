const AppError = require("../src/AppError");
const Article = require("../models/Article");
const Img = require("../models/Img");
const { escapeHtml } = require("../src/utils");

async function index(req, res, next) {

    try {
        const posts = await Article.find({});
        res.render("articles/all-articles", { posts, title: "Articles" });
    }
    catch (err) {
        return next(new AppError());
    }
}
async function showArticle(req, res, next) {

    const slug = req.params.article;
    try {
        const post = await Article.findOne({ slug: slug }).populate("user_id", "name").populate("imgs");
        const { title, details, imgs, content, user_id } = post;
        let contentNum = content.length;
        if (imgs.length > contentNum) {
            contentNum = imgs.length;
        }
        res.render("articles/article", { post, title, slug, details, contentNum, imgs, content, user_id });
    }
    catch (err) {
        return next(new AppError());
    }
}
async function editForm(req, res, next) {

    const slug = req.params.article;
    try {
        const post = await Article.findOne({ slug: slug }).populate("imgs");
        const { title, details, imgs, content } = post;
        let contentNum = content.length;
        if (imgs.length > contentNum) {
            contentNum = imgs.length;
        }
        res.render("articles/edit-article", { post, title, slug, details, contentNum, imgs, content });
    }
    catch (err) {
        return next(new AppError());
    }
}
async function update(req, res, next) {

    const slug = req.params.article;
    const post = req.body;
    const { title, details } = req.body;
    const dashed = title.trim().replace(/\s/g, '-').toLowerCase();
    const newSlug = dashed.replace(/[^\w\-]/g, '');

    let pgraphs = [];
    let imgs = [];
    let keys = Object.keys(post);
    try {
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].slice(0, 7) === "content") {
                let escaped = escapeHtml(post[keys[i]]);
                pgraphs.push(escaped);
            }
            if (keys[i].slice(0, 3) === "img" && post[keys[i]] !== '') {
                const img = new Img({ url: post[keys[i]], owner: post[keys[i + 1]] });
                imgs.push(img);
                await img.save({ validateBeforeSave: true });
            }
        }
        await Article.findOneAndUpdate({ slug: slug }, { title, details, slug: newSlug, imgs, content: pgraphs, updatedAt: Date.now() }, { runValidators: true });
        req.flash("success", `Successfully updated "${title}"!`);
        res.redirect("/");
    }
    catch (err) {
        return next(new AppError("Couldn't update the database! Check to make sure you filled in all required fields!"));
    }
}
async function deleteArticle(req, res, next) {

    const slug = req.params.article;
    try {
        const result = await Article.findOneAndDelete({ slug: slug });
        if (result) {
            req.flash("success", `Successfully deleted "${result.title}"!`);
            res.redirect("/");
        }
        else {
            return next(new AppError("Couldn't find the article to delete!"));
        }
    }
    catch (err) {
        return next(new AppError("Couldn't find the article to delete!"));
    }
}

module.exports = {
    index,
    showArticle,
    editForm,
    update,
    deleteArticle
};