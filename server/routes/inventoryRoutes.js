const express = require('express');
const router = express.Router();
const { getInventoryLogs, addStock, adjustStock } = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/logs', protect, admin, getInventoryLogs);
router.put('/:id/stock', protect, admin, addStock);
router.put('/:id/adjust', protect, admin, adjustStock);

module.exports = router;
