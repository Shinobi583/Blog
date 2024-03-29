const mongoose = require("mongoose");
const Img = require("./Img");
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
    imgs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Img"
        }
    ],
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

ArticleSchema.post("findOneAndDelete", async function (article, next) {
    if (article) {
        try {
            const user = await User.findById(article.user_id);
            user.articles.pull(article._id);
            await user.save();
            await Img.deleteMany({ _id: { $in: article.imgs } });
        }
        catch (err) {
            console.log(err);
        }
    }
});
ArticleSchema.post("findOneAndUpdate", async function (article, next) {
    if (article) {
        try {
            await Img.deleteMany({ _id: { $in: article.imgs } });
        }
        catch (err) {
            console.log(err);
        }
    }
});
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;