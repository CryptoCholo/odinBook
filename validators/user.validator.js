const Joi = require('joi');

const UserSchema = Joi.object({
    first_name: Joi.string()
        .pattern(new RegExp("^[a-zA-Z ]{3,20}$"))
        .trim()
        .required(),
    last_name: Joi.string()
        .pattern(new RegExp("^[a-zA-Z ]{3,20}$"))
        .trim()
        .required(),
    phone : Joi.string().pattern(new RegExp("^[0-9]{11}$")).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2022),
    password: Joi.string()
        .pattern(new RegExp('^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$')),
    confirmPassword: Joi.ref('password')
})

async function signUpValidator(req, res, next) {

    const userPayload = req.body;

    try {
        await UserSchema.validateAsync(userPayload);
        next();
    } catch (err) {
        next(err.details[0].message)
    }
}

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string()
        .pattern(new RegExp('^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$')),
})

async function loginValidator(req, res, next) {

    const userPayload = req.body;

    try {
        await loginSchema.validateAsync(userPayload);
        next();
    } catch (err) {
        next(err.details[0].message)
    }
}

module.exports = { signUpValidator, loginValidator };