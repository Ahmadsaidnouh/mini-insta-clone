const router = require("express").Router();
const {
    signUp,
    confirmEmail,
    signIn,
    addAdmin,
    getAdminList,
    getAllUsers,
    getAdminById,
    getUserById,
    deleteAdmin,
    deleteUser,
    updateAdmin,
    blockUser,
    unBlockUser,
    searchUserByNameLike
} = require("./controller/admin.controller");
const validationFunc = require("../../middleware/validation");
const {
    signUpValidation,
    signInValidation,
    addAdminValidation,
    adminIdValidation,
    userIdValidation,
    updateAdminValidation,
    paginationValidation,
    searchUserByNameLikeValidation
} = require("./admin.validation");
const endPoints = require("../../common/endPoints");
const adminModel = require("../../DB/models/admin.model");
const auth = require("../../middleware/auth");

// apis start*************************
router.post("/admin/signUp", validationFunc(signUpValidation), signUp);

router.get("/admin/confirmEmail/:token", confirmEmail);

router.post("/admin/signIn", validationFunc(signInValidation), signIn);

router.post("/admin/addAdmin",auth("SuperAdmin", adminModel, endPoints.superAdminAuth), validationFunc(addAdminValidation), addAdmin);

router.get("/admin/getAdminList",auth("SuperAdmin", adminModel, endPoints.superAdminAuth), validationFunc(paginationValidation), getAdminList);

router.get("/admin/getAllUsers",auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), validationFunc(paginationValidation), getAllUsers);

router.get("/admin/getAdminById/:adminId",auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), validationFunc(adminIdValidation), getAdminById);

router.get("/admin/getUserById/:userId",auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), validationFunc(userIdValidation), getUserById);

router.get("/admin/searchUserByNameLike/:name",auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), validationFunc(searchUserByNameLikeValidation), searchUserByNameLike);

router.delete("/admin/deleteAdmin/:adminId",auth("SuperAdmin", adminModel, endPoints.superAdminAuth), validationFunc(adminIdValidation), deleteAdmin);

router.delete("/admin/deleteUser/:userId",auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), validationFunc(userIdValidation), deleteUser);

router.patch("/admin/updateAdmin",auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), validationFunc(updateAdminValidation), updateAdmin);

router.patch("/admin/blockUser/:userId",auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), validationFunc(userIdValidation), blockUser);

router.patch("/admin/unBlockUser/:userId",auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), validationFunc(userIdValidation), unBlockUser);
// apis end*************************


module.exports = router;