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
const User = mongoose.model("User", UserSchema);

module.exports = User;