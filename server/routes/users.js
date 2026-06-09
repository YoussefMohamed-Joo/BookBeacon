const express = require('express');
const router = express.Router();
const { getUsers, toggleBlockUser, getUserOrderHistory, deleteAllCustomers } = require('../controllers/userController');
const { protect, admin, cashier } = require('../middleware/auth');

router.get('/', protect, cashier, getUsers);
router.patch('/:id/block', protect, admin, toggleBlockUser);
router.get('/:id/orders', protect, cashier, getUserOrderHistory);
router.delete('/delete-all', protect, admin, deleteAllCustomers);

module.exports = router;
