const express = require('express');
const { registeruser } = require('../controllers/userController');
const router = express.Router();

// Route: /api/users/register
router.post('/register', registeruser);

module.exports = router;
