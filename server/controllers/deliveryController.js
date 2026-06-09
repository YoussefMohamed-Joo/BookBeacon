const DeliveryPrice = require('../models/DeliveryPrice');

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

module.exports = { getDeliveryPrices, setDeliveryPrice, deleteDeliveryPrice };
