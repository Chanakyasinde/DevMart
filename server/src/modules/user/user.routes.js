const express = require('express');
const router = express.Router();

const { register, login, logout, getMe, updateMe } = require('./user.controller');
const { protect } = require('../../middleware/auth');

router.post('/register', register);
router.post('/login', login);

router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
