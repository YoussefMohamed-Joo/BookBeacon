const express = require('express');
const router = express.Router();
const { createOrder, createInstantSale, getUserOrders, getAllOrders, updateOrderStatus, uploadPaymentProof, verifyPayment, confirmDelivery, instantDelivery, refundOrder, adminAction, getGovernorates } = require('../controllers/orderController');
const { protect, admin, cashier } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, createOrder);
router.post('/instant-sale', protect, cashier, createInstantSale);
router.get('/my-orders', protect, getUserOrders);
router.get('/', protect, cashier, getAllOrders);
router.patch('/:id/status', protect, cashier, updateOrderStatus);
router.post('/:id/payment', protect, upload.single('paymentProof'), uploadPaymentProof);
router.post('/:id/verify-payment', protect, admin, verifyPayment);
router.post('/:id/confirm-delivery', protect, cashier, confirmDelivery);
router.post('/:id/instant-delivery', protect, admin, instantDelivery);
router.post('/refund', protect, admin, refundOrder);
router.post('/:id/admin-action', protect, admin, adminAction);
router.get('/governorates/prices', protect, getGovernorates);

module.exports = router;
