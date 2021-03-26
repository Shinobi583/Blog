const express = require("express");
const router = express.Router();
const articles = require("../controllers/articles");
const { validateUser } = require("../src/utils");

router.get("/", articles.index);

router.get("/:article", articles.showArticle);

router.get("/:article/edit", validateUser, articles.editForm);

router.patch("/:article", validateUser, articles.update);

router.delete("/:article", validateUser, articles.deleteArticle);

module.exports = router;