const DeliveryPrice = require('../models/DeliveryPrice');
const Order = require('../models/Order');

const getDeliveryPrices = async (req, res) => {
  try {
    const prices = await DeliveryPrice.find().sort({ governorate: 1 });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب أسعار التوصيل' });
  }
};

const setDeliveryPrice = async (req, res) => {
  try {
    const { governorate, price } = req.body;

    let deliveryPrice = await DeliveryPrice.findOne({ governorate });
    if (deliveryPrice) {
      deliveryPrice.price = price;
      await deliveryPrice.save();
    } else {
      deliveryPrice = await DeliveryPrice.create({ governorate, price });
    }

    res.json(deliveryPrice);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تعيين سعر التوصيل' });
  }
};

const deleteDeliveryPrice = async (req, res) => {
  try {
    await DeliveryPrice.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
};

const getPickups = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryMethod: 'pickup' })
      .populate('user', 'name email phone')
      .populate('book', 'titleAr title')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الحجوزات', error: error.message });
  }
};

const updatePickupStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus, status: deliveryStatus === 'delivered' ? 'approved' : 'pending' },
      { new: true }
    ).populate('user', 'name email phone').populate('book', 'titleAr title');
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحديث حالة الحجز', error: error.message });
  }
};

const getUserPickups = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, deliveryMethod: 'pickup' })
      .populate('book', 'titleAr title price images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب حجوزاتك', error: error.message });
  }
};

module.exports = { getDeliveryPrices, setDeliveryPrice, deleteDeliveryPrice, getPickups, updatePickupStatus, getUserPickups };
