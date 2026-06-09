const Book = require('../models/Book');

const getBooks = async (req, res) => {
  try {
    const { grade, subject, search, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (grade) query.grade = grade;
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleAr: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { teacher: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Book.countDocuments(query);

    res.json({
      books,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الكتب', error: error.message });
  }
};

const getBookBySlug = async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug, isActive: true });
    if (!book) return res.status(404).json({ message: 'الكتاب غير موجود' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الكتاب' });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'الكتاب غير موجود' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الكتاب' });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, titleAr, grade, subject, teacher, price, costPrice, deposit, stock, description, descriptionAr, keywords, metaTitle, metaDescription } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + grade.replace(/\s/g, '-');

    const autoDeposit = deposit !== undefined ? deposit : Math.round(price * 0.1);

    const book = await Book.create({
      title, titleAr, slug, grade, subject, teacher: teacher || '',
      price, costPrice: costPrice || 0,
      deposit: autoDeposit,
      stock: stock || 0,
      description, descriptionAr,
      keywords, metaTitle, metaDescription,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء الكتاب', error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'الكتاب غير موجود' });

    const updateData = req.body;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updated = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحديث الكتاب', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'الكتاب غير موجود' });

    book.isActive = false;
    await book.save();
    res.json({ message: 'تم حذف الكتاب بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في حذف الكتاب', error: error.message });
  }
};

const getBooksByGrade = async (req, res) => {
  try {
    const books = await Book.find({ grade: req.params.grade, isActive: true });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الكتب' });
  }
};

module.exports = { getBooks, getBookBySlug, getBookById, createBook, updateBook, deleteBook, getBooksByGrade };
