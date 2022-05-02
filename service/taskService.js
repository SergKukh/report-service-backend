const dbTaskService = require("../db/service/dbTaskService");
const dbProjectService = require("../db/service/dbProjectService");
const ApiError = require("../errors/ApiError");
const { Op } = require('sequelize');
const dbUserService = require("../db/service/dbUserService");

class TaskService {
    async createTask(userId, date, title, hours, projectId) {
        if (!date || !title || !hours || !projectId) {
            throw ApiError.badRequest(`Required params: projectId, date, title, hours`);
        }

        const project = await dbProjectService.findProjectById(projectId);
        if (!project) {
            throw ApiError.badRequest(`Project not found`);
        }

        const task = await dbTaskService.createTask(userId, date, title, hours, false, projectId);
        return task;
    }

    async editTask(taskId, userId, date, title, hours) {
        if (!taskId || !userId) {
            throw ApiError.badRequest(`Required params: taskId, userId`);
        }

        let editValues = {};
        if (date) editValues = { ...editValues, date };
        if (title) editValues = { ...editValues, title };
        if (hours) editValues = { ...editValues, hours };

        if (!Object.keys(editValues).length) {
            return editValues;
        }

        let task = await dbTaskService.findTaskById(taskId);
        if (!task) {
            throw ApiError.badRequest(`Task not found`);
        }

        if (task.userId !== userId) {
            throw ApiError.forbidden(`Task is not yours`);
        }

        task = await dbTaskService.editTask(taskId, editValues);
        return task;
    }

    async deleteTask(taskId, userId) {
        if (!taskId) {
            throw ApiError.badRequest(`taskId is required`);
        }

        let task = await dbTaskService.findTaskById(taskId);
        if (!task) {
            throw ApiError.badRequest(`Task not found`);
        }

        if (task.userId !== userId) {
            throw ApiError.forbidden(`Task is not yours`);
        }

        task = await dbTaskService.deleteTaskById(taskId);
        return task;
    }

    async makeTasksReported(tasks, userId) {
        if (!tasks) {
            throw ApiError.badRequest(`tasks is required`);
        }

        const tasksInfo = await dbTaskService.getTasksInfo(tasks);
        if (!tasksInfo.length) {
            throw ApiError.badRequest(`Tasks not found`);
        }

        const projectId = tasksInfo[0].projectId;
        tasksInfo.forEach(value => {
            if (projectId !== value.projectId) {
                throw ApiError.badRequest(`Tasks must be from the same project`);
            }
        });
        await this._checkAdminRights();
        const tasksReported = await dbTaskService.setTasksReported(tasks);
        return tasksReported;
    }

    async getOwnTasks(userId, projectId, reported, since, till) {
        if (!reported) {
            reported = false;
        }

        let where = { userId, reported };
        where = this._setContidionsToGetTasks(where, projectId, since, till);
        const tasks = await dbTaskService.getTasks(where);
        return tasks;
    }

    async getAllTasks(userId, projectId, reported, since, till) {
        if (!reported) {
            reported = false;
        }

        await this._checkAdminRights();

        let where = { reported };
        where = this._setContidionsToGetTasks(where, projectId, since, till);
        const tasks = await dbTaskService.getTasks(where);
        return tasks;
    }

    _setContidionsToGetTasks(where, projectId, since, till) {
        if (projectId) where = { ...where, projectId };
        if (since) {
            where = {
                ...where, date: {
                    [Op.gte]: since
                }
            };
        }
        if (till) {
            where = {
                ...where, date: {
                    ...where.date,
                    [Op.lte]: till
                }
            };
        }
        return where;
    }

    async _checkAdminRights(userId, projectId) {
        const userRoleId = await dbProjectService.getUserRole(userId, projectId);
        const roleOwnerId = await dbUserService.getOwnerRole();
        const roleAdminId = await dbUserService.getAdminRole();
        if (userRoleId !== roleOwnerId || userRoleId !== roleAdminId) {
            throw ApiError.forbidden(`You don't have permission`);
        }
    }
}

module.exports = new TaskService();