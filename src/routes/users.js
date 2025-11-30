const express = require('express');
const {
  updateProfile,
  getSellerProfile,
  searchUsers
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('../utils/validationSchemas');

const router = express.Router();

router.get('/search', searchUsers);
router.put('/profile', protect, upload.single('avatar'), validate(updateProfileSchema), updateProfile);
router.get('/:id/profile', getSellerProfile);

module.exports = router;