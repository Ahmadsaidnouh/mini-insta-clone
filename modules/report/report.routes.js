const router = require("express").Router();
const {
    reportPost,
    reviewReport
} = require("./controller/report.controller");
const validationFunc = require("../../middleware/validation");
const {
    reportPostValidation,
    reviewReportValidation
} = require("./report.validation");
const auth = require("../../middleware/auth");
const userModel = require("../../DB/models/user.model");
const adminModel = require("../../DB/models/admin.model");
const endPoints = require("../../common/endPoints");

// apis start*************************
router.post("/report/reportPost", auth("User", userModel, endPoints.userAuth), validationFunc(reportPostValidation), reportPost)

router.patch("/report/reviewReport", auth("(Super)Admin", adminModel, endPoints.superAdminOrAdminAuth), validationFunc(reviewReportValidation), reviewReport)
// apis end*************************



module.exports = router;