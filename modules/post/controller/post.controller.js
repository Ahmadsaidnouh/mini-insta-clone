const userModel = require("../../../DB/models/user.model");
const postModel = require("../../../DB/models/post.model");
const reportModel = require("../../../DB/models/report.model");


const createPost = async (req, res) => {
    let { title, desc } = req.body;
    let createdBy = req.user._id;
    const createdPost = new postModel({ title, desc, createdBy });
    const addedPost = await createdPost.save();
    res.json({ message: "Post created successfully", post: addedPost });
}

const editPost = async (req, res) => {
    let { title, desc, postId } = req.body;
    try {
        let post = await postModel.findOne({ _id: postId });
        if (post) {
            if (post.createdBy.equals(req.user._id)) {
                const updatedPost = await postModel.findByIdAndUpdate(postId, { title, desc }, { new: true });
                res.json({ message: "Post edited successfully!!", updatedPost });
            }
            else {
                res.status(400).json({ message: "Unauthorized action ... not post owner!!" });
            }
        }
        else {
            res.status(400).json({ message: "Post with such id doesn't exist!!" })
        }
    } catch (error) {
        res.status(400).json({ message: "Post with such id doesn't exist!!" })
    }
}

const deletePost = async (req, res) => {
    let { postId } = req.body;
    try {
        let post = await postModel.findOne({ _id: postId });
        if (post) {
            await reportModel.deleteMany({ postId });
            const dPost = await postModel.deleteOne({ _id: postId });
            res.json({ message: "Post deleted successfully!!", dPost });
        }
        else {
            res.status(400).json({ message: "Post with such id doesn't exist!!" })
        }
    } catch (error) {
        res.status(400).json({ message: "Post with such id doesn't exist!!" })
    }
}

const getUserProfilePosts = async (req, res) => {
    let { userId } = req.body;
    try {
        const user = await userModel.findOne({ _id: userId });
        if (user) {
            try {
                const posts = await postModel.find({ createdBy: userId }).populate([{
                    path: "createdBy",
                    model: "user",
                    select: "userName"
                }]);
                if (posts.length) {
                    res.json({ message: "Done", userPosts: posts });
                }
                else {
                    res.status(400).json({ message: "User didn't create posts yet!!" })
                }
            } catch (error) {
                res.json({ message: "UserId is in-valid!!", error });
            }
        }
        else {
            res.json({ message: "User with such id doesn't exist!!" });
        }
    } catch (error) {
        res.json({ message: "User with such id doesn't exist!!", error });
    }
}

const getValidPosts = async (req, res) => {
    

    const cursor = await postModel.find({}).populate([{
        path: "createdBy",
        model: "user",
        select: "userName"
    }]).cursor();
    let validPosts = [];
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        try {
            let user = await userModel.findOne({ _id: doc.createdBy });
            if (user) {
                if (user.accountActive && !user.accountBlocked) {
                    validPosts.push(doc);
                }
            }
        } catch (error) {
            res.status(400).json({ message: "User with such id doesn't exist!!", error })
        }
    }
    res.json({ message: "Done.", validPosts })
}

const getAllPosts = async (req, res) => {
    let { page, limit } = req.query;
    if (!page) {
        page = 1;
    }
    if (!limit) {
        limit = 4;
    }
    let skipItems = (page - 1) * limit;

    const allPosts = await postModel.find({}).populate([{
        path: "createdBy",
        model: "user",
        select: "userName"
    }]).limit(limit).skip(skipItems);
    res.json({ message: "Done.", allPosts })
}


module.exports = {
    createPost,
    editPost,
    deletePost,
    getUserProfilePosts,
    getValidPosts,
    getAllPosts
}