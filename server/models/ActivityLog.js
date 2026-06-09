const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'order_created', 'order_approved', 'order_delivered', 'order_rejected',
      'order_status_changed', 'payment_uploaded', 'payment_verified',
      'instant_sale', 'user_banned', 'user_unbanned',
      'stock_added', 'stock_adjusted', 'book_created', 'book_updated',
    ],
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

// Index for fast queries
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ order: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
