const utils = require('../utils');

const User = require('../models/user');

const bcryptjs = require("bcryptjs");

//const passport = require('../middlewares/passport');

exports.create = async (req, res) => {
  const user = new User(req.body);
  try {

    const emailExists = await User.emailExists(req.body.email);

    if (emailExists) {
      return res.status(403).send({ error: {
          'en': 'email already exists',
          'ar': 'البريد الالكتروني موجود بالفعل',
          'fr': 'l\'email existe déjà'
        } });
    }

    const phoneExists = await User.phoneExists(req.body.phone);

    if (phoneExists) {
      return res.status(403).send({ error: { 
          'en': 'phone already exists',
          'ar': 'الهاتف موجود بالفعل',
          'fr': 'le téléphone existe déjà'
        } });
    }
    // send email verificqtion before create the user
    user.token = utils.generateToken({email: user.email});
    const sendMail = utils.sendEmail(user.email, 'verification mail',
      `<a href="https://localhost:4000/api/users/verify/${user.token}">Verify my account</a>`);
      
    if (sendMail) {

      await user.save();

      return res.status(201).send({
        message: {
          'en': 'user created, email verification sent',
          'ar': 'تم إنشاء المستخدم ، تم إرسال التحقق من البريد الإلكتروني',
          'fr': 'utilisateur créé, vérification par e-mail envoyée'
        }
      });
    }
    else {
      return res.status(400).send({
        error: {
          'en': 'something went wrong',
          'ar': 'هناك خطأ ما',
          'fr': 'quelque chose s\'est mal passé'
        }
      });
    }
    
  } catch (err) {
      return res.status(400).send({
        error: {
          'en': 'something went wrong',
          'ar': 'هناك خطأ ما',
          'fr': 'quelque chose s\'est mal passé'
        }
      });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.getUserByProp(req.body.email);

    if (user) {
      const isValidPassword = await bcryptjs.compare(req.body.password, user.password);
      if (isValidPassword) {

        if (user.emailVerified) {

          const token = utils.generateToken({'_id': user._id, 'email': user.email});

          return res.status(200).send({ message: { 'en': token, 'ar': token, 'fr': token} });

        } else {
            return res.status(200).send({ message: {
              'en': "email not verified, check your inbox",
              'ar': "لم يتم التحقق من البريد الإلكتروني ، تحقق من صندوق الوارد الخاص بك",
              'fr': "email non vérifié, vérifiez votre boîte de réception"
            } });
        }
      }
    } else {
      return res.status(401).send({ error: { 
        'en': 'invalid credentials',
        'ar': 'بيانات الاعتماد غير صالحة',
        'fr': 'les informations d\'identification invalides'
      } });
  }
    
  } catch (err) {
      return res.status(400).send({
        error: {
          'en': 'something went wrong',
          'ar': 'هناك خطأ ما',
          'fr': 'quelque chose s\'est mal passé'
        }
      });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const token = utils.generateToken({email: req.body.email});
    const sendMail = utils.sendEmail(req.body.email, 'reset password',
      `<a href="https://localhost:4200/users/resetpassword/${token}">reset my password</a>`);

    if (sendMail) {
      return res.status(200).send({
        message: {
          'en': 'reset password email sent',
          'ar': 'تم إرسال البريد الإلكتروني لإعادة تعيين كلمة المرور',
          'fr': 'e-mail de réinitialisation du mot de passe envoyé'
        }
      })
    }
    else {
      return res.status(400).send({
        error: {
          'en': 'something went wrong',
          'ar': 'هناك خطأ ما',
          'fr': 'quelque chose s\'est mal passé'
        }
      });
    }

  } catch (err) {

    return res.status(400).send({
      error: {
        'en': 'something went wrong',
        'ar': 'هناك خطأ ما',
        'fr': 'quelque chose s\'est mal passé'
      }
    })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const verifyToken = await utils.verfiyToken(req.params.token);
    const user = await User.getUserByProp(verifyToken.email);

    if (user) {
      const newPassword = await bcryptjs.hash(req.body.password, 10);
      await User.updateOne(
        { email: user.email },
        {
          $set: { password: newPassword }
        }
      );
      return res.status(200).send({
        message: {
          'en': 'password reseted successfully',
          'fr': 'réinitialisation du mot de passe avec succès',
          'ar': 'تمت إعادة تعيين كلمة المرور بنجاح'
        } });
    }
    else {
      return res.status(401).send({
        error: {
          'en': 'something went wrong',
          'ar': 'هناك خطأ ما',
          'fr': 'quelque chose s\'est mal passé'
        }
      })
    }

  } catch (err) {
      return res.status(401).send({
        error: {
          'en': 'something went wrong',
          'ar': 'هناك خطأ ما',
          'fr': 'quelque chose s\'est mal passé'
        }
      })
  }
}

exports.verify = async (req, res) => {
  try {
    const verifyToken = await utils.verfiyToken(req.params.token);
    
    const user = await User.getUserByProp(verifyToken.email);
    
    if (user) {
      await User.updateOne(
        { email: user.email },
        {
          $set: { emailVerified: true }
        }
      );
      res.status(200).send({ message: {'en': 'user verified', 'fr': 'utilisateur vérifié', 'ar': 'تم التحقق من المستخدم'} });
    }
    else {
      res.status(400).send({ error: {'en': 'invalid token', 'fr': 'jeton invalide', 'ar': 'رمز غير صالح'} });
    }
    
  } catch (err) {
    res.status(400).send({ error: {'en': 'invalid token', 'fr': 'jeton invalide', 'ar': 'رمز غير صالح'} });
  }
};

exports.update = async (req, res, next) => {
  try {
    if (req.body.username) {
      const usernameExists = await User.usernameExists(req.body.username);

      if (usernameExists) {
        return res.status(403).send({ message: 'username is already exists' });
      }
    }

    if (req.body.email) {
      const emailExists = await User.emailExists(req.body.email);

      if (emailExists) {
        return res.status(403).send({ message: 'email is already exists' });
      }
    }

    let user = await User.findOne({ _id: req.user._id });

    // Check email is updated
    if (req.body.email && req.body.email !== user.email) {
      user.emailActivated = false;
    }

    // Update user object with given values
    for (const key in req.body) {
      const value = req.body[key];

      user[key] = value;
    }

    user = await user.save();

    res.status(200).send({ message: 'User updated', user });
  } catch (err) {
    next(err);
  }
};

exports.me = (req, res, next) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    next(err);
  }
};