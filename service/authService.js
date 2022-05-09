const ApiError = require("../errors/ApiError");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbUserService = require("../db/service/dbUserService");

const generateToken = (id, username) => {
    return jwt.sign({
        id,
        username
    }, process.env.LOGIN_JWT_PRIVATE_KEY, { expiresIn: '24h' });
}

class AuthService {
    async registration(username, password, name, surname) {
        if (!username || !password) {
            throw ApiError.badRequest(`Username and password are required`);
        }
        // username validation
        if (/^[a-zA-Z1-9]+$/.test(username) === false) {
            throw ApiError.badRequest(`Username must contain only latin letters and numbers`);
        }
        if (username.length < 4 || username.length > 20) {
            throw ApiError.badRequest(`Login must contain from 4 to 20 characters`);
        }
        const candidate = await dbUserService.findUserByUsername(username);
        if (candidate) {
            throw ApiError.badRequest(`User with username ${username} is already exist`);
        }

        // password validation
        if (/(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g.test(password) === false) {
            throw ApiError.badRequest(`Password must contain uppercase character, lowercase character. Minimum length - 6 characters`);
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await dbUserService.createUser(username, hashPassword, name, surname);
        const token = generateToken(user.id, user.username);
        return { token };
    }

    async login(username, password) {
        if (!username || !password) {
            throw ApiError.badRequest(`Username and password are required`);
        }

        const user = await dbUserService.findUserByUsername(username);
        if (!user) {
            throw ApiError.badRequest(`User with username ${username} is not exist`);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw ApiError.badRequest(`Wrong password`);
        }

        const token = generateToken(user.id, user.username);
        return { token };
    }

    async check(id, username) {
        const token = generateToken(id, username);
        return { token };
    }
}

module.exports = new AuthService();