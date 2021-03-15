const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
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

module.exports = mongoose.model("User", UserSchema);