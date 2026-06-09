const Blog = require('../models/Blog');

const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const blogs = await Blog.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Blog.countDocuments({ isActive: true });
    res.json({ blogs, page: parseInt(page), pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المقالات' });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isActive: true });
    if (!blog) return res.status(404).json({ message: 'المقال غير موجود' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المقال' });
  }
};

const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المقالات' });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, titleAr, content, contentAr, excerpt, excerptAr, keywords, metaTitle, metaDescription } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const blog = await Blog.create({
      title, titleAr, slug, content, contentAr, excerpt, excerptAr,
      keywords, metaTitle, metaDescription,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء المقال', error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'المقال غير موجود' });

    const updateData = req.body;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحديث المقال' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف المقال بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في حذف المقال' });
  }
};

module.exports = { getBlogs, getBlogBySlug, getAllBlogsAdmin, createBlog, updateBlog, deleteBlog };
