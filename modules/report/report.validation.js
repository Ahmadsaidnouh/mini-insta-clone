const Joi = require("joi");

const reportPostValidation = {
    body: Joi.object().required().keys({
        postId: Joi.string().required().min(24).max(24),
        reportComment: Joi.string().required()
    })
};

const reviewReportValidation = {
    body: Joi.object().required().keys({
        reportId: Joi.string().required().min(24).max(24)
    })
};


module.exports = {
    reportPostValidation,
    reviewReportValidation
}