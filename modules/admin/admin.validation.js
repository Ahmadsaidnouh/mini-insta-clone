const Joi = require("joi");

const signUpValidation = {
    body: Joi.object().required().keys({
        adminName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        cPassword: Joi.ref("password"),
        phone: Joi.string().required(),
        location: Joi.string().required()
    })
}

const signInValidation = {
    body: Joi.object().required().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    })
}

const addAdminValidation = {
    body: Joi.object().required().keys({
        adminName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        cPassword: Joi.ref("password"),
        role: Joi.string().required(),
        phone: Joi.string().required(),
        location: Joi.string().required()
    })
}

const adminIdValidation = {
    params: Joi.object().required().keys({
        adminId: Joi.string().required().min(24).max(24)
    })
}

const userIdValidation = {
    params: Joi.object().required().keys({
        userId: Joi.string().required().min(24).max(24)
    })
}

const updateAdminValidation = {
    body: Joi.object().required().keys({
        adminId: Joi.string().required().min(24).max(24),
        adminName: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        location: Joi.string().required()
    })
}

const paginationValidation = {
    query: Joi.object().required().keys({
        page: Joi.number().required(),
        limit: Joi.number().required()
    })
}

const searchUserByNameLikeValidation = {
    params: Joi.object().required().keys({
        name: Joi.string().required()
    })
    
}


module.exports = {
    signUpValidation,
    signInValidation,
    addAdminValidation,
    adminIdValidation,
    userIdValidation,
    updateAdminValidation,
    paginationValidation,
    searchUserByNameLikeValidation
}