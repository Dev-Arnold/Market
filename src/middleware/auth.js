const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) {
    return next(new ErrorResponse('Access denied. No token provided', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  
  if (!req.user) {
    return next(new ErrorResponse('Invalid token', 401));
  }
  
  next();
});

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorResponse('Insufficient permissions', 403));
  }
  next();
};