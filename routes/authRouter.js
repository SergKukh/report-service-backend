const { Router } = require('express');
const authController = require('../controllers/authController');
const errorHandler = require('../errors/errorHandler');

const router = new Router();

router.post('/registration', errorHandler(authController.registration));
router.post('/login', errorHandler(authController.login));

module.exports = router;