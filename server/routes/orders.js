const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus, uploadPaymentProof, verifyPayment, instantDelivery } = require('../controllers/orderController');
const { protect, admin, cashier } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/', protect, cashier, getAllOrders);
router.patch('/:id/status', protect, cashier, updateOrderStatus);
router.post('/:id/payment', protect, upload.single('paymentProof'), uploadPaymentProof);
router.post('/:id/verify-payment', protect, admin, verifyPayment);
router.post('/:id/instant-delivery', protect, admin, instantDelivery);

module.exports = router;
