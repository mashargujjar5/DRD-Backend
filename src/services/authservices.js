const bcrypt = require('bcryptjs');
const User = require('../models/User');
const GenerateToken = require('../utils/generateToken')

const register = async (userData) => {
    try {
        const { firstname, lastname, email, phone, gender, password } = userData;
        if (!firstname || !lastname || !email || !phone || !gender || !password) {
            throw new Error("All fields are required");
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstname,
            lastname,
            email,
            phone,
            gender,
            password: hashedPassword
        });

        return user;


    } catch (error) {
        throw error;
    }
};
//login
const login = async (userData) => {
    try {
        const { email, password } = userData;
        if (!email || !password) {
            throw new Error("All fields are required")
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new Error("user cannot found")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("invalid credentials")
        }
        const token = GenerateToken(user._id);
        return { user, token };


    } catch (error) {
        throw error;
    }
}

module.exports = {
    register,
    login
};