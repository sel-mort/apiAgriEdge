const nodemailer = require('nodemailer');
const { resolve } = require('path');


exports.sendEmail = (to, message, subject) => {

  var transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465,
      service: 'gmail',
      auth: {
          user: 'oussbak16@gmail.com',
          pass: 'ptudootdtysfdgxl'
      }
  });

  var mailOptions = {
      from: 'oussbak16@gmail.com',
      to: to,
      subject: subject,
      html: message
  };

  try {
     transporter.sendMail(mailOptions);
     return true;
  } catch (error) {
    return false;
  }
}
