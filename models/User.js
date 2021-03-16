const mongoose = require("mongoose");
const Article = require("./Article");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    articles: [
        {
            type: Schema.Types.ObjectId, ref: "Article"
        }
    ]
});

UserSchema.post("findOneAndDelete", async function (user) {
    if (user.articles.length) {
        Article.deleteMany({ _id: { $in: user.articles } });
    }
});

module.exports = mongoose.model("User", UserSchema);