const { Router } = require('express');
const taskController = require('../controllers/taskController');
const errorHandler = require('../errors/errorHandler');

const router = new Router();

router.post('/', errorHandler(taskController.create)); // create new task
router.put('/', errorHandler(taskController.edit)); // edit task
router.delete('/', errorHandler(taskController.delete)); // delete task
router.put('/reported', errorHandler(taskController.makeReported)); // make tasks reported
router.get('/', errorHandler(taskController.getOwnTasks)); // get user's tasks
router.get('/all', errorHandler(taskController.getAllTasks)); // get all project tasks (admin/owner only)

module.exports = router;