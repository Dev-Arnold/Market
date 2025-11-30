const Joi = require('joi');

// Auth schemas
const registerSchema = Joi.object({
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
  userName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// User schemas
const updateProfileSchema = Joi.object({
  firstName: Joi.string().max(50),
  lastName: Joi.string().max(50),
  userName: Joi.string().min(3).max(30),
  bio: Joi.string().max(500),
  phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]+$/),
  city: Joi.string().max(100)
});

// Post schemas
const createPostSchema = Joi.object({
  caption: Joi.string().max(1000).required(),
  price: Joi.number().min(0).required()
});

const updatePostSchema = Joi.object({
  caption: Joi.string().max(1000),
  price: Joi.number().min(0)
});

const commentSchema = Joi.object({
  text: Joi.string().max(500).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createPostSchema,
  updatePostSchema,
  commentSchema
};