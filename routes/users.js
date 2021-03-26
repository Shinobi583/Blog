const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const AppError = require("../src/AppError");
const User = require("../models/User");
const Article = require("../models/Article");
const { escapeHtml, validateUser } = require("../src/utils");

router.get("/:id", validateUser, async (req, res, next) => {

    const { id } = req.params;
    try {
        const user = await User.findById(id);
        const { name, username } = user;
        res.render("user", { title: "Your Dashboard", name, username });
    }
    catch (err) {
        return next(new AppError());
    }
});

router.get("/:id/articles/new", validateUser, async (req, res) => {

    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.render("articles/new-article", { title: "New Article", user });
    }
    catch (err) {
        return next(new AppError());
    }
});

router.post("/:id/articles", validateUser, async (req, res, next) => {

    const post = req.body;
    const { title, details } = req.body;
    const dashed = title.trim().replace(/\s/g, '-').toLowerCase();
    const slug = dashed.replace(/[^\w\-]/g, '');
    const { id } = req.params;
    try {
        // Find user
        const user = await User.findById(id);

        // Grab all the paragraphs and escape html
        let pgraphs = [];
        let keys = Object.keys(post);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].slice(0, 7) === "content") {
                let escaped = escapeHtml(post[keys[i]]);
                pgraphs.push(escaped);
            }
        }

        // Create instance and insert all content
        const article = new Article({ title, details, slug, content: pgraphs, user_id: user });
        user.articles.push(article);
        await article.save({ validateBeforeSave: true });
        await user.save({ validateBeforeSave: true });
        req.flash("success", "Successfully created an Article!");
        res.redirect('/');
    }
    catch (err) {
        return next(new AppError("Couldn't add to the database! Check to make sure you filled in all required fields!"));
    }
});

// Login post
router.post('/', async (req, res) => {

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
});

// Logout post. Only for admin right now
router.post("/:id", validateUser, (req, res) => {

    req.session.loggedIn = false;
    req.session.userId = '';
    req.flash("success", "Successfully logged out!");
    res.redirect('/');
});

module.exports = router;