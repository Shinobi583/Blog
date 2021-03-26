const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const { validateUser } = require("../src/utils");

router.get("/:id", validateUser, users.dashboard);

router.get("/:id/articles/new", validateUser, users.newArticleForm);

router.post("/:id/articles", validateUser, users.postArticle);

// Login post
router.post('/', users.login);

// Logout post. Only for admin right now
router.post("/:id", validateUser, users.logout);

module.exports = router;