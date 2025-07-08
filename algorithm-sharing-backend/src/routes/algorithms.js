const express = require('express');
const {
  shareAlgorithm,
  getCommunityAlgorithms,
  getAlgorithmById,
  toggleLikeAlgorithm,
  deleteAlgorithm,
  updateAlgorithm,
  getMyAlgorithms,
} = require('../controllers/algorithmController');

const {
  validateAlgorithmShare,
  validateAlgorithmUpdate,
  validateCommunityQuery,
  validateObjectId,
} = require('../middleware/validation');

const {
  authenticateToken,
  optionalAuth,
  extractUserId,
} = require('../middleware/auth');

const router = express.Router();

// Public routes with optional authentication
router.get('/community', validateCommunityQuery, optionalAuth, extractUserId, getCommunityAlgorithms);
router.get('/:id', validateObjectId(), optionalAuth, extractUserId, getAlgorithmById);

// Routes that require user identification (for development, using extractUserId)
router.post('/share', validateAlgorithmShare, extractUserId, shareAlgorithm);
router.put('/:id/like', validateObjectId(), extractUserId, toggleLikeAlgorithm);

// Routes that require full authentication (when auth system is implemented)
// For now, using extractUserId for development
router.get('/', extractUserId, getMyAlgorithms); // Get user's own algorithms
router.put('/:id', validateObjectId(), validateAlgorithmUpdate, extractUserId, updateAlgorithm);
router.delete('/:id', validateObjectId(), extractUserId, deleteAlgorithm);

module.exports = router;
