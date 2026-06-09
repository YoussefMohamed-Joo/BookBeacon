const express = require('express');
const router = express.Router();
const { aiChat, getRecommendations, getSalesInsights, getAccountingInsights, detectFraud, analyze, adminQuery } = require('../controllers/aiController');
const { protect, admin } = require('../middleware/auth');

router.post('/chat', aiChat);
router.get('/recommendations', protect, getRecommendations);
router.get('/sales-insights', protect, admin, getSalesInsights);
router.get('/accounting-insights', protect, admin, getAccountingInsights);
router.get('/detect-fraud', protect, admin, detectFraud);
router.post('/analyze', protect, admin, analyze);
router.post('/admin-query', protect, admin, adminQuery);

module.exports = router;
