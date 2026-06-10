const Order = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const DeliveryPrice = require('../models/DeliveryPrice');
const { createNotification } = require('./notificationController');
const { logActivity } = require('./activityController');

// Helper: sync inventory when order status changes
async function syncInventory(order, prevStatus) {
  const book = await Book.findById(order.book);
  if (!book) return;

  // Order created -> reserve stock
  if (order.status === 'pending' && prevStatus === 'pending') {
    book.reservedQuantity = (book.reservedQuantity || 0) + order.quantity;
  }

  // Approved -> deduct stock, release reserve
  if (order.status === 'approved' && prevStatus === 'pending' || order.status === 'approved' && prevStatus === 'payment_review') {
    book.reservedQuantity = Math.max(0, (book.reservedQuantity || 0) - order.quantity);
    book.stock = Math.max(0, book.stock - order.quantity);
  }

  // Delivered -> increment sold count
  if (order.status === 'delivered') {
    book.soldQuantity = (book.soldQuantity || 0) + order.quantity;
    book.salesCount = (book.salesCount || 0) + order.quantity;
  }

  // Rejected -> release reserved stock
  if (order.status === 'rejected' && prevStatus !== 'rejected') {
    book.reservedQuantity = Math.max(0, (book.reservedQuantity || 0) - order.quantity);
  }

  await book.save();
}

// Helper: create accounting transactions
async function accountOrder(order) {
  if (order.accounted) return;
  const book = await Book.findById(order.book);
  const title = book?.titleAr || '';

  await Transaction.create({
    type: 'income',
    amount: order.paidAmount || order.totalPrice,
    category: 'مبيعات كتب',
    description: `طلب ${order.orderId || ''}: ${title}`,
    order: order._id,
  });

  if (order.costPrice > 0) {
    await Transaction.create({
      type: 'expense',
      amount: order.costPrice,
      category: 'تكلفة كتب',
      description: `تكلفة ${order.orderId || ''}: ${title}`,
      order: order._id,
    });
  }

  // Award loyalty points
  const points = Math.floor((order.paidAmount || order.totalPrice) * 0.1);
  await User.findByIdAndUpdate(order.user, { $inc: { loyaltyPoints: points, totalOrders: 1 } });

  order.accounted = true;
}

// ===================== CONTROLLERS =====================

const createOrder = async (req, res) => {
  try {
    if (req.user.role === 'admin' || req.user.role === 'cashier') {
      return res.status(403).json({ message: 'المشرفين والكاشير لا يمكنهم تقديم طلبات' });
    }

    const { bookId, grade, subject, quantity, deliveryType, paymentType, deliveryDetails, senderPhone } = req.body;

    const book = await Book.findById(bookId);
    if (!book || !book.isActive) return res.status(404).json({ message: 'الكتاب غير موجود' });
    if (book.stock - (book.reservedQuantity || 0) < quantity) return res.status(400).json({ message: 'الكتاب غير متوفر بالكمية المطلوبة' });

    const booksTotal = book.price * quantity;
    const deliveryCost = (deliveryType === 'shipping' || deliveryType === 'delivery') ? (deliveryDetails?.deliveryPrice || 0) : 0;
    const totalPrice = booksTotal + deliveryCost;
    const totalCost = (book.costPrice || 0) * quantity;
    const profit = totalPrice - totalCost;

    // Determine paid amount based on order type and payment type
    let paidAmount;
    let remainingAmount;
    const effectivePaymentType = paymentType || (deliveryType === 'shipping' ? 'full' : deliveryType === 'pickup' ? 'deposit' : 'full');

    if (effectivePaymentType === 'full') {
      paidAmount = 0; // will be paid via payment proof upload
      remainingAmount = totalPrice;
    } else {
      // deposit mode
      paidAmount = Math.round(totalPrice * 0.1);
      remainingAmount = totalPrice - paidAmount;
    }

    const orderDetails = { ...deliveryDetails };
    if (deliveryType === 'pickup') {
      delete orderDetails.governorate;
      delete orderDetails.center;
      delete orderDetails.address;
      delete orderDetails.deliveryPrice;
    }

    const order = await Order.create({
      user: req.user._id,
      book: bookId,
      grade, subject, quantity,
      booksTotal,
      deliveryPrice: deliveryCost,
      totalPrice,
      paidAmount,
      remainingAmount,
      paymentType: effectivePaymentType,
      deliveryType: deliveryType || 'shipping',
      orderSource: 'online',
      deliveryDetails: orderDetails,
      paymentProof: { senderPhone: senderPhone || '' },
      costPrice: totalCost,
      profit,
      status: 'pending',
    });

    book.reservedQuantity = (book.reservedQuantity || 0) + quantity;
    await book.save();

    createNotification({ user: req.user._id, type: 'order_created', title: 'تم إنشاء الطلب', message: `تم إنشاء طلب ${book.titleAr}`, link: '/orders' });
    createNotification({ type: 'order_created', title: 'طلب جديد', message: `طلب جديد من ${req.user.name}: ${book.titleAr}`, link: '/admin', isAdminNotification: true });

    logActivity({ action: 'order_created', order: order._id, details: { orderId: order.orderId, book: book.titleAr, totalPrice, deliveryType, paymentType: effectivePaymentType } });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء الطلب', error: error.message });
  }
};

