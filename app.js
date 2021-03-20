const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const AppError = require("./src/AppError");
const Article = require("./models/Article");
const articleRoutes = require("./routes/articles");
const userRoutes = require("./routes/users");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use("/articles", articleRoutes);
app.use("/users", userRoutes);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

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
        const posts = await Article.find({}).sort({ updatedAt: -1 }).limit(7);
        res.render("home", { posts, title: "The Great Divide" });
    }
    catch (err) {
        return next(new AppError());
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

app.get("/secret/login", (req, res) => {

    res.render("login", { title: "Login" });
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