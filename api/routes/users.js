const router = require('express').Router();
//const { isAuth } = require('../middlewares/auth');
const usersController = require('../controllers/users');
const userValidator = require('../middlewares/user');

router.post('/register', userValidator.createValidator, usersController.create);

router.post('/login', userValidator.loginValidator, usersController.login);

router.get('/verify/:token', usersController.verify);

router.post('/forgotpassword', userValidator.forgotPasswordValidator, usersController.forgotPassword);

router.post('/resetpassword', userValidator.resetPasswordValidator, usersController.resetPassword);

router.post('/phonevalidation', userValidator.phoneValidator, usersController.verifyPhone);

router.post('/checkToken', usersController.checkToken);

module.exports = router;
