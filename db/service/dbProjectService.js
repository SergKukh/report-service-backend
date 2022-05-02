const ApiError = require("../../errors/ApiError");
const { Project, Participant, Role } = require("../models/models");
const dbUserService = require("./dbUserService");

class DBProjectService {
    async createProject(name, userId) {
        const role = await dbUserService.getOwnerRole();

        if (!role) {
            throw ApiError.internal(`Server error! Role Owner is not found`);
        }

        const project = await Project.create({ name });
        const participant = await Participant.create({
            projectId: project.id,
            userId,
            roleId: role.id
        });
        return project;
    }

    async findProjectById(projectId) {
        const project = await Project.findOne({ where: { id: projectId } });
        return project;
    }

    async findProjectsByUserId(userId) {
        const projects = await Participant.findAll({
            where: { userId },
            attributes: [],
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'name'],
                    required: false
                },
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name', 'title'],
                    required: false
                }

            ]
        });
        return projects;
    }

    async findUser(userId, projectId) {
        const participant = await Participant.findOne({ where: { userId, projectId } });
        return participant;
    }

    async deleteProjectById(projectId) {
        const project = await Project.destroy({ where: { id: projectId } });
        return project;
    }

    async deleteAllParticipantsByProjectId(projectId) {
        const participants = await Participant.destroy({ where: { projectId } });
        return participants;
    }

    async getProjectOwnerUserId(projectId) {
        const role = await dbUserService.getOwnerRole();
        const participant = await Participant.findOne({
            where: {
                projectId,
                roleId: role.id
            }
        });
        return participant.userId;
    }

    async getUserRole(userId, projectId) {
        const participant = await Participant.findOne({ where: { userId, projectId } });
        return participant.roleId;
    }

    async setUserRole(userId, projectId, roleId) {
        const participant = await Participant.update(
            { roleId },
            { where: { userId, projectId } }
        )
        return participant;
    }

    async addUserToProject(userId, projectId, roleId) {
        const participant = await Participant.findOne({ where: { userId, projectId } });
        if (participant) {
            throw ApiError.badRequest(`User is already in project`);
        }
        const result = await Participant.create({ userId, projectId, roleId });
        return result;
    }

    async removeUserFromProject(userId, projectId) {
        const participant = await Participant.findOne({ where: { userId, projectId } });
        if (!participant) {
            throw ApiError.badRequest(`User not found in project`);
        }
        const result = await Participant.destroy({ where: { userId, projectId } });
        return result;
    }
}

module.exports = new DBProjectService();