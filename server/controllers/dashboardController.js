const Order = require('../models/Order');
const User = require('../models/User');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const approvedOrders = await Order.countDocuments({ status: 'approved' });
    const rejectedOrders = await Order.countDocuments({ status: 'rejected' });
    const deliveredOrders = await Order.countDocuments({ deliveryStatus: 'delivered' });
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalBooks = await Book.countDocuments({ isActive: true });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const fraudulentOrders = await Order.countDocuments({ isFraudFlagged: true });

    const revenue = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenue[0]?.total || 0;

    const expenses = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalExpenses = expenses[0]?.total || 0;

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

    const recentOrders = await Order.find()
      .populate('user', 'name email phone')
      .populate('book', 'titleAr price')
      .sort({ createdAt: -1 })
      .limit(10);

    const ordersByGrade = await Order.aggregate([
      { $group: { _id: '$grade', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const monthlyRevenue = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    const totalProfit = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$profit' } } },
    ]);

    // Low stock alerts
    const lowStockBooks = await Book.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    }).select('titleAr stock lowStockThreshold').limit(10);

    // Inventory summary
    const inventorySummary = await Book.aggregate([
      { $group: { _id: null, totalStock: { $sum: '$stock' }, totalReserved: { $sum: '$reservedQuantity' }, totalSold: { $sum: '$soldQuantity' } } },
    ]);

    // Order status breakdown
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // By order source
    const orderSourceBreakdown = await Order.aggregate([
      { $group: { _id: '$orderSource', count: { $sum: 1 } } },
    ]);

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const todayRevenue = await Transaction.aggregate([
      { $match: { type: 'income', createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      totalOrders, pendingOrders, approvedOrders, rejectedOrders, deliveredOrders,
      totalCustomers, totalBooks, blockedUsers, fraudulentOrders,
      totalRevenue, totalExpenses, netProfit, profitMargin,
      totalProfit: totalProfit[0]?.total || 0,
      recentOrders, ordersByGrade, monthlyRevenue,
      lowStockBooks, inventorySummary: inventorySummary[0] || { totalStock: 0, totalReserved: 0, totalSold: 0 },
      statusBreakdown, orderSourceBreakdown,
      todayOrders, todayRevenue: todayRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب إحصائيات لوحة التحكم' });
  }
};

const resetDashboard = async (req, res) => {
  try {
    await Transaction.deleteMany({});
    await Order.updateMany({}, { accounted: false, profit: 0, costPrice: 0 });
    res.json({ message: 'تم مسح جميع البيانات بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في مسح البيانات' });
  }
};

module.exports = { getDashboardStats, resetDashboard };
