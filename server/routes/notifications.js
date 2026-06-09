const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteNotification, clearAll } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.patch('/:id/read', protect, markAsRead);
router.patch('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);
router.delete('/', protect, clearAll);

module.exports = router;
