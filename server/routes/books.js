const express = require('express');
const router = express.Router();
const { getBooks, getBookBySlug, getBookById, createBook, updateBook, deleteBook, getBooksByGrade, lookupByBarcode, generateBarcodes } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getBooks);
router.get('/grade/:grade', getBooksByGrade);
router.get('/slug/:slug', getBookBySlug);
router.get('/barcode/:barcode', lookupByBarcode); // must be before /:id
router.post('/generate-barcodes', protect, admin, generateBarcodes);
router.get('/:id', getBookById);
router.post('/', protect, admin, upload.single('image'), createBook);
router.put('/:id', protect, admin, upload.single('image'), updateBook);
router.delete('/:id', protect, admin, deleteBook);

module.exports = router;
