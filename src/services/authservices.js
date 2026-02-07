const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (userData) => {
    try {
        const { name, email, password } = userData;
        if (!name || !email || !password) {
            throw new Error("All fields are required");
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return user;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    register
};