const tempFile = require("./temp-pass-file");

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mysql = require("mysql");
const path = require("path");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: tempFile.pass.password,
    database: "blog"
    //Escape certain characters to avoid injection attacks if using below
    //multipleStatements: true
});


app.get('/', (req, res) => {

    let q = `SELECT title, slug, updated_at
    FROM posts
    ORDER BY updated_at DESC LIMIT 5;`;

    connection.query(q, function (err, result) {
        if (err) {
            console.log(err);
            res.render("error", { title: "Can't find page" });
        }
        else {
            let posts = result;
            res.render("home", { posts: posts, title: "The Great Divide" });
        }
    });
});

app.get("/articles", (req, res) => {

    let q = `SELECT title, slug, updated_at
    FROM posts
    ORDER BY updated_at DESC;`;

    connection.query(q, function (err, result) {
        if (err) {
            console.log(err);
            res.render("error", { title: "Can't find page" });
        }
        else {
            let posts = result;
            res.render("all-articles", { posts: posts, title: "Articles" });
        }
    });
});

// permission should be required for new entry and post
app.get("/articles/new", (req, res) => {

    res.render("new-article", { title: "New Article" });
});

app.post("/articles", (req, res) => {

    let post = req.body;
    let { title, details } = req.body;
    let dashed = title.trim().replace(/\s/g, '-').toLowerCase();
    let slug = dashed.replace(/[^\w\-]/g, '');
    let userId = 1; // the user id should be a variable based on logged in.

    // Insert into posts first, paragraphs table depends on it
    let q = `INSERT INTO posts(title, slug, details, users_id)
    VALUES("${title}", "${slug}", "${details}", ${userId});`;

    connection.query(q, function (err, result) {
        if (err) {
            console.log(err);
        }
    });

    // Grab all the paragraphs and escape quotes
    let pgraphs = [];
    let keys = Object.keys(post);
    for (let i = 2; i < keys.length; i++) {
        if (keys[i].slice(0, 7) === "content") {
            let escaped = escapeHtml(post[keys[i]]);
            pgraphs.push(escaped);
        }
    }
    // Grab recent article id
    let maxid;
    connection.query("SELECT MAX(id) AS maxid FROM posts;", function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            maxid = result[0].maxid;
            for (let i = 0; i < pgraphs.length; i++) {
                let qu = `INSERT INTO paragraphs(content, place, posts_id)
                VALUES("${pgraphs[i]}", ${i}, ${maxid});`;
                connection.query(qu, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });
    res.redirect("/articles");
});

app.get("/articles/:article", (req, res) => {

    let slug = req.params.article;

    let q = `SELECT title, details, paragraphs.content AS content
    FROM posts
    JOIN paragraphs
    ON posts.id = paragraphs.posts_id
    WHERE slug = "${slug}";`;

    connection.query(q, function (err, result) {
        if (err) {
            console.log(err);
            res.render("error", { title: "Can't find page" });
        }
        else {
            let post = result;
            if (post.length) {
                res.render("article", { post: post, title: post[0].title, details: post[0].details });
            }
            else {
                res.render("error", { title: "Can't find page" });
            }
        }
    });
});

// permission should be required for these article routes
app.get("/articles/:article/edit", (req, res) => {

    let slug = req.params.article;

    let q = `SELECT title, details, slug, paragraphs.content AS content
    FROM posts
    JOIN paragraphs
    ON posts.id = paragraphs.posts_id
    WHERE slug = "${slug}";`;

    connection.query(q, function (err, result) {
        if (err) {
            console.log(err);
            res.render("error", { title: "Can't find page" });
        }
        else {
            let post = result;
            res.render("edit-article", { post: post, title: post[0].title, details: post[0].details, slug: slug });
        }
    });
});

app.patch("/articles/:article", (req, res) => {

    let slug = req.params.article;
    let post = req.body;
    let { title, details } = req.body;
    let dashed = title.trim().replace(/\s/g, '-').toLowerCase();
    let newSlug = dashed.replace(/[^\w\-]/g, '');

    connection.query(`SELECT id, place FROM posts JOIN paragraphs ON posts.id = paragraphs.posts_id WHERE slug = "${slug}";`, function (err, result) {
        let id = result[0].id;
        let placeIndex = result.length - 1;

        let q = `UPDATE posts SET title = "${title}", slug = "${newSlug}", details = "${details}"
        WHERE id = ${id};`;
        connection.query(q, function (err, result) {
            if (err) {
                console.log(err);
            }
        });

        let pgraphs = [];
        let keys = Object.keys(post);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].slice(0, 7) === "content") {
                let escaped = escapeHtml(post[keys[i]]);
                pgraphs.push(escaped);
            }
        }
        for (let i = 0, len = pgraphs.length; i < len; i++) {
            let qu = '';
            if (placeIndex < i) {
                qu = `INSERT INTO paragraphs(content, place, posts_id)
                VALUES("${pgraphs[i]}", ${i}, ${id});`;
            }
            else {
                qu = `UPDATE paragraphs SET content = "${pgraphs[i]}", place = ${i}
                WHERE posts_id = ${id} AND place = ${i}`;
            }
            connection.query(qu, function (err, result) {
                if (err) {
                    console.log(err);
                }
            });
            if ((i + 1 === len) && (len <= placeIndex)) {
                // delete remaining paragraphs based on new update
                connection.query(`DELETE FROM paragraphs WHERE posts_id = ${id} AND place > ${i}`, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });
    res.redirect("/articles");
});

app.delete("/articles/:article", (req, res) => {

    let slug = req.params.article;

    let q = `DELETE FROM posts WHERE slug = "${slug}";`;

    connection.query(q, function (err, result) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/articles");
});

app.get("/search", (req, res) => {

    let { q } = req.query;
    let query = `SELECT title, slug, updated_at
    FROM posts
    WHERE title LIKE "%${q}%"
    ORDER BY updated_at DESC;`;

    connection.query(query, function (err, result) {
        if (err) {
            console.log(err);
            res.render("error", { title: "Can't find page" });
        }
        else {
            let posts = result;
            res.render("search", { posts: posts, title: "The Great Divide | Search" });
        }
    });
});

/* Have login be something for admin only. */

app.get("/secret/login", (req, res) => {

    res.render("login", { title: "Login" });
});

app.post("/login", (req, res) => {

    res.redirect('/');
});

// Must be at end for all other routes because of only one response for HTTP.
app.get('*', (req, res) => {

    res.send("The page you are looking for doesn't exist! Sorry!");
});

app.listen(3000, () => {
    console.log("Server has started on port 3000");
});

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\\/g, "&bsol;")
        .replace(/\?/g, "&quest;");
}