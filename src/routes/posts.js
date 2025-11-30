const express = require('express');
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  searchPosts
} = require('../controllers/postController');

const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const validate = require('../middleware/validate');
const { createPostSchema, updatePostSchema, commentSchema } = require('../utils/validationSchemas');

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, upload.single('media'), validate(createPostSchema), createPost);

router.get('/search', searchPosts);

router.route('/:id')
  .get(getPost)
  .put(protect, validate(updatePostSchema), updatePost)
  .delete(protect, deletePost);

router.put('/:id/like', protect, likePost);
router.post('/:id/comments', protect, validate(commentSchema), addComment);

module.exports = router;