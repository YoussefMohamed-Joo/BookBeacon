const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'المستخدم غير موجود' });
      }
      if (req.user.isBlocked) {
        return res.status(403).json({ message: 'تم حظر حسابك' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'غير مصرح به، توكن غير صالح' });
    }
  } else {
    return res.status(401).json({ message: 'غير مصرح به، لا يوجد توكن' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'غير مصرح به، مشرف فقط' });
  }
};

const cashier = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'cashier')) {
    next();
  } else {
    return res.status(403).json({ message: 'غير مصرح به، كاشير أو مشرف فقط' });
  }
};

module.exports = { protect, admin, cashier };
