const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  action: {
    type: String,
    required: true,
    enum: ['stock_added', 'stock_removed', 'stock_sold', 'stock_reserved', 'stock_released', 'manual_adjustment'],
  },
  quantity: { type: Number, required: true },
  previousStock: { type: Number, default: 0 },
  newStock: { type: Number, default: 0 },
  previousReserved: { type: Number, default: 0 },
  newReserved: { type: Number, default: 0 },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, default: '' },
}, { timestamps: true });

inventoryLogSchema.index({ book: 1, createdAt: -1 });

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
