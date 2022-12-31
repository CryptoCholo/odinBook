const Joi = require('joi');

const postSchema = Joi.object({
    content : Joi.string().trim().required()
})

async function postValidator(req, res, next) {

    const postPayload = req.body;

    try {
        await postSchema.validateAsync(postPayload);
        next();
    } catch (err) {
        next(err.details[0].message)
    }
}
module.exports = { postValidator }