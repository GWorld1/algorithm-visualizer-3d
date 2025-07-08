const Algorithm = require('../models/Algorithm');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

// @desc    Share a new algorithm to the community
// @route   POST /api/algorithms/share
// @access  Public (with user identification)
const shareAlgorithm = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    difficulty = 'beginner',
    dataStructureType = 'array',
    nodes,
    connections = [],
    tags = [],
    isPublic = true,
    metadata = {},
  } = req.body;

  // Get user info (from auth middleware or headers for development)
  const userId = req.user?.id || req.userId || 'anonymous';
  const username = req.user?.username || req.username || 'Anonymous User';

  // Validate algorithm structure
  const hasStart = nodes.some(node => node.type === 'start');
  const hasEnd = nodes.some(node => node.type === 'end');
  
  const validationErrors = [];
  if (!hasStart) validationErrors.push('Algorithm must have a Start node');
  if (!hasEnd) validationErrors.push('Algorithm must have an End node');

  // Ensure nodes have unique IDs
  const nodeIds = nodes.map(node => node.id);
  const uniqueNodeIds = [...new Set(nodeIds)];
  if (nodeIds.length !== uniqueNodeIds.length) {
    validationErrors.push('All nodes must have unique IDs');
  }

  // Validate connections reference existing nodes
  for (const connection of connections) {
    if (!nodeIds.includes(connection.source)) {
      validationErrors.push(`Connection source '${connection.source}' references non-existent node`);
    }
    if (!nodeIds.includes(connection.target)) {
      validationErrors.push(`Connection target '${connection.target}' references non-existent node`);
    }
  }

  // Prepare algorithm metadata
  const algorithmMetadata = {
    nodeCount: nodes.length,
    connectionCount: connections.length,
    estimatedTime: metadata.estimatedTime || 'Unknown',
    complexity: {
      time: metadata.complexity?.time || 'O(n)',
      space: metadata.complexity?.space || 'O(1)',
      level: difficulty,
    },
    version: metadata.version || '1.0.0',
  };

  // Create algorithm document
  const algorithm = new Algorithm({
    title,
    description,
    category,
    difficulty,
    dataStructureType,
    nodes,
    connections,
    tags: tags.filter(tag => tag.trim().length > 0), // Remove empty tags
    userId,
    username,
    isPublic,
    metadata: algorithmMetadata,
    isValid: validationErrors.length === 0,
    validationErrors,
  });

  const savedAlgorithm = await algorithm.save();

  res.status(201).json({
    success: true,
    message: 'Algorithm shared successfully',
    data: {
      algorithm: savedAlgorithm,
    },
  });
});

// @desc    Get community algorithms with filtering and pagination
// @route   GET /api/algorithms/community
// @access  Public
const getCommunityAlgorithms = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    difficulty,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search,
    tags,
  } = req.query;

  // Build filter object
  const filter = { isPublic: true };

  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    filter.tags = { $in: tagArray };
  }

  // Build search query
  if (search) {
    filter.$text = { $search: search };
  }

  // Build sort object
  const sortObj = {};
  sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query with pagination
  const [algorithms, total] = await Promise.all([
    Algorithm.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-validationErrors') // Don't expose validation errors in public listing
      .lean(),
    Algorithm.countDocuments(filter),
  ]);

  // Add like status for authenticated users
  const userId = req.user?.id || req.userId;
  if (userId) {
    algorithms.forEach(algorithm => {
      algorithm.isLikedByUser = algorithm.likedBy.includes(userId);
      delete algorithm.likedBy; // Don't expose the full likedBy array
    });
  } else {
    algorithms.forEach(algorithm => {
      algorithm.isLikedByUser = false;
      delete algorithm.likedBy;
    });
  }

  // Calculate pagination info
  const totalPages = Math.ceil(total / parseInt(limit));
  const hasNextPage = parseInt(page) < totalPages;
  const hasPrevPage = parseInt(page) > 1;

  res.json({
    success: true,
    data: {
      algorithms,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        category,
        difficulty,
        search,
        tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      },
    },
  });
});

// @desc    Get a specific algorithm by ID
// @route   GET /api/algorithms/:id
// @access  Public
const getAlgorithmById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const algorithm = await Algorithm.findById(id);
  
  if (!algorithm) {
    throw new AppError('Algorithm not found', 404);
  }

  if (!algorithm.isPublic) {
    const userId = req.user?.id || req.userId;
    if (algorithm.userId !== userId) {
      throw new AppError('Algorithm not found', 404); // Don't reveal existence of private algorithms
    }
  }

  // Add like status for authenticated users
  const userId = req.user?.id || req.userId;
  const isLikedByUser = userId ? algorithm.likedBy.includes(userId) : false;

  // Increment download count (async, don't wait)
  Algorithm.findByIdAndUpdate(id, { $inc: { downloads: 1 } }).exec();

  // Prepare response (remove sensitive data)
  const algorithmData = algorithm.toObject();
  algorithmData.isLikedByUser = isLikedByUser;
  delete algorithmData.likedBy;
  delete algorithmData.validationErrors;

  res.json({
    success: true,
    data: {
      algorithm: algorithmData,
    },
  });
});

// @desc    Like/unlike an algorithm
// @route   PUT /api/algorithms/:id/like
// @access  Public (with user identification)
const toggleLikeAlgorithm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || req.userId;

  if (!userId) {
    throw new AppError('User identification required to like algorithms', 401);
  }

  const algorithm = await Algorithm.findById(id);
  
  if (!algorithm) {
    throw new AppError('Algorithm not found', 404);
  }

  if (!algorithm.isPublic) {
    throw new AppError('Algorithm not found', 404);
  }

  const isLiked = algorithm.toggleLike(userId);
  await algorithm.save();

  res.json({
    success: true,
    message: isLiked ? 'Algorithm liked' : 'Algorithm unliked',
    data: {
      isLiked,
      totalLikes: algorithm.likes,
    },
  });
});

// @desc    Delete an algorithm
// @route   DELETE /api/algorithms/:id
// @access  Private (owner only)
const deleteAlgorithm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || req.userId;

  const algorithm = await Algorithm.findById(id);
  
  if (!algorithm) {
    throw new AppError('Algorithm not found', 404);
  }

  // Check ownership
  if (algorithm.userId !== userId) {
    throw new AppError('Access denied. You can only delete your own algorithms.', 403);
  }

  await Algorithm.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Algorithm deleted successfully',
  });
});

// @desc    Update an algorithm
// @route   PUT /api/algorithms/:id
// @access  Private (owner only)
const updateAlgorithm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || req.userId;
  const updates = req.body;

  const algorithm = await Algorithm.findById(id);
  
  if (!algorithm) {
    throw new AppError('Algorithm not found', 404);
  }

  // Check ownership
  if (algorithm.userId !== userId) {
    throw new AppError('Access denied. You can only update your own algorithms.', 403);
  }

  // Update allowed fields
  const allowedUpdates = ['title', 'description', 'category', 'difficulty', 'tags', 'isPublic'];
  const updateData = {};
  
  allowedUpdates.forEach(field => {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  });

  const updatedAlgorithm = await Algorithm.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Algorithm updated successfully',
    data: {
      algorithm: updatedAlgorithm,
    },
  });
});

// @desc    Get user's own algorithms
// @route   GET /api/algorithms/my
// @access  Private
const getMyAlgorithms = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.userId;
  const { page = 1, limit = 12 } = req.query;

  if (!userId) {
    throw new AppError('User identification required', 401);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [algorithms, total] = await Promise.all([
    Algorithm.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Algorithm.countDocuments({ userId }),
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      algorithms,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    },
  });
});

module.exports = {
  shareAlgorithm,
  getCommunityAlgorithms,
  getAlgorithmById,
  toggleLikeAlgorithm,
  deleteAlgorithm,
  updateAlgorithm,
  getMyAlgorithms,
};
