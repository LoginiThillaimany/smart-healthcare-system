const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/update-password', protect, updatePassword);

module.exports = router;
