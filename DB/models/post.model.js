const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    postBlocked: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;