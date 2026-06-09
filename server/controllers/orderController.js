const Order = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { createNotification } = require('./notificationController');

const createOrder = async (req, res) => {
  try {
    const { bookId, grade, subject, quantity, deliveryMethod, deliveryDetails, senderPhone } = req.body;

    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'الكتاب غير موجود' });
    }

    if (book.stock < quantity) {
      return res.status(400).json({ message: 'الكتاب غير متوفر بالكمية المطلوبة' });
    }

    const booksTotal = book.price * quantity;
    const deliveryCost = deliveryMethod === 'delivery' ? (deliveryDetails?.deliveryPrice || 0) : 0;
    const totalPrice = booksTotal + deliveryCost;
    const totalCost = (book.costPrice || 0) * quantity;
    const profit = totalPrice - totalCost;

    const order = await Order.create({
      user: req.user._id,
      book: bookId,
      grade,
      subject,
      quantity,
      booksTotal,
      deliveryPrice: deliveryCost,
      totalPrice,
      deliveryMethod,
      deliveryDetails: deliveryMethod === 'delivery' ? deliveryDetails : {},
      paymentProof: {
        senderPhone: senderPhone || '',
      },
      costPrice: totalCost,
      profit,
    });

    book.stock -= quantity;
    book.salesCount += quantity;
    await book.save();

    createNotification({ user: req.user._id, type: 'order_created', title: 'تم إنشاء الطلب', message: `تم إنشاء طلب ${book.titleAr} بنجاح`, link: '/orders' });
    createNotification({ type: 'order_created', title: 'طلب جديد', message: `طلب جديد من ${req.user.name} - ${book.titleAr}`, link: '/admin', isAdminNotification: true });

    if (book.stock <= 5) {
      createNotification({ type: 'low_stock', title: 'مخزون منخفض', message: `مخزون ${book.titleAr} أصبح ${book.stock} فقط`, link: '/admin', isAdminNotification: true });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء الطلب', error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('book', 'title titleAr image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الطلبات' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, deliveryStatus, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (deliveryStatus) query.deliveryStatus = deliveryStatus;
    if (search) {
      query.$or = [
        { grade: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('book', 'title titleAr price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الطلبات' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveryStatus } = req.body;
    const order = await Order.findById(req.params.id).populate('book').populate('user');

    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

    const prevStatus = order.status;

    if (status) order.status = status;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;

    if (status === 'approved' && !order.accounted) {
      const pointsEarned = Math.floor(order.totalPrice * 0.1);
      await User.findByIdAndUpdate(order.user._id, {
        $inc: { loyaltyPoints: pointsEarned, totalOrders: 1 },
      });

      await Transaction.create({
        type: 'income',
        amount: order.totalPrice,
        category: 'مبيعات كتب',
        description: `طلب كتاب ${order.book?.titleAr || ''}`,
        order: order._id,
      });

      if (order.costPrice > 0) {
        await Transaction.create({
          type: 'expense',
          amount: order.costPrice,
          category: 'تكلفة كتب',
          description: `تكلفة طلب كتاب ${order.book?.titleAr || ''}`,
          order: order._id,
        });
      }

      order.accounted = true;
    }

    if (status === 'delivered' || deliveryStatus === 'delivered') {
      order.deliveryStatus = 'delivered';
      order.status = 'approved';
      if (!order.accounted) {
        await Transaction.create({
          type: 'income',
          amount: order.totalPrice,
          category: 'مبيعات كتب',
          description: `طلب كتاب ${order.book?.titleAr || ''}`,
          order: order._id,
        });
        if (order.costPrice > 0) {
          await Transaction.create({
            type: 'expense',
            amount: order.costPrice,
            category: 'تكلفة كتب',
            description: `تكلفة طلب كتاب ${order.book?.titleAr || ''}`,
            order: order._id,
          });
        }
        order.accounted = true;
      }
    }

    if ((status === 'rejected' || prevStatus === 'pending' && status === 'rejected') && order.book) {
      order.book.stock += order.quantity;
      await order.book.save();
    }

    await order.save();

    if (status === 'approved') {
      createNotification({ user: order.user._id, type: 'order_approved', title: 'تم الموافقة على الطلب', message: `تمت الموافقة على طلب ${order.book?.titleAr || ''}`, link: '/orders' });
    }
    if (status === 'rejected') {
      createNotification({ user: order.user._id, type: 'order_rejected', title: 'تم رفض الطلب', message: `تم رفض طلب ${order.book?.titleAr || ''}`, link: '/orders' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحديث الطلب', error: error.message });
  }
};

const uploadPaymentProof = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

    if (req.file) {
      order.paymentProof.imageUrl = `/uploads/${req.file.filename}`;
    }
    if (req.body.senderPhone) {
      order.paymentProof.senderPhone = req.body.senderPhone;
    }

    await order.save();

    createNotification({ type: 'payment_uploaded', title: 'تم رفع إثبات دفع', message: `قام ${order.user?.name || 'مستخدم'} برفع إثبات دفع للطلب`, link: '/admin', isAdminNotification: true });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في رفع إثبات الدفع', error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('book');
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

    order.paymentProof.verified = true;
    order.status = 'approved';

    if (!order.accounted) {
      const pointsEarned = Math.floor(order.totalPrice * 0.1);
      await User.findByIdAndUpdate(order.user._id, {
        $inc: { loyaltyPoints: pointsEarned, totalOrders: 1 },
      });

      await Transaction.create({
        type: 'income',
        amount: order.totalPrice,
        category: 'مبيعات كتب',
        description: `طلب معتمد: ${order.book?.titleAr || ''}`,
        order: order._id,
      });

      if (order.costPrice > 0) {
        await Transaction.create({
          type: 'expense',
          amount: order.costPrice,
          category: 'تكلفة كتب',
          description: `تكلفة: ${order.book?.titleAr || ''}`,
          order: order._id,
        });
      }

      order.accounted = true;
    }

    await order.save();
    res.json({ message: 'تم التحقق من الدفع بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التحقق من الدفع' });
  }
};

const instantDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('book').populate('user');
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

    order.status = 'approved';
    order.deliveryStatus = 'delivered';
    order.deliveredAt = new Date();

    if (!order.accounted) {
      const pointsEarned = Math.floor(order.totalPrice * 0.1);
      await User.findByIdAndUpdate(order.user._id, {
        $inc: { loyaltyPoints: pointsEarned, totalOrders: 1 },
      });

      await Transaction.create({
        type: 'income',
        amount: order.totalPrice,
        category: 'مبيعات كتب',
        description: `توصيل فوري: ${order.book?.titleAr || ''}`,
        order: order._id,
      });

      if (order.costPrice > 0) {
        await Transaction.create({
          type: 'expense',
          amount: order.costPrice,
          category: 'تكلفة كتب',
          description: `تكلفة توصيل فوري: ${order.book?.titleAr || ''}`,
          order: order._id,
        });
      }

      order.accounted = true;
    }

    await order.save();
    res.json({ message: 'تم التوصيل الفوري وإضافة الأرباح', order });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التوصيل الفوري', error: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus, uploadPaymentProof, verifyPayment, instantDelivery };
