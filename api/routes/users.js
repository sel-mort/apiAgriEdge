const router = require('express').Router();
//const { isAuth } = require('../middlewares/auth');
const usersController = require('../controllers/users');
//const userValidator = require('../middlewares/user');

router.post('/register', usersController.create);
router.get('/register', (req, res) =>{
    return res.send("from get register")
});
/*
router.post(
  '/login',
  userValidator.loginValidator,
  usersController.login,
  usersController.authToken
);

router.get('/me', isAuth, usersController.me);

router.patch(
  '/',
  isAuth,
  userValidator.updateValidator,
  usersController.update
);

router.get(
  '/:username',
  userValidator.getUserByUsername,
  usersController.getUserByUsername
);

router.get(
  '/verification/:token',
  userValidator.verify,
  usersController.verify
);*/


module.exports = router;
