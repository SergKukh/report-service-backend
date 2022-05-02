const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        req.user = jwt.verify(token, process.env.LOGIN_JWT_PRIVATE_KEY);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized' });
    }
}