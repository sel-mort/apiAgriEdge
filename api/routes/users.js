const router = require('express').Router();
//const { isAuth } = require('../middlewares/auth');
const usersController = require('../controllers/users');
const userValidator = require('../middlewares/user');

router.post('/register', userValidator.createValidator, usersController.create);

router.post(
  '/login',
  userValidator.loginValidator,
  usersController.login,
  usersController.authToken
);

module.exports = router;
