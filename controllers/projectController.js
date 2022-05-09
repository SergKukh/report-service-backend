const projectService = require("../service/projectService");

class ProjectController {
    async createProject(req, res, next) {
        const { name } = req.body;
        const userId = req.user.id;
        const result = await projectService.createProject(name, userId);
        res.json(result);
    }

    async deleteProject(req, res, next) {
        const { projectId } = req.body;
        const userId = req.user.id;
        const result = await projectService.deleteProject(projectId, userId);
        res.json(result);
    }

    async getByUser(req, res, next) {
        const userId = req.user.id;
        const result = await projectService.getProjectsByUserId(userId);
        res.json(result);
    }

    async getProjectData(req, res, next) {
        const userId = req.user.id;
        const projectId = req.params.id;
        const result = await projectService.getProjectData(userId, projectId);
        res.json(result);
    }

    async inviteUser(req, res, next) {
        const { projectId, username } = req.body;
        const userId = req.user.id;
        const result = await projectService.inviteUserToProject(userId, projectId, username);
        res.json(result);
    }

    async setUserRole(req, res, next) {
        const { projectId, username, roleId } = req.body;
        const userId = req.user.id;
        const result = await projectService.setRoleToUser(projectId, username, roleId, userId);
        res.json(result);
    }

    async removeUser(req, res, next) {
        const { projectId, username } = req.body;
        const userId = req.user.id;
        const result = await projectService.removeUser(projectId, username, userId);
        res.json(result);
    }
}

module.exports = new ProjectController();