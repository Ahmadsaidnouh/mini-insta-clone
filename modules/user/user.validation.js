const Joi = require("joi");

const signUpValidation = {
    body: Joi.object().required().keys({
        userName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        cPassword: Joi.ref("password"),
        phone: Joi.string().required(),
        location: Joi.string().required()
    })
};

const signInValidation = {
    body: Joi.object().required().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    })
};

const updateProfileValidation = {
    body: Joi.object().required().keys({
        userName: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        location: Joi.string().required()
    })
};

const updatePasswordValidation = {
    body: Joi.object().required().keys({
        oldPassword: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        newPassword: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        cNewPassword: Joi.ref("newPassword")
    })
};

const forgetPasswordValidation = {
    body: Joi.object().required().keys({
        email: Joi.string().required().email()
    })
};

const sendConfirmationEmailValidation = {
    body: Joi.object().required().keys({
        email: Joi.string().required().email()
    })
};

const deletePostValidation = {
    body: Joi.object().required().keys({
        postId: Joi.string().required().min(24).max(24)
    })
}



module.exports = {
    signUpValidation,
    signInValidation,
    updateProfileValidation,
    updatePasswordValidation,
    forgetPasswordValidation,
    sendConfirmationEmailValidation,
    deletePostValidation
}