const mongoose = require('mongoose');

// Generate a unique human-readable barcode
async function generateBarcode() {
  const count = await mongoose.model('Book').countDocuments();
  const seq = String(count + 1).padStart(6, '0');
  return `BB${seq}`;
}

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, default: '' },
    grade: { type: String, required: true, enum: ['أولى ثانوي', 'تانية ثانوي', 'تالتة ثانوي'] },
    subject: { type: String, required: true },
    teacher: { type: String, default: '' },
    price: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    barcode: { type: String, unique: true, sparse: true },
    stock: { type: Number, default: 0 },
    reservedQuantity: { type: Number, default: 0 },
    soldQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    description: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },
    image: { type: String, default: '' },
    keywords: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    salesCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookSchema.pre('save', async function (next) {
  if (!this.barcode) {
    this.barcode = await generateBarcode();
  }
  next();
});

bookSchema.virtual('availableQuantity').get(function () {
  return this.stock - this.reservedQuantity;
});

bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);
