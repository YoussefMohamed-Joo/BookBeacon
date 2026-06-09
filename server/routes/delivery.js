const express = require('express');
const router = express.Router();
const { getDeliveryPrices, setDeliveryPrice, deleteDeliveryPrice, getPickups, updatePickupStatus, getUserPickups } = require('../controllers/deliveryController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getDeliveryPrices);
router.post('/', protect, admin, setDeliveryPrice);
router.delete('/:id', protect, admin, deleteDeliveryPrice);

router.get('/pickups', protect, admin, getPickups);
router.get('/pickups/my', protect, getUserPickups);
router.put('/pickups/:id/status', protect, admin, updatePickupStatus);

module.exports = router;
