const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({ message });
  }
  next();
};

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'الاسم يجب أن يكون أكثر من حرفين',
    'any.required': 'الاسم مطلوب',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'البريد الإلكتروني غير صالح',
    'any.required': 'البريد الإلكتروني مطلوب',
  }),
  phone: Joi.string().pattern(/^01[0-9]{9}$/).required().messages({
    'string.pattern.base': 'رقم الهاتف غير صالح (يجب أن يبدأ بـ 01 ويتبعه 9 أرقام)',
    'any.required': 'رقم الهاتف مطلوب',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    'any.required': 'كلمة المرور مطلوبة',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const bookSchema = Joi.object({
  title: Joi.string().required(),
  titleAr: Joi.string().required(),
  grade: Joi.string().valid('أولى ثانوي', 'تانية ثانوي', 'تالتة ثانوي').required(),
  subject: Joi.string().required(),
  price: Joi.number().positive().required(),
  deposit: Joi.number().min(0).default(10),
  stock: Joi.number().integer().min(0).default(0),
  description: Joi.string().allow(''),
  descriptionAr: Joi.string().allow(''),
  keywords: Joi.string().allow(''),
  metaTitle: Joi.string().allow(''),
  metaDescription: Joi.string().allow(''),
});

module.exports = { validate, registerSchema, loginSchema, bookSchema };
