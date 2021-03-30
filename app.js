if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const AppError = require("./src/AppError");
const Article = require("./models/Article");
const articleRoutes = require("./routes/articles");
const userRoutes = require("./routes/users");
const mongoSanitize = require('express-mongo-sanitize');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(mongoSanitize());
const sessionConfig = {
    secret: process.env.secret,
    name: "sessId.usid",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24, // one day
        maxAge: 1000 * 60 * 60 * 24
    }
    // store: mongo store soon
};
app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.userId = req.session.userId;
    return next();
});
app.use("/articles", articleRoutes);
app.use("/users", userRoutes);

mongoose.connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
        return next(new AppError());
    }
});

// Must be at end for all other routes
app.get('*', (req, res, next) => {
    return next(new AppError());
});

// Error handler
app.use((err, req, res, next) => {
    const { message } = err;
    res.render("error", { title: "Can't find page", message, err });
});

app.listen(3000, () => {
    console.log("Server has started on port 3000");
});