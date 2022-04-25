const postModel = require("../../../DB/models/post.model");
const reportModel = require("../../../DB/models/report.model");


const reportPost = async (req, res) => {
    let { postId, reportComment} = req.body;
    let userId = req.user._id;
    try {
        const post = await postModel.findOne({_id: postId});
        if(post) {
            const createdReport = new reportModel({ postId, userId, reportComment });
            const addedReport = await createdReport.save();
            res.json({message: "Post reported successfully", addedReport});
        }
        else {
            res.status(400).json({message: "Post with such id doesn't exist!!"});
        }
    } catch (error) {
        res.status(400).json({message: "Post with such id doesn't exist!!"});
    }
}

const reviewReport = async (req, res) => {
    let {reportId} = req.body;
    try {
        const report = await reportModel.findOne({_id: reportId});
        if(report) {
            try {
                const post = await postModel.findOne({_id: report.postId});
                if(post.desc.includes("bad")) {
                    const updatedPost = await postModel.findByIdAndUpdate(post._id, {postBlocked: true}, {new: true})
                    res.json({message: "Post blocked successfully for containing 'bad' word!!", updatedPost});
                }
                else {
                    res.json({message: "Post is good 'bala8 kaydy ya ba4a'!!"});
                }
            } catch (error) {
                res.status(400).json({message: "Post with such id doesn't exist!!"})
            }
        }
        else {
            res.status(400).json({message: "Report with such id doesn't exist!!"})
        }
    } catch (error) {
        res.status(400).json({message: "Report with such id doesn't exist!!"})
    }
}


module.exports = {
    reportPost,
    reviewReport
}