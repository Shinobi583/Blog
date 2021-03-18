const express = require("express");
const router = express.Router();
const AppError = require("../src/AppError");
const User = require("../models/User");
const Article = require("../models/Article");
const { escapeHtml } = require("../src/utils");

// permission should be required for all these routes
router.get("/:id/articles/new", async (req, res) => {

    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.render("articles/new-article", { title: "New Article", user });
    }
    catch (err) {
        return next(new AppError());
    }
});

router.post("/:id/articles", async (req, res, next) => {

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
        res.redirect("/articles");
    }
    catch (err) {
        return next(new AppError("Couldn't add to the database! Check to make sure you filled in all required fields!"));
    }
});

router.post("/", (req, res) => {

    res.redirect('/');
});

module.exports = router;