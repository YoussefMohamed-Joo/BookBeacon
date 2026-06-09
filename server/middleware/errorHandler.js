const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'معرف غير صالح' });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `هذا ${field} موجود بالفعل` });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.message?.includes('Only image files')) {
    return res.status(400).json({ message: 'يُسمح فقط بملفات الصور' });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'حجم الملف كبير جداً (الحد الأقصى 5MB)' });
  }

  res.status(500).json({ message: 'خطأ في الخادم' });
};

module.exports = errorHandler;
