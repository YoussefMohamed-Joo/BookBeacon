const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 50, type, startDate, endDate } = req.query;
    const query = {};

    if (type) query.type = type;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('order', 'orderId')
      .populate('recordedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    // Calculate totals
    const totals = await Transaction.aggregate([
      { $match: type ? { type } : {} },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    res.json({ transactions, page: parseInt(page), pages: Math.ceil(total / limit), total, totals });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المعاملات', error: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, bookId } = req.body;

    const transaction = await Transaction.create({
      type, amount, category, description,
      book: bookId,
      recordedBy: req.user._id,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء المعاملة', error: error.message });
  }
};

module.exports = { getTransactions, createTransaction };
