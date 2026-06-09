const express = require('express');
const router = express.Router();
const { getAccountingOverview, createTransaction, getTransactions, getProfitPerOrder } = require('../controllers/accountingController');
const { protect, admin } = require('../middleware/auth');

router.get('/overview', protect, admin, getAccountingOverview);
router.get('/transactions', protect, admin, getTransactions);
router.post('/transactions', protect, admin, createTransaction);
router.get('/profit-per-order', protect, admin, getProfitPerOrder);

module.exports = router;
