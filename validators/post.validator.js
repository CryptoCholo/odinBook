const Joi = require('joi');

const postSchema = Joi.object({
    content : Joi.string().trim().required()
})

async function postValidator(req, res, next) {

    const userPayload = req.body;

    try {
        await postSchema.validateAsync(userPayload);
        next();
    } catch (err) {
        next(err.details[0].message)
    }
}
module.exports = { postValidator }