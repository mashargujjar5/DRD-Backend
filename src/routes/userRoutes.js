const express = require('express');
const { registeruser, loginuser } = require('../controllers/userController');
const router = express.Router();

// Route: /api/users/register
router.post('/register', registeruser);

// Route: /api/users/login
router.post('/login', loginuser);

module.exports = router;