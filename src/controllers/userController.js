const authservices = require('../services/authservices');

const registeruser = async (req, res) => {
    try {
        const user = await authservices.register(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        if (error.message === 'User already exists') {
            res.status(400).json({ success: false, message: error.message });
        } else if (error.message === 'All fields are required') {
            res.status(400).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
//login
const loginuser = async (req, res) => {
    try {
        const { user, token } = await authservices.login(req.body);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    }
    catch (error) {
        if (error.message === 'user cannot found') {
            res.status(404).json({ success: false, message: error.message });
        } else if (error.message === 'invalid credentials') {
            res.status(401).json({ success: false, message: error.message });
        } else if (error.message === 'All fields are required') {
            res.status(400).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
module.exports = {
    registeruser,
    loginuser
};