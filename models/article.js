const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    details: {
        type: String,
        required: true
    },
    content: {
        type: [String],
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ArticleSchema.post("findOneAndDelete", async function (article) {
    const user = await User.findById(article.user_id);
    user.articles.pull(article._id);
    user.save();
});

module.exports = mongoose.model("Article", ArticleSchema);