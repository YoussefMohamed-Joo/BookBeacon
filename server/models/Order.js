const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    grade: { type: String, required: true },
    subject: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    booksTotal: { type: Number, default: 0 },
    deliveryPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    deliveryStatus: {
      type: String,
      enum: ['not_started', 'preparing', 'out_for_delivery', 'delivered'],
      default: 'not_started',
    },
    deliveryMethod: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true,
    },
    deliveryDetails: {
      governorate: { type: String },
      center: { type: String },
      address: { type: String },
      phone: { type: String },
      whatsapp: { type: String },
      deliveryPrice: { type: Number, default: 0 },
    },
    paymentProof: {
      imageUrl: { type: String },
      senderPhone: { type: String },
      verified: { type: Boolean, default: false },
    },
    isFraudFlagged: { type: Boolean, default: false },
    fraudReason: { type: String, default: '' },
    notes: { type: String, default: '' },
    profit: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    accounted: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
