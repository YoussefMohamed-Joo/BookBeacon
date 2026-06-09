const InventoryLog = require('../models/InventoryLog');
const Book = require('../models/Book');
const { logActivity } = require('./activityController');

const getInventoryLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, bookId } = req.query;
    const query = {};
    if (bookId) query.book = bookId;

    const logs = await InventoryLog.find(query)
      .populate('book', 'titleAr slug')
      .populate('admin', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await InventoryLog.countDocuments(query);
    res.json({ logs, page: parseInt(page), pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب سجل المخزون' });
  }
};

const addStock = async (req, res) => {
  try {
    const { quantity, reason } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'الكتاب غير موجود' });

    const prevStock = book.stock;
    book.stock += quantity;
    await book.save();

    await InventoryLog.create({
      book: book._id,
      action: 'stock_added',
      quantity,
      previousStock: prevStock,
      newStock: book.stock,
      admin: req.user._id,
      reason: reason || '',
    });

    logActivity({ action: 'stock_added', admin: req.user._id, book: book._id, details: { quantity, reason, stock: book.stock } });

    res.json({ message: 'تم إضافة المخزون', book });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إضافة المخزون' });
  }
};

const adjustStock = async (req, res) => {
  try {
    const { stock, reservedQuantity, reason } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'الكتاب غير موجود' });

    const prevStock = book.stock;
    const prevReserved = book.reservedQuantity;

    if (stock !== undefined) book.stock = Math.max(0, stock);
    if (reservedQuantity !== undefined) book.reservedQuantity = Math.max(0, reservedQuantity);

    await book.save();

    await InventoryLog.create({
      book: book._id,
      action: 'manual_adjustment',
      quantity: book.stock - prevStock,
      previousStock: prevStock,
      newStock: book.stock,
      previousReserved: prevReserved,
      newReserved: book.reservedQuantity,
      admin: req.user._id,
      reason: reason || 'تعديل يدوي',
    });

    logActivity({ action: 'stock_adjusted', admin: req.user._id, book: book._id, details: { stock, prevStock, reservedQuantity, prevReserved, reason } });

    res.json({ message: 'تم التعديل', book });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تعديل المخزون' });
  }
};

module.exports = { getInventoryLogs, addStock, adjustStock };
