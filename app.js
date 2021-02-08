const tempFile = require("./temp-pass-file");

const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

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

    let q = `SELECT title, details, content
    FROM posts
    WHERE slug = "${slug}";`;

    connection.query(q, function (err, result) {
        if (err) throw err;
        let posts = result;
        res.render("article", { posts: posts });
    });
});

/* Change login to be something for admin only? Perhaps on the bottom of page or something. */

app.get("/login", (req, res) => {

    res.render("login");
});

app.post("/login", (req, res) => {

    res.redirect("/");
});

// Temp route, should be under users id/articles/new. articles part being a page where you can see all of your posts.
app.get("/new-article", (req, res) => {

    res.render("new-article");
});

// Must be at end for all other routes because of only one response for HTTP. So if it gets here, send this.
app.get('*', (req, res) => {

    res.send("The page you are looking for doesn't exist! Sorry!");
});

app.listen(3000, () => {
    console.log("Server has started on port 3000");
});