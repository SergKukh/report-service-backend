const { User, Role } = require('../models/models');

class DBUserService {
    async findUserByUsername(username) {
        const user = await User.findOne({ where: { username } });
        return user;
    }

    async findUserByUserId(userId) {
        const user = await User.findOne({ where: { id: userId } });
        return user;
    }

    async createUser(username, password, name, surname) {
        const user = await User.create({ username, password, name, surname });
        return user;
    }

    async getOwnerRole() {
        const role = await Role.findOne({ where: { name: process.env.ROLE_OWNER } });
        return role;
    }

    async getAdminRole() {
        const role = await Role.findOne({ where: { name: process.env.ROLE_ADMIN } });
        return role;
    }

    async getUserRole() {
        const role = await Role.findOne({ where: { name: process.env.ROLE_USER } });
        return role;
    }

    async getRoleById(id) {
        const role = await Role.findOne({ where: { id } });
        return role;
    }

    async getAllRoles() {
        const roles = await Role.findAll({
            attributes: ['id', 'name', 'title']
        });
        return roles;
    }
}

module.exports = new DBUserService();