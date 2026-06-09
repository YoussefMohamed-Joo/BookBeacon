const User = require('../models/User');
const Order = require('../models/Order');

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'user' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المستخدمين' });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
    if (user.role === 'admin') return res.status(400).json({ message: 'لا يمكن حظر المشرف' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: user.isBlocked ? 'تم حظر المستخدم' : 'تم إلغاء حظر المستخدم', user });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحديث المستخدم' });
  }
};

const getUserOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .populate('book', 'title titleAr price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الطلبات' });
  }
};

const deleteAllCustomers = async (req, res) => {
  try {
    const result = await User.deleteMany({ role: 'user' });
    await Order.deleteMany({});
    res.json({ message: `تم حذف ${result.deletedCount} عميل وجميع طلباتهم` });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في حذف العملاء' });
  }
};

module.exports = { getUsers, toggleBlockUser, getUserOrderHistory, deleteAllCustomers };
