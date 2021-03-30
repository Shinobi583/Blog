const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImgSchema = new Schema({
    url: {
        type: String
    },
    owner: {
        type: String
    }
});
const Img = mongoose.model("Img", ImgSchema);

module.exports = Img;