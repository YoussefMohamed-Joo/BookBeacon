const Review = require('../models/Review');
const Book = require('../models/Book');

const createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    const existingReview = await Review.findOne({ user: req.user._id, book: bookId });
    if (existingReview) {
      return res.status(400).json({ message: 'لقد قيمت هذا الكتاب من قبل' });
    }

    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      comment,
    });

    const reviews = await Review.find({ book: bookId, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Book.findByIdAndUpdate(bookId, {
      rating: avgRating || rating,
      numReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء التقييم', error: error.message });
  }
};

const getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب التقييمات' });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('book', 'titleAr')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب التقييمات' });
  }
};

const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'التقييم غير موجود' });

    review.isApproved = !review.isApproved;
    await review.save();

    const reviews = await Review.find({ book: review.book, isApproved: true });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await Book.findByIdAndUpdate(review.book, {
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحديث التقييم' });
  }
};

module.exports = { createReview, getBookReviews, getAllReviews, approveReview };
