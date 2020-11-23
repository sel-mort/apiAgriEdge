const utils = require('../utils');

const User = require('../models/user');

const bcryptjs = require("bcryptjs");

//const passport = require('../middlewares/passport');

exports.create = async (req, res, next) => {
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
    const sendMail = utils.sendEmail(user.email, 'verification mail', 'verification mail');

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
        message: {
          'en': 'something went wrong',
          'ar': 'هناك خطأ ما',
          'fr': 'quelque chose s\'est mal passé'
        }
      });
    }
    
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.getUserByEmail(req.body.email);
    console.log(user)
    if (user) {
      const isValidPassword = await bcryptjs.compare(req.body.password, user.password);
      if (isValidPassword) {

        if (user.emailVerified) {

          const token = utils.generateToken({'_id': user._id, 'email': user.email});

          return res.status(200).send({ message: {
            'en': token,
            'ar': token,
            'fr': token
          } });
        } else {
          return res.status(200).send({ message: {
            'en': "email not verified, check your inbox",
            'ar': "لم يتم التحقق من البريد الإلكتروني ، تحقق من صندوق الوارد الخاص بك",
            'fr': "email non vérifié, vérifiez votre boîte de réception"
          } });
        }
      }
    } else {
        return res.status(403).send({ error: { 
          'en': 'invalid credentials',
          'ar': 'بيانات الاعتماد غير صالحة',
          'fr': 'les informations d\'identification invalides'
      } });
  }
    
  } catch (err) {
    console.log(err)
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

exports.getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-_id')
      .select('firstName')
      .select('lastName');

    if (!user) {
      return res.status(404).send({ message: 'resource not found' });
    }
    res.status(200).send({ exists: true });
  } catch (err) {
    next(err);
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

exports.verify = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      {
        $set: { verfied: true }
      }
    );
    res.status(200).send({ message: 'user verified' });
  } catch (err) {
    next(err);
  }
};

exports.authToken = (req, res) => {
  res.status(200).send({ token: req.user });
};
