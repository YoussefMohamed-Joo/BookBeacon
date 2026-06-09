const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = req.user.role === 'admin'
      ? { isAdminNotification: true }
      : { user: req.user._id, isAdminNotification: false };

    const [notifications, total] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(query),
    ]);

    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

    res.json({ notifications, total, unreadCount, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الإشعارات', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'الإشعار غير موجود' });
    notification.isRead = true;
    await notification.save();
    res.json({ message: 'تم التحديث' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ', error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? { isAdminNotification: true, isRead: false }
      : { user: req.user._id, isAdminNotification: false, isRead: false };
    await Notification.updateMany(query, { isRead: true });
    res.json({ message: 'تم تحديث الكل' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ', error: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? { isAdminNotification: true, isRead: false }
      : { user: req.user._id, isAdminNotification: false, isRead: false };
    const count = await Notification.countDocuments(query);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'خطأ', error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم الحذف' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ', error: error.message });
  }
};

const clearAll = async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? { isAdminNotification: true }
      : { user: req.user._id, isAdminNotification: false };
    await Notification.deleteMany(query);
    res.json({ message: 'تم مسح الكل' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ', error: error.message });
  }
};

async function createNotification({ user, type, title, message, link = '', isAdminNotification = false }) {
  try {
    await Notification.create({ user, type, title, message, link, isAdminNotification });
  } catch (err) {
    console.error('Notification creation error:', err.message);
  }
}

module.exports = { getMyNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteNotification, clearAll, createNotification };
