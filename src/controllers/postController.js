const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a media file', 400));
  }

  const { caption, price } = req.body;

  const post = await Post.create({
    user: req.user.id,
    mediaUrl: req.file.path,
    caption,
    price
  });

  await post.populate('user', 'userName avatar');

  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const total = await Post.countDocuments();

  const posts = await Post.find()
    .populate('user', 'userName avatar city')
    .populate('comments.user', 'userName avatar')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const pagination = {};

  if (startIndex + limit < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: posts.length,
    pagination,
    data: posts
  });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'userName avatar city')
    .populate('comments.user', 'userName avatar');

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this post', 401));
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('user', 'userName avatar');

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this post', 401));
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  const likeIndex = post.likes.indexOf(req.user.id);

  if (likeIndex > -1) {
    post.likes.splice(likeIndex, 1);
  } else {
    post.likes.push(req.user.id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    data: {
      likes: post.likes.length,
      isLiked: post.likes.includes(req.user.id)
    }
  });
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  const newComment = {
    user: req.user.id,
    text: req.body.text
  };

  post.comments.push(newComment);
  await post.save();

  await post.populate('comments.user', 'userName avatar');

  res.status(201).json({
    success: true,
    data: post.comments[post.comments.length - 1]
  });
});

// @desc    Search posts
// @route   GET /api/posts/search?q=query
// @access  Public
exports.searchPosts = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ErrorResponse('Search query is required', 400));
  }

  const posts = await Post.find({
    caption: { $regex: q, $options: 'i' }
  })
    .populate('user', 'userName avatar')
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});