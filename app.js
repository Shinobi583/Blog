const tempFile = require("./temp-pass-file");

const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));
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
        if (err) throw err;
        let posts = result; // final is Array of objects
        res.render("home", { posts: posts });
    });
});

app.get("/articles", (req, res) => {

    let q = `SELECT title, slug, updated_at
    FROM posts
    ORDER BY updated_at DESC;`;

    connection.query(q, function (err, result) {
        if (err) throw err;
        let posts = result;
        res.render("all-articles", { posts: posts });
    });
});

app.get("/articles/:article", (req, res) => {

    let slug = req.params.article;

    let q = `SELECT title, details, paragraphs.content AS content
    FROM posts
    JOIN paragraphs
    ON posts.id = paragraphs.posts_id
    WHERE slug = "${slug}";`;

    connection.query(q, function (err, result) {
        if (err) throw err;
        let posts = result;
        res.render("article", { posts: posts });
    });
});

app.get("/search", (req, res) => {

    let { q } = req.query;
    let query = `SELECT title, slug, updated_at
    FROM posts
    WHERE title LIKE "%${q}%"
    ORDER BY updated_at DESC;`;

    connection.query(query, function (err, result) {
        if (err) throw err;
        let posts = result;
        res.render("search", { posts: posts });
    });
});

/* Change login to be something for admin only? Perhaps on the bottom of page or something. */

app.get("/login", (req, res) => {

    res.render("login");
});

app.post("/login", (req, res) => {

    res.redirect('/');
});

// Temp routes, should be under users id/articles/new for both get and post.
app.get("/new-article", (req, res) => {

    let q = `SELECT COUNT(*) AS COUNT FROM posts;`;
    connection.query(q, function (err, result) {
        if (err) throw err;
        let count = result[0].COUNT;
        res.render("new-article", { count: count });
    });
});

app.post("/new-article", (req, res) => {

    let post = req.body;
    let regex = new RegExp(' ', 'g');
    let slug = post.title.replace(regex, '-').toLowerCase();
    let userId = 1; // the user id should be a variable based on logged in.

    let q = `INSERT INTO posts(title, slug, details, users_id)
    VALUES("${post.title}", "${slug}", "${post.details}", ${userId});`;

    connection.query(q, function (err, result) {
        if (err) throw err;
    });

    let pgraphs = [];
    let keys = Object.keys(post);
    for (let i = 2; i < keys.length; i++) {
        if (keys[i].slice(0, 7) === "content") {
            pgraphs.push(post[keys[i]]);
        }
    }
    let count = parseInt(post.articleCount);
    for (let i = 0; i < pgraphs.length; i++) {
        let q = `INSERT INTO paragraphs(content, place, posts_id)
        VALUES("${pgraphs[i]}", ${i}, ${count + 1});`;
        connection.query(q, function (err, result) {
            if (err) throw err;
        });
    }
    res.redirect("/articles");
});

// Must be at end for all other routes because of only one response for HTTP.
app.get('*', (req, res) => {

    res.send("The page you are looking for doesn't exist! Sorry!");
});

app.listen(3000, () => {
    console.log("Server has started on port 3000");
});