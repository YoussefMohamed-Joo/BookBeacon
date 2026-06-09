const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    contentAr: { type: String, required: true },
    excerpt: { type: String, default: '' },
    excerptAr: { type: String, default: '' },
    image: { type: String, default: '' },
    author: { type: String, default: 'Book Beacon' },
    keywords: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    readTime: { type: String, default: '5 دقائق' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
