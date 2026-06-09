const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction } = require('../controllers/transactionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getTransactions);
router.post('/', protect, admin, createTransaction);

module.exports = router;
