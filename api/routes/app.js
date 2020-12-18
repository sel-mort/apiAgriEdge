const router = require('express').Router();
const { isAuth } = require('../middlewares/auth');
const agricultureController = require('../controllers/agriculture');
const agricultureValidator = require('../middlewares/agriculture');

router.post('/parcel/save', isAuth, agricultureValidator.createValidator, agricultureController.create);

module.exports = router;
