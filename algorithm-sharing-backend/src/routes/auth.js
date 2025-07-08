const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deactivateAccount,
  getUserStats,
} = require('../controllers/authController');

const {
  validateUserRegistration,
  validateUserLogin,
} = require('../middleware/validation');

const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.delete('/account', deactivateAccount);
router.get('/stats', getUserStats);

module.exports = router;
