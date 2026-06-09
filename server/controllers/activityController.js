const ActivityLog = require('../models/ActivityLog');

// Log an activity (can be called from any controller)
const logActivity = async ({ action, admin, user, order, book, details = {} }) => {
  try {
    await ActivityLog.create({ action, admin, user, order, book, details });
  } catch (error) {
    console.error('Activity log error:', error.message);
  }
};

// Get activity logs (admin only)
const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action: actionFilter, startDate, endDate } = req.query;
    const query = {};

    if (actionFilter) query.action = actionFilter;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(query)
      .populate('admin', 'name email')
      .populate('user', 'name email')
      .populate('order', 'orderId')
      .populate('book', 'titleAr slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({ logs, page: parseInt(page), pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب سجل النشاطات', error: error.message });
  }
};

module.exports = { logActivity, getActivityLogs };
