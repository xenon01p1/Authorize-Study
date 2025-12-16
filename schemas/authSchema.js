import joi from "joi";

export const loginSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().required()
});

export const registerSchema = joi.object({
    roleId: joi.number().positive().required(),
    username: joi.string().required(),
    password: joi.string().required()
});

export const refreshTokenSchema = joi.object({
    refreshToken: joi.string().required()
});