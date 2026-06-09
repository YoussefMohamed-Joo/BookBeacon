const mongoose = require('mongoose');

const deliveryPriceSchema = new mongoose.Schema(
  {
    governorate: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryPrice', deliveryPriceSchema);
