const userSchema = require('../validators/users');
const utils = require('../utils');

exports.createValidator = (req, res, next) => {
  const { error } = userSchema.createUserValidator.validate(req.body);

  if (!error) return next();

  res.status(400).send({ error: utils.prettyError(error) });
};

exports.loginValidator = (req, res, next) => {
  const { error } = userSchema.loginUserValidator.validate(req.body);

  if (!error) return next();

  res.status(400).send({ error: utils.prettyError(error) });
};