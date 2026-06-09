const mongoose = require('mongoose');

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
    stock: { type: Number, default: 0 },
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

module.exports = mongoose.model('Book', bookSchema);
