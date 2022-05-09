const dbProjectService = require("../db/service/dbProjectService");
const dbTaskService = require("../db/service/dbTaskService");
const dbUserService = require("../db/service/dbUserService");
const ApiError = require("../errors/ApiError");

class ProjectService {
    async createProject(name, userId) {
        if (!name) {
            throw ApiError.badRequest(`project name required`);
        }
        if (!userId) {
            throw ApiError.badRequest(`userId required`);
        }
        const user = await dbUserService.findUserByUserId(userId);
        if (!user) {
            throw ApiError.badRequest(`User is not found`);
        }
        const project = await dbProjectService.createProject(name, userId);
        return project;
    }

    async deleteProject(projectId, userId) {
        if (!projectId) {
            throw ApiError.badRequest(`projectId required`);
        }
        if (!userId) {
            throw ApiError.badRequest(`userId required`);
        }
        const ownerId = await dbProjectService.getProjectOwnerUserId(projectId);
        if (ownerId !== userId) {
            throw ApiError.forbidden(`You are not owner of project`);
        }
        const participants = await dbProjectService.deleteAllParticipantsByProjectId(projectId);
        const project = await dbProjectService.deleteProjectById(projectId);
        return project;
    }

    async getProjectsByUserId(userId) {
        const projects = await dbProjectService.findProjectsByUserId(userId);
        return projects;
    }

    async getProjectData(userId, projectId) {
        const data = {};
        data.project = await dbProjectService.findProjectById(projectId);
        data.roleId = await dbProjectService.getUserRole(userId, projectId);
        data.roles = await dbUserService.getAllRoles();
        data.participants = await dbProjectService.findProjectParticipats(projectId);
        const adminRights = this._checkUserAdministratorRights(userId, projectId);
        if (adminRights) {
            data.tasks = await dbTaskService.getTasks({ projectId, reported: false });
        } else {
            data.tasks = await dbTaskService.getTasks({ projectId, userId, reported: false });
        }

        return data;
    }

    async inviteUserToProject(userId, projectId, username) {
        // check role
        const isAdminRights = await this._checkUserAdministratorRights(userId, projectId);
        if (!isAdminRights) {
            throw ApiError.forbidden(`You don't have permission to invite users`);
        }
        // chek user
        const user = await dbUserService.findUserByUsername(username);
        if (!user) {
            throw ApiError.badRequest(`User is not found`);
        }
        const roleUser = await dbUserService.getUserRole();
        const participant = await dbProjectService.addUserToProject(user.id, projectId, roleUser.id);
        return participant;
    }

    async setRoleToUser(projectId, username, roleId, userId) {
        if (!projectId || !username || !roleId) {
            throw ApiError.badRequest(`required params: projectId, username, roleId`);
        }

        const userRoleId = await dbProjectService.getUserRole(userId, projectId);
        const roleAdmin = await dbUserService.getAdminRole();
        const roleOwner = await dbUserService.getOwnerRole();
        if (userRoleId !== roleAdmin.id && userRoleId !== roleOwner.id) {
            throw ApiError.forbidden(`You don't have permission to set user's roles`);
        }

        if (roleId === roleOwner.id) {
            throw ApiError.forbidden(`You can't give owner role to user`);
        }

        const user = await dbUserService.findUserByUsername(username);
        if (!user) {
            throw ApiError.badRequest(`User is not found`);
        }

        let participant = await dbProjectService.findUser(user.id, projectId);
        if (!participant) {
            throw ApiError.badRequest(`User ${username} is not participant of project`);
        }

        if (roleId === participant.roleId) {
            throw ApiError.badRequest(`${username} already has this role`);
        }

        if (participant.roleId === roleAdmin && userRoleId === roleAdmin) {
            throw ApiError.forbidden(`You don't have permission to set roles for admins`);
        }

        participant = await dbProjectService.setUserRole(user.id, projectId, roleId);
        return participant;
    }

    async removeUser(projectId, username, userId) {
        if (!projectId || !username) {
            throw ApiError.badRequest(`required params: projectId, username`);
        }

        const userRoleId = await dbProjectService.getUserRole(userId, projectId);
        const ownerRole = await dbUserService.getOwnerRole();
        if (userRoleId !== ownerRole.id) {
            throw ApiError.forbidden(`You can't remove users from project`);
        }
        const user = await dbUserService.findUserByUsername(username);
        if (!user) {
            throw ApiError.badRequest(`User is not found`);
        }

        const participant = await dbProjectService.removeUserFromProject(user.id, projectId);
        return participant;
    }

    async _checkUserAdministratorRights(userId, projectId) {
        const roleId = await dbProjectService.getUserRole(userId, projectId);
        const roleAdmin = await dbUserService.getAdminRole();
        const roleOwner = await dbUserService.getOwnerRole();
        if (roleId !== roleAdmin.id && roleId !== roleOwner.id) {
            return false;
        }
        return true;
    }
}

module.exports = new ProjectService();