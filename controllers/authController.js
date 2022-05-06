const authService = require("../service/authService");

class AuthController {
    async registration(req, res, next) {
        const { username, password, name, surname } = req.body;
        const result = await authService.registration(username, password, name, surname);
        res.json(result);
    }

    async login(req, res, next) {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        res.json(result);
    }

    async check(req, res, next) {
        const { id, username } = req.user;
        const result = await authService.check(id, username);
        res.json(result);
    }
}

module.exports = new AuthController();