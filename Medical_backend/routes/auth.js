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

// Base route - API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      register: 'POST /register',
      login: 'POST /login',
      me: 'GET /me (Protected)',
      logout: 'POST /logout (Protected)',
      forgotPassword: 'POST /forgot-password',
      resetPassword: 'PUT /reset-password/:token',
      updatePassword: 'PUT /update-password (Protected)',
      test: 'GET /test'
    }
  });
});

// Test route for debugging
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth API working',
    timestamp: new Date().toISOString(),
    server: 'Healthcare System Backend',
    version: '1.0.0'
  });
});

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
