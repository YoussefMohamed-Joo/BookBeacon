const mongoose = require('mongoose');

// Auto-generate sequential order ID: BB-2026-000001
async function getNextOrderId() {
  const year = new Date().getFullYear();
  const count = await mongoose.model('Order').countDocuments();
  const seq = String(count + 1).padStart(6, '0');
  return `BB-${year}-${seq}`;
}

const orderSchema = new mongoose.Schema(
  {
    // Unique human-readable order ID
    orderId: { type: String, unique: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    grade: { type: String, required: true },
    subject: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },

    // Pricing breakdown
    booksTotal: { type: Number, default: 0 },
    deliveryPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    // Payment tracking
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },

    // === NEW unified status flow ===
    // pending -> payment_review -> approved -> ready_for_pickup -> delivered
    status: {
      type: String,
      enum: ['pending', 'payment_review', 'approved', 'ready_for_pickup', 'delivered', 'rejected', 'returned'],
      default: 'pending',
    },

    // Legacy delivery status (kept for backward compat on existing orders)
    deliveryStatus: {
      type: String,
      enum: ['not_started', 'preparing', 'out_for_delivery', 'delivered'],
      default: 'not_started',
    },

    // Source & method
    orderSource: {
      type: String,
      enum: ['online', 'store'],
      default: 'online',
    },
    deliveryType: {
      type: String,
      enum: ['pickup', 'delivery', 'shipping'],
      default: 'delivery',
    },

    deliveryDetails: {
      governorate: { type: String },
      center: { type: String },
      address: { type: String },
      phone: { type: String },
      whatsapp: { type: String },
      deliveryPrice: { type: Number, default: 0 },
    },

    // Payment proof
    paymentProof: {
      imageUrl: { type: String },
      senderPhone: { type: String },
      verified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: { type: Date },
    },

    // Customer name for store walk-in sales
    customerName: { type: String, default: '' },

    // Fraud prevention
    isFraudFlagged: { type: Boolean, default: false },
    fraudReason: { type: String, default: '' },
    notes: { type: String, default: '' },

    // Accounting
    profit: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    accounted: { type: Boolean, default: false },

    // Timestamps
    deliveredAt: { type: Date },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

// Auto-generate orderId before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    this.orderId = await getNextOrderId();
  }
  // Always keep remainingAmount in sync
  this.remainingAmount = this.totalPrice - this.paidAmount;
  next();
});

module.exports = mongoose.model('Order', orderSchema);
