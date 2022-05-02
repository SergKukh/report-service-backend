const { Router } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authRouter = require('./authRouter');
const projectRouter = require('./projectRouter');
const taskRouter = require('./taskRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/project', authMiddleware, projectRouter);
router.use('/task', authMiddleware, taskRouter);

module.exports = router;