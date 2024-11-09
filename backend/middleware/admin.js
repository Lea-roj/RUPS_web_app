// middleware/admin.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const adminAuth = async (req, res, next) => {
    try {
        const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isAdmin) {
            throw new Error('Not authorized as admin');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized as admin' });
    }
};

module.exports = adminAuth;
