const AppError = require("../src/AppError");
const User = require("../models/User");
const Article = require("../models/article");
const Img = require("../models/Img");
const bcrypt = require("bcrypt");
const { escapeHtml } = require("../src/utils");

async function dashboard(req, res, next) {

    const { id } = req.params;
    try {
        const user = await User.findById(id);
        const { name, username } = user;
        res.render("users/user", { title: "Your Dashboard", name, username });
    }
    catch (err) {
        return next(new AppError());
    }
}
async function newArticleForm(req, res, next) {

    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.render("articles/new-article", { title: "New Article", user });
    }
    catch (err) {
        return next(new AppError());
    }
}
async function postArticle(req, res, next) {

    const post = req.body;
    const { title, details } = req.body;
    const dashed = title.trim().replace(/\s/g, '-').toLowerCase();
    const slug = dashed.replace(/[^\w\-]/g, '');
    const { id } = req.params;
    try {
        // Find user
        const user = await User.findById(id);

        // Grab all the paragraphs/imgs and escape html
        let pgraphs = [];
        let imgs = [];
        let keys = Object.keys(post);
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

        // Create instance and insert content
        const article = new Article({ title, details, slug, imgs, content: pgraphs, user_id: user });
        user.articles.push(article);
        await article.save({ validateBeforeSave: true });
        await user.save({ validateBeforeSave: true });
        req.flash("success", "Successfully created an Article!");
        res.redirect('/');
    }
    catch (err) {
        return next(new AppError("Couldn't add to the database! Check to make sure you filled in all required fields!"));
    }
}
function getLogin(req, res) {
    res.render("users/login", { title: "Login" });
}
async function login(req, res) {

    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const result = await bcrypt.compare(password, user.passwordHash);
        if (result) {
            req.session.loggedIn = true;
            req.session.userId = user._id;
            req.flash("success", "Successfully logged in!");
            res.redirect(`/users/${user._id}`);
        }
        else {
            req.flash("error", "Incorrect Username and/or Password");
            res.redirect('/');
        }
    }
    catch (err) {
        req.flash("error", "Incorrect Username and/or Password");
        res.redirect('/');
    }
}
function logout(req, res) {

    req.session.loggedIn = false;
    req.session.userId = '';
    req.flash("success", "Successfully logged out!");
    res.redirect('/');
}

module.exports = {
    dashboard,
    newArticleForm,
    postArticle,
    getLogin,
    login,
    logout
};