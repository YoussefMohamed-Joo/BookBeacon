const express = require('express');
const router = express.Router();
const { getBlogs, getBlogBySlug, getAllBlogsAdmin, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/admin', protect, admin, getAllBlogsAdmin);
router.post('/', protect, admin, upload.single('image'), createBlog);
router.put('/:id', protect, admin, upload.single('image'), updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

module.exports = router;
