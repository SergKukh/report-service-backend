const { Router } = require('express');
const projectController = require('../controllers/projectController');
const errorHandler = require('../errors/errorHandler');

const router = new Router();

router.post('/create', errorHandler(projectController.createProject)); // create project
router.delete('/delete', errorHandler(projectController.deleteProject)); // delete project
router.get('/', errorHandler(projectController.getByUser)); // get user's projects
router.get('/:id', errorHandler(projectController.getProjectData)) // get project's info
router.post('/invite', errorHandler(projectController.inviteUser)); // invite user to project
router.put('/setRole', errorHandler(projectController.setUserRole)); // set role to user in project
router.delete('/removeUser', errorHandler(projectController.removeUser)); // remove user from project

module.exports = router;