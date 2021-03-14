const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
        // make unique
    },
    details: {
        type: String,
        required: true
    },
    content: {
        type: [String],
        required: true
    }
    // add created at and updated at with Date.
    // add user id
});

module.exports = mongoose.model("Article", ArticleSchema);