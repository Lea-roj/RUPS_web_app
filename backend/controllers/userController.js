const User = require('../models/User');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({
            username: user.username
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getUserProfile
};