const express = require('express');
const router = express.Router();
const { getDeliveryPrices, setDeliveryPrice, deleteDeliveryPrice } = require('../controllers/deliveryController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getDeliveryPrices);
router.post('/', protect, admin, setDeliveryPrice);
router.delete('/:id', protect, admin, deleteDeliveryPrice);

module.exports = router;
