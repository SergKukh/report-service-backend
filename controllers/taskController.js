const taskService = require("../service/taskService");

class TaskController {
    async create(req, res) {
        const { date, title, hours, projectId } = req.body;
        const userId = req.user.id;
        const result = await taskService.createTask(userId, date, title, hours, projectId);
        res.json(result);
    }

    async edit(req, res) {
        const { taskId, date, title, hours } = req.body;
        const userId = req.user.id;
        const result = await taskService.editTask(taskId, userId, date, title, hours);
        res.json(result);
    }

    async delete(req, res) {
        const { taskId } = req.body;
        const userId = req.user.id;
        const result = await taskService.deleteTask(taskId, userId);
        res.json(result);
    }

    async makeReported(req, res) {
        const { tasks } = req.body; // [ taskId ]
        const userId = req.user.id;
        const result = await taskService.makeTasksReported(tasks, userId);
        res.json(result);
    }

    async getOwnTasks(req, res) {
        // not required, default: reported = false
        const { projectId, reported, since, till } = req.query;
        const userId = req.user.id;
        const result = await taskService.getOwnTasks(userId, projectId, reported, since, till);
        res.json(result);
    }

    async getAllTasks(req, res) {
        // not required, default: reported = false
        const { projectId, reported, since, till } = req.query;
        const userId = req.user.id;
        const result = await taskService.getOwnTasks(userId, projectId, reported, since, till);
        res.json(result);
    }
}

module.exports = new TaskController();