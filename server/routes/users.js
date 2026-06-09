const express = require('express');
const router = express.Router();
const { getUsers, toggleBlockUser, getUserOrderHistory, deleteAllCustomers, getCashiers, createCashier, deleteCashier } = require('../controllers/userController');
const { protect, admin, cashier } = require('../middleware/auth');

router.get('/', protect, cashier, getUsers);
router.patch('/:id/block', protect, admin, toggleBlockUser);
router.get('/:id/orders', protect, cashier, getUserOrderHistory);
router.delete('/delete-all', protect, admin, deleteAllCustomers);

// Cashier management (admin only)
router.get('/cashiers', protect, admin, getCashiers);
router.post('/cashiers', protect, admin, createCashier);
router.delete('/cashiers/:id', protect, admin, deleteCashier);

module.exports = router;
