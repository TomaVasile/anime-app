const express = require('express');
const { signup, login, getUserProfile, uploadAvatar } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { uploadAvatarMiddleware } = require('../middleware/filesUpload');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/user/:id", authenticateToken, getUserProfile);
router.post('/user-avatar', authenticateToken, uploadAvatarMiddleware, uploadAvatar);

module.exports = router; 