const nodemailer = require('nodemailer');


exports.sendEmail = (to, message, subject) => {

  var transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465,
      service: 'gmail',
      auth: {
          user: 'oussbak16@gmail.com',
          pass: 'kqxolyblhemfblll'
      }
  });

  var mailOptions = {
      from: 'oussbak16@gmail.com',
      to: to,
      subject: subject,
      html: message
  };
  var send;
  transporter.sendMail(mailOptions, this.send = function (error, info) {
      if (error) {
          return false;
      } else {
          return true;
      }
  });
  console.log(send)
  return send;
}