// Store walk-in instant sale
const createInstantSale = async (req, res) => {
  try {
    const { bookId, quantity = 1, customerName = '', paidAmount } = req.body;

    const book = await Book.findById(bookId);
    if (!book || !book.isActive) return res.status(404).json({ message: 'الكتاب غير موجود' });
    if (book.stock < quantity) return res.status(400).json({ message: 'الكتاب غير متوفر' });

    const totalPrice = book.price * quantity;
    const totalCost = (book.costPrice || 0) * quantity;
    const paid = paidAmount || totalPrice;

    const order = await Order.create({
      user: req.user._id,
      book: bookId,
      grade: book.grade,
      subject: book.subject,
      quantity,
      booksTotal: totalPrice,
      deliveryPrice: 0,
      totalPrice,
      paidAmount: paid,
      remainingAmount: totalPrice - paid,
      orderSource: 'store',
      deliveryType: 'pickup',
      customerName,
      costPrice: totalCost,
      profit: paid - totalCost,
      status: 'delivered',
      deliveryStatus: 'delivered',
      accounted: false,
      deliveredAt: new Date(),
    });

    // Immediately account the sale
    await accountOrder(order);

    // Deduct stock immediately
    book.stock = Math.max(0, book.stock - quantity);
    book.soldQuantity = (book.soldQuantity || 0) + quantity;
    book.salesCount = (book.salesCount || 0) + quantity;
    await book.save();

    logActivity({ action: 'order_delivered', admin: req.user._id, order: order._id, details: { type: 'instant_sale', book: book.titleAr, totalPrice: paid, customerName } });

    res.status(201).json({ message: 'تم البيع', order });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في البيع', error: error.message });
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
    const { status, deliveryStatus, deliveryType, paymentType, page = 1, limit = 20, search, orderSource, dateFrom, dateTo } = req.query;
    const query = {};

    if (status) query.status = status;
    if (deliveryStatus) query.deliveryStatus = deliveryStatus;
    if (deliveryType) query.deliveryType = deliveryType;
    if (paymentType) query.paymentType = paymentType;
    if (orderSource) query.orderSource = orderSource;

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
      ];

      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      if (users.length > 0) {
        query.$or.push({ user: { $in: users.map(u => u._id) } });
      }
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('book', 'title titleAr price costPrice stock')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({ orders, page: parseInt(page), pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الطلبات' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveryStatus, paidAmount } = req.body;
    const order = await Order.findById(req.params.id).populate('book').populate('user');
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

    const prevStatus = order.status;

    // Update status
    if (status) order.status = status;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;

    // Track payment if admin records a paid amount
    if (paidAmount !== undefined && req.user) {
      order.paidAmount = Math.min(paidAmount, order.totalPrice);
      order.remainingAmount = order.totalPrice - order.paidAmount;
    }

    // Approved: account revenue, sync inventory
    if (status === 'approved' && prevStatus !== 'approved') {
      await accountOrder(order);
      order.approvedAt = new Date();
      createNotification({ user: order.user._id, type: 'order_approved', title: 'تم الموافقة', message: `تمت الموافقة على طلب ${order.book?.titleAr || ''}`, link: '/orders' });
    }

    // Ready for pickup
    if (status === 'ready_for_pickup') {
      createNotification({ user: order.user._id, type: 'general', title: 'الطلب جاهز', message: `طلب ${order.book?.titleAr || ''} جاهز للاستلام`, link: '/orders' });
    }

    // Delivered: finalize
    if (status === 'delivered' && prevStatus !== 'delivered') {
      if (!order.accounted) await accountOrder(order);
      order.deliveredAt = new Date();
      order.remainingAmount = 0;
      order.paidAmount = order.totalPrice;
    }

    // Rejected: release reserved stock
    if (status === 'rejected' && prevStatus !== 'rejected' && order.book) {
      order.book.reservedQuantity = Math.max(0, (order.book.reservedQuantity || 0) - order.quantity);
      await order.book.save();
      createNotification({ user: order.user._id, type: 'order_rejected', title: 'تم رفض الطلب', message: `تم رفض طلب ${order.book?.titleAr || ''}`, link: '/orders' });
    }

    // Sync inventory based on status transition
    await syncInventory(order, prevStatus);

    await order.save();

    // Log activity
    logActivity({
      action: status === 'delivered' ? 'order_delivered' : status === 'approved' ? 'order_approved' : status === 'rejected' ? 'order_rejected' : 'order_status_changed',
      admin: req.user?._id,
      order: order._id,
      details: { from: prevStatus, to: status || deliveryStatus, paidAmount },
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحديث الطلب', error: error.message });
  }
};

const uploadPaymentProof = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

    if (req.file) order.paymentProof.imageUrl = `/uploads/${req.file.filename}`;
    if (req.body.senderPhone) order.paymentProof.senderPhone = req.body.senderPhone;

    // Move to payment_review
    if (order.status === 'pending') order.status = 'payment_review';

    await order.save();

    createNotification({ type: 'payment_uploaded', title: 'إثبات دفع', message: `تم رفع إثبات دفع للطلب ${order.orderId}`, link: '/admin', isAdminNotification: true });
    logActivity({ action: 'payment_uploaded', order: order._id, details: { senderPhone: req.body.senderPhone } });

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
    order.paymentProof.verifiedBy = req.user._id;
    order.paymentProof.verifiedAt = new Date();
    order.status = 'approved';
    order.paidAmount = order.totalPrice;
    order.remainingAmount = 0;
    order.approvedAt = new Date();

    if (!order.accounted) await accountOrder(order);
    await syncInventory(order, 'pending');
    await order.save();

    logActivity({ action: 'payment_verified', admin: req.user._id, order: order._id });

    res.json({ message: 'تم التحقق من الدفع' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التحقق' });
  }
};

const confirmDelivery = async (req, res) => {
  try {
    const { receivedAmount } = req.body;
    const order = await Order.findById(req.params.id).populate('book');
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

    if (order.remainingAmount > 0 && (!receivedAmount || receivedAmount < order.remainingAmount)) {
      return res.status(400).json({ message: `المبلغ المتبقي ${order.remainingAmount} جنيه يجب تحصيله كاملاً` });
    }

    order.paidAmount = order.totalPrice;
    order.remainingAmount = 0;
    order.status = 'delivered';
    order.deliveryStatus = 'delivered';
    order.deliveredAt = new Date();

    if (!order.accounted) await accountOrder(order);
    await syncInventory(order, 'pending');
    await order.save();

    logActivity({ action: 'order_delivered', admin: req.user._id, order: order._id, details: { receivedAmount } });

    res.json({ message: 'تم تأكيد التوصيل', order });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تأكيد التوصيل' });
  }
};

const instantDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('book').populate('user');
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

    order.status = 'delivered';
    order.deliveryStatus = 'delivered';
    order.deliveredAt = new Date();
    order.paidAmount = order.totalPrice;
    order.remainingAmount = 0;

    if (!order.accounted) await accountOrder(order);
    await syncInventory(order, 'pending');
    await order.save();

    logActivity({ action: 'instant_delivery', admin: req.user._id, order: order._id });

    res.json({ message: 'تم التوصيل الفوري', order });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التوصيل الفوري', error: error.message });
  }
};

const refundOrder = async (req, res) => {
  try {
    const { orderId, items, reason } = req.body;

    const order = await Order.findById(orderId).populate('book').populate('user');
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

    if (!['delivered', 'approved', 'ready_for_pickup'].includes(order.status)) {
      return res.status(400).json({ message: 'لا يمكن إرجاع طلب بهذه الحالة' });
    }

    const refundItems = items && items.length > 0 ? items : [{ bookId: order.book?._id || order.book, quantity: order.quantity }];

    let totalRefundAmount = 0;
    const bookUpdates = [];

    for (const item of refundItems) {
      const book = await Book.findById(item.bookId);
      if (!book) return res.status(404).json({ message: 'الكتاب غير موجود' });

      book.stock = (book.stock || 0) + item.quantity;
      book.soldQuantity = Math.max(0, (book.soldQuantity || 0) - item.quantity);
      book.reservedQuantity = Math.max(0, (book.reservedQuantity || 0) - item.quantity);
      await book.save();

      totalRefundAmount += (book.price || 0) * item.quantity;
      bookUpdates.push({ title: book.titleAr, quantity: item.quantity });
    }

    await Transaction.create({
      type: 'expense',
      amount: totalRefundAmount || order.totalPrice,
      category: 'مرتجعات',
      description: `مرتجع طلب ${order.orderId || ''}` + (reason ? `: ${reason}` : ''),
      order: order._id,
      recordedBy: req.user._id,
    });

    order.status = 'returned';
    await order.save();

    logActivity({
      action: 'order_returned',
      admin: req.user._id,
      user: order.user?._id,
      order: order._id,
      details: { reason, items: bookUpdates, refundAmount: totalRefundAmount || order.totalPrice },
    });

    res.json({ message: 'تم إرجاع الطلب', order });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إرجاع الطلب', error: error.message });
  }
};

const adminAction = async (req, res) => {
  try {
    const { action, note } = req.body;
    const order = await Order.findById(req.params.id).populate('book').populate('user');
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

    if (action === 'approve') {
      if (order.status !== 'payment_review' && order.status !== 'pending') {
        return res.status(400).json({ message: 'يمكن الموافقة على الطلبات قيد المراجعة فقط' });
      }
      const prevStatus = order.status;
      order.status = 'approved';
      order.approvedAt = new Date();
      if (note) order.adminNote = note;
      if (!order.accounted) await accountOrder(order);
      await syncInventory(order, prevStatus);
      if (order.user) {
        createNotification({ user: order.user._id, type: 'order_approved', title: 'تم الموافقة على طلبك', message: `تمت الموافقة على طلب ${order.book?.titleAr || ''}`, link: '/orders' });
      }
      logActivity({ action: 'order_approved', admin: req.user._id, order: order._id, details: { note } });
    } else if (action === 'reject') {
      const prevStatus = order.status;
      order.status = 'rejected';
      if (note) order.adminNote = note;
      await syncInventory(order, prevStatus);
      if (order.book) {
        order.book.reservedQuantity = Math.max(0, (order.book.reservedQuantity || 0) - order.quantity);
        await order.book.save();
      }
      if (order.user) {
        createNotification({ user: order.user._id, type: 'order_rejected', title: 'تم رفض الطلب', message: `تم رفض طلب ${order.book?.titleAr || ''}` + (note ? `: ${note}` : ''), link: '/orders' });
      }
      logActivity({ action: 'order_rejected', admin: req.user._id, order: order._id, details: { note } });
    } else {
      return res.status(400).json({ message: 'إجراء غير معروف' });
    }

    await order.save();
    res.json({ message: 'تم بنجاح', order });
  } catch (error) {
    res.status(500).json({ message: 'خطأ', error: error.message });
  }
};

const getGovernorates = async (req, res) => {
  try {
    const prices = await DeliveryPrice.find().sort({ governorate: 1 });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المحافظات' });
  }
};

module.exports = {
  createOrder, createInstantSale, getUserOrders, getAllOrders,
  updateOrderStatus, uploadPaymentProof, verifyPayment, confirmDelivery, instantDelivery,
  refundOrder, adminAction, getGovernorates,
};
