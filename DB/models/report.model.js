const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportComment: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    postId: {
        type: mongoose.Types.ObjectId,
        ref: "post"
    }
}, {timestamps: true});

const reportModel = mongoose.model("report", reportSchema);

module.exports = reportModel;