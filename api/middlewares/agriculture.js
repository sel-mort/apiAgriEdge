const userSchema = require('../validators/agriculture');
const utils = require('../utils');

exports.createValidator = (req, res, next) => {
  const { error } = userSchema.createAgricultureValidator.validate(req.body);

  if (!error) return next();

  res.status(400).send({ error: utils.prettyError(error) });
};