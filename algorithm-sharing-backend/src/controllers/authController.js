const User = require('../models/User');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { generateToken } = require('../middleware/auth');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { username, email, password, displayName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new AppError('Email already registered', 400);
    }
    if (existingUser.username === username) {
      throw new AppError('Username already taken', 400);
    }
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    profile: {
      displayName: displayName || username,
    },
  });

  // Generate token
  const token = generateToken(user._id);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.profile.displayName,
        createdAt: user.createdAt,
      },
      token,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated. Please contact support.', 401);
  }

  // Generate token
  const token = generateToken(user._id);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.profile.displayName,
        lastLogin: user.lastLogin,
      },
      token,
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { displayName, bio, location, website } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update profile fields
  if (displayName !== undefined) user.profile.displayName = displayName;
  if (bio !== undefined) user.profile.bio = bio;
  if (location !== undefined) user.profile.location = location;
  if (website !== undefined) user.profile.website = website;

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user,
    },
  });
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

// @desc    Deactivate account
// @route   DELETE /api/auth/account
// @access  Private
const deactivateAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'Account deactivated successfully',
  });
});

// @desc    Get user statistics
// @route   GET /api/auth/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
  const Algorithm = require('../models/Algorithm');
  
  const userId = req.user._id.toString();

  const [user, algorithmStats] = await Promise.all([
    User.findById(req.user._id),
    Algorithm.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalAlgorithms: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalDownloads: { $sum: '$downloads' },
          publicAlgorithms: {
            $sum: { $cond: ['$isPublic', 1, 0] }
          },
          privateAlgorithms: {
            $sum: { $cond: ['$isPublic', 0, 1] }
          },
        }
      }
    ])
  ]);

  const stats = algorithmStats[0] || {
    totalAlgorithms: 0,
    totalLikes: 0,
    totalDownloads: 0,
    publicAlgorithms: 0,
    privateAlgorithms: 0,
  };

  // Update user stats
  await user.updateStats({
    algorithmsShared: stats.totalAlgorithms,
    totalLikes: stats.totalLikes,
    totalDownloads: stats.totalDownloads,
  });

  res.json({
    success: true,
    data: {
      stats: {
        ...stats,
        joinedAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    },
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deactivateAccount,
  getUserStats,
};
