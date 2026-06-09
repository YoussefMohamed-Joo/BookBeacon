const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

const getAccountingOverview = async (req, res) => {
  try {
    const totalRevenue = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalExpenses = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const revenue = totalRevenue[0]?.total || 0;
    const expenses = totalExpenses[0]?.total || 0;
    const netProfit = revenue - expenses;

    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(20);

    const profitByCategory = await Transaction.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    const dailyProfit = await Transaction.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]);

    res.json({
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit,
      recentTransactions,
      profitByCategory,
      dailyProfit,
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب بيانات المحاسبة' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description } = req.body;
    const transaction = await Transaction.create({ type, amount, category, description });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء الحركة المالية' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { type, category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({ transactions, page: parseInt(page), pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الحركات المالية' });
  }
};

const getProfitPerOrder = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'approved' })
      .populate('book', 'title titleAr price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const profitData = orders.map((order) => ({
      orderId: order._id,
      book: order.book?.titleAr || 'N/A',
      user: order.user?.name || 'N/A',
      totalPrice: order.totalPrice,
      profit: order.profit || 0,
      profitMargin: order.totalPrice > 0 ? ((order.profit / order.totalPrice) * 100).toFixed(1) : 0,
      date: order.createdAt,
    }));

    res.json(profitData);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب أرباح الطلبات' });
  }
};

module.exports = { getAccountingOverview, createTransaction, getTransactions, getProfitPerOrder };
