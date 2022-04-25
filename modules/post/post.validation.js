const Joi = require("joi");

const createPostValidation = {
    body: Joi.object().required().keys({
        title: Joi.string().required(),
        desc: Joi.string().required()
    })
}

const editPostValidation = {
    body: Joi.object().required().keys({
        title: Joi.string().required(),
        desc: Joi.string().required(),
        postId: Joi.string().required().min(24).max(24)
    })
}

const deletePostValidation = {
    body: Joi.object().required().keys({
        postId: Joi.string().required().min(24).max(24),
    })
}

const getUserProfilePostsValidation = {
    body: Joi.object().required().keys({
        userId: Joi.string().required().min(24).max(24),
    })
}

const paginationValidation = {
    query: Joi.object().required().keys({
        page: Joi.number().required(),
        limit: Joi.number().required()
    })
}


module.exports = {
    createPostValidation,
    editPostValidation,
    deletePostValidation,
    getUserProfilePostsValidation,
    paginationValidation
}