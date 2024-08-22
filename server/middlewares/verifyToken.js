// verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
        return res.status(401).json({
            message: 'Not Authenticated'
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'Not Authenticated'
        });
    }

    try {
        const currentUser = jwt.verify(token, process.env.SECRET_KEY);
        req.currentUser = currentUser;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
