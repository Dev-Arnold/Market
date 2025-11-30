const User = require('../models/User');
const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    bio: req.body.bio,
    phoneNumber: req.body.phoneNumber,
    city: req.body.city
  };

  if (req.file) {
    fieldsToUpdate.avatar = req.file.path;
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get seller profile
// @route   GET /api/users/:id/profile
// @access  Public
exports.getSellerProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const posts = await Post.find({ user: req.params.id })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 });

  const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        bio: user.bio,
        avatar: user.avatar,
        city: user.city
      },
      posts,
      stats: {
        postsCount: posts.length,
        totalLikes
      }
    }
  });
});

// @desc    Search users
// @route   GET /api/users/search?q=query
// @access  Public
exports.searchUsers = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ErrorResponse('Search query is required', 400));
  }

  const users = await User.find({
    $or: [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { userName: { $regex: q, $options: 'i' } },
      { bio: { $regex: q, $options: 'i' } }
    ]
  }).select('firstName lastName userName bio avatar city').limit(20);

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});