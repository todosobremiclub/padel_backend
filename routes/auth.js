const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Endpoint para login
router.post('/login', login);

module.exports = router;
