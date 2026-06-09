const express = require('express');
const router = express.Router();
const { createReview, getBookReviews, getAllReviews, approveReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/book/:bookId', getBookReviews);
router.get('/', protect, admin, getAllReviews);
router.patch('/:id/approve', protect, admin, approveReview);

module.exports = router;
