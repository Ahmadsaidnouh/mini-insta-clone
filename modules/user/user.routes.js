const router = require("express").Router();
const {
    signUp,
    confirmEmail,
    signIn,
    updateProfile,
    updatePassword,
    forgetPassword,
    forgetPasswordConfirmEmail,
    deactivateAccount,
    activateAccount,
    viewProfile,
    sendConfirmationEmail,
    deletePost,
    getUserProfilePosts
} = require("./controller/user.controller");
const validationFunc = require("../../middleware/validation");
const {
    signUpValidation,
    signInValidation,
    updateProfileValidation,
    updatePasswordValidation,
    forgetPasswordValidation,
    sendConfirmationEmailValidation,
    deletePostValidation
} = require("./user.validation");
const auth = require("../../middleware/auth");
const userModel = require("../../DB/models/user.model");
const endPoints = require("../../common/endPoints");


// apis start*************************
router.post("/user/signUp", validationFunc(signUpValidation), signUp);

router.get("/user/confirmEmail/:token", confirmEmail);

router.post("/user/signIn", validationFunc(signInValidation), signIn);

router.patch("/user/updateProfile",auth("User", userModel, endPoints.userAuth) , validationFunc(updateProfileValidation), updateProfile);

router.patch("/user/updatePassword",auth("User", userModel, endPoints.userAuth) , validationFunc(updatePasswordValidation), updatePassword);

router.patch("/user/forgetPassword", validationFunc(forgetPasswordValidation), forgetPassword);

router.get("/forgetPasswordConfirmEmail/:token", forgetPasswordConfirmEmail);

router.patch("/user/deactivateAccount", auth("User", userModel, endPoints.userAuth), deactivateAccount);

router.patch("/user/activateAccount", auth("User", userModel, endPoints.userAuth), activateAccount);

router.get("/user/viewProfile", auth("User", userModel, endPoints.userAuth), viewProfile)

router.patch("/user/sendConfirmationEmail", validationFunc(sendConfirmationEmailValidation), sendConfirmationEmail)

router.delete("/user/deletePost",  auth("User", userModel, endPoints.userAuth), validationFunc(deletePostValidation), deletePost)

router.get("/user/getUserProfilePosts",  auth("User", userModel, endPoints.userAuth), getUserProfilePosts)
// apis end*************************


module.exports = router;