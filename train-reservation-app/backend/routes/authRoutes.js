const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST register new passenger
router.post('/register', authController.register);

// POST login
router.post('/login', authController.login);

// GET current user
router.get('/user/:id', authController.getCurrentUser);

module.exports = router;
