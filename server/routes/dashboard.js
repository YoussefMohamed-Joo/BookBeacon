const express = require('express');
const router = express.Router();
const { getDashboardStats, resetDashboard } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getDashboardStats);
router.post('/reset', protect, admin, resetDashboard);

module.exports = router;
