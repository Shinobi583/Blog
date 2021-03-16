const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const AppError = require("./src/AppError");
const Article = require("./models/Article");
const User = require("./models/User");
const { escapeHtml } = require("./src/utils");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => { console.log("Database connected."); });


app.get('/', async (req, res, next) => {

    try {
        const posts = await Article.find({});
        res.render("home", { posts, title: "The Great Divide" });
    }
    catch (err) {
        return next(new AppError());
    }
});

app.get("/articles", async (req, res, next) => {

    try {
        const posts = await Article.find({});
        res.render("articles/all-articles", { posts, title: "Articles" });
    }
    catch (err) {
        return next(new AppError());
    }
});

// permission should be required for new entry and post
app.get("/users/:id/articles/new", async (req, res) => {

    const { id } = req.params;
    const user = await User.findById(id);
    res.render("articles/new-article", { title: "New Article", user });
});

app.post("/users/:id/articles", async (req, res, next) => {

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

// Add link for edit article if validated user, else just show the article
app.get("/articles/:article", async (req, res, next) => {

    const slug = req.params.article;
    try {
        const post = await Article.findOne({ slug: slug }).populate("user_id", "name");
        const { title, details, content, user_id } = post;
        res.render("articles/article", { post, title, slug, details, content, user_id });
    }
    catch (err) {
        return next(new AppError());
    }
});

// permission should be required for these next 3 article routes
app.get("/articles/:article/edit", async (req, res, next) => {

    const slug = req.params.article;
    try {
        const post = await Article.findOne({ slug: slug });
        const { title, details, content } = post;
        res.render("articles/edit-article", { post, title, details, slug, content });
    }
    catch (err) {
        return next(new AppError());
    }
});

app.patch("/articles/:article", async (req, res, next) => {

    const slug = req.params.article;
    const post = req.body;
    const { title, details } = req.body;
    const dashed = title.trim().replace(/\s/g, '-').toLowerCase();
    const newSlug = dashed.replace(/[^\w\-]/g, '');

    let pgraphs = [];
    let keys = Object.keys(post);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i].slice(0, 7) === "content") {
            let escaped = escapeHtml(post[keys[i]]);
            pgraphs.push(escaped);
        }
    }

    try {
        await Article.findOneAndUpdate({ slug: slug }, { title, details, slug: newSlug, content: pgraphs, updatedAt: Date.now() }, { runValidators: true });
        res.redirect("/articles");
    }
    catch (err) {
        return next(new AppError("Couldn't update the database! Check to make sure you filled in all required fields!"));
    }
});

app.delete("/articles/:article", async (req, res, next) => {

    const slug = req.params.article;
    try {
        const result = await Article.findOneAndDelete({ slug: slug });
        if (result) {
            res.redirect("/articles");
        }
        else {
            return next(new AppError("Couldn't find the article to delete!"));
        }
    }
    catch (err) {
        return next(new AppError("Couldn't find the article to delete!"));
    }
});

app.get("/search", async (req, res, next) => {

    const { q } = req.query;
    const regex = new RegExp(q, "i");
    try {
        const posts = await Article.find({ title: regex });
        res.render("search", { posts, title: "The Great Divide | Search" });
    }
    catch (err) {
        console.log(err);
        return next(new AppError());
    }
});

/* Have login be something for admin only. */

app.get("/secret/login", (req, res) => {

    res.render("login", { title: "Login" });
});

app.post("/login", (req, res) => {

    res.redirect('/');
});

// Must be at end for all other routes
app.get('*', (req, res, next) => {
    return next(new AppError());
});

// Error handler
app.use((err, req, res, next) => {
    const { message } = err;
    res.render("error", { title: "Can't find page", message });
});

app.listen(3000, () => {
    console.log("Server has started on port 3000");
});