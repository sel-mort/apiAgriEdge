const Joi = require('@hapi/joi');

const phonePattern = /^[+][(]{0,1}[0-9]{1,4}[)]{0,1}[\s\./0-9]*$/;

const fullName = Joi.string().min(3).max(100).required();
const email =  Joi.string().email().required();
const phone = Joi.string().regex(phonePattern).required();
const password = Joi.string().min(4).max(100).required();
const repeatPassword = Joi.any().valid(Joi.ref('password')).required();
const token = Joi.string().required();

exports.createUserValidator = Joi.object().keys({ fullName: fullName, email: email, phone: phone, password: password });

exports.loginUserValidator = Joi.object().keys({ email: email, password: password });

exports.updateUserValidator = Joi.object().keys({ fullName: fullName, email: email });

exports.getUserByUsernameValidator = Joi.object().keys({ username: Joi.string().required() });

exports.forgotPasswordValidator = Joi.object().keys({ email: email });

exports.resetPasswordValidator = Joi.object().keys({ password: password, repeatPassword: repeatPassword});

exports.verficationValidator = Joi.object().keys({ token: token });

exports.phoneValidator = Joi.object().keys({ phone: phone });