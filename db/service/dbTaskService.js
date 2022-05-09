const { Task, User } = require("../models/models");

class DBTaskService {
    async createTask(userId, date, title, hours, reported, projectId) {
        const task = await Task.create({ userId, date, title, hours, reported, projectId });
        return task;
    }

    async findTaskById(id) {
        const task = await Task.findOne({ where: { id } });
        return task;
    }

    async editTask(taskId, values) {
        const task = await Task.update(values, { where: { id: taskId } });
        return task;
    }

    async deleteTaskById(id) {
        const task = await Task.destroy({ where: { id } });
        return task;
    }

    async getTasksInfo(tasks) {
        const tasksInfo = await Task.findAll({
            where: { id: tasks },
            attributes: ['id', 'title', 'date', 'hours', 'reported', 'userId', 'projectId']
        });
        return tasksInfo;
    }

    async setTasksReported(tasks) {
        const tasksReported = await Task.update(
            { reported: true },
            { where: { id: tasks } }
        );
        return tasksReported;
    }

    async getTasks(where) {
        const tasks = await Task.findAll({
            where: { ...where },
            attributes: ['id', 'date', 'title', 'hours', 'reported', 'userId', 'projectId'],
            order: [['date', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['username', 'name', 'surname']
                }
            ]
        });
        return tasks;
    }
}

module.exports = new DBTaskService();