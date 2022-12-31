const Joi = require('joi');

const commentSchema = Joi.object({
    content : Joi.string().trim().required()
})

async function commentValidator(req, res, next) {

    const commentPayload = req.body;

    try {
        await commentSchema.validateAsync(commentPayload);
        next();
    } catch (err) {
        next(err.details[0].message)
    }
}
module.exports =  commentValidator 