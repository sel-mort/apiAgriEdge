const utils = require('../utils');

const User = require('../models/user');

//const passport = require('../middlewares/passport');

exports.create = async (req, res, next) => {
  const user = new User(req.body);
  try {

    const emailExists = await User.emailExists(req.body.email);

    if (emailExists) {
      return res.status(403).send({ error: { 
          'en': { email: 'email already exists' },
          'ar': { email: 'البريد الالكتروني موجود بالفعل' },
          'fr': { email: 'l\'email existe déjà' }
        } });
    }

    const phoneExists = await User.phoneExists(req.body.phone);

    if (phoneExists) {
      return res.status(403).send({ error: { 
          'en': { phone: 'phone already exists' },
          'ar': { phone: 'الهاتف موجود بالفعل' },
          'fr': { phone: 'le téléphone existe déjà' }
        } });
    }
    // send email verificqtion before create the user
    const sendMail = utils.sendEmail('oussbak16@gmail.com', user.email, 'verification mail', 'verification mail');
    
    if (sendMail) {

      await user.save();

      return res.status(201).send({
        message: {
          'en': { phone: 'user created, email verification sent' },
          'ar': { phone: 'تم إنشاء المستخدم ، تم إرسال التحقق من البريد الإلكتروني' },
          'fr': { phone: 'utilisateur créé, vérification par e-mail envoyée' }
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

    if (user) {
      const validPassword = await User.isValidPassword(req.body.password);

      if (validPassword) {

        if (user.emailVerified) {

          const token = utils.generateToken({'_id': user._id, 'email': user._email});

          return res.status(200).send({ message: {
            'en': { token: token },
            'ar': { token: token },
            'fr': { token: token }
          } });
        }
      }
    }
    return res.status(403).send({ error: { 
      'en': { user: 'invalid credentials' },
      'ar': { user: '' },
      'fr': { user: '' }
    } });
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
