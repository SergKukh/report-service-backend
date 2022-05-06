const { Router } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const errorHandler = require('../errors/errorHandler');

const router = new Router();

router.post('/registration', errorHandler(authController.registration));
router.post('/login', errorHandler(authController.login));
router.get('/check', authMiddleware, errorHandler(authController.check))

module.exports = router;