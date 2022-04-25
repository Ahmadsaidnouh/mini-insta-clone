const router = require("express").Router();
const {
    createPost,
    editPost,
    deletePost,
    getUserProfilePosts,
    getValidPosts,
    getAllPosts
} = require("./controller/post.controller");
const validationFunc = require("../../middleware/validation");
const {
    createPostValidation,
    editPostValidation,
    deletePostValidation,
    getUserProfilePostsValidation,
    paginationValidation
} = require("./post.validation");
const auth = require("../../middleware/auth");
const userModel = require("../../DB/models/user.model");
const adminModel = require("../../DB/models/admin.model");
const endPoints = require("../../common/endPoints");

// apis start*************************
router.post("/post/createPost", auth("User", userModel, endPoints.userAuth), validationFunc(createPostValidation), createPost);

router.patch("/post/editPost", auth("User", userModel, endPoints.userAuth), validationFunc(editPostValidation), editPost);

router.delete("/post/deletePost", auth("Admin", adminModel, endPoints.adminAuth), validationFunc(deletePostValidation), deletePost);

router.get("/post/getUserProfilePosts", auth("Admin", adminModel, endPoints.adminAuth), validationFunc(getUserProfilePostsValidation), getUserProfilePosts);

router.get("/post/getValidPosts", auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), getValidPosts);

router.get("/post/getAllPosts", auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), validationFunc(paginationValidation), getAllPosts);
// apis end*************************


module.exports = router;