const { generateToken, verfiyToken } = require('./jwt');
const { sendEmail } = require('./email');
const prettyError = require('./prettyerror');
const { userId } = require('./getUserId');
const { verificationPhone } = require('./phone');

module.exports = {
  generateToken,
  verfiyToken,
  sendEmail,
  prettyError,
  userId,
  verificationPhone
};
