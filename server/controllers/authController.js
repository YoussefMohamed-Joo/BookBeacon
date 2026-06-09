const User = require('../models/User');
const OTP = require('../models/OTP');
const generateToken = require('../utils/generateToken');
const generateOTP = require('../utils/otpGenerator');
const sendEmail = require('../utils/emailService');

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'البريد الإلكتروني مسجل بالفعل' });
    }

    const user = await User.create({ name, email, phone, password, isVerified: true });

    // Commented: OTP verification disabled
    // const emailOtp = generateOTP(6);
    // const phoneOtp = generateOTP(5);
    // await OTP.create({ email: user.email, otp: emailOtp, type: 'email', expiresAt: new Date(Date.now() + 2 * 60 * 1000) });
    // await OTP.create({ email: user.email, otp: phoneOtp, type: 'phone', expiresAt: new Date(Date.now() + 2 * 60 * 1000) });
    // await sendEmail(user.email, 'رمز التحقق - Book Beacon', `<h2>مرحباً ${user.name}</h2><p>رمز التحقق الخاص بالبريد الإلكتروني: <strong>${emailOtp}</strong></p><p>صالح لمدة دقيقتين</p>`);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isVerified: true,
      loyaltyPoints: user.loyaltyPoints,
      token: generateToken(user._id, user.role),
      message: 'تم التسجيل بنجاح',
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التسجيل', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'بريد إلكتروني أو كلمة مرور غير صحيحة' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'تم حظر حسابك، تواصل مع الدعم' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'بريد إلكتروني أو كلمة مرور غير صحيحة' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      loyaltyPoints: user.loyaltyPoints,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تسجيل الدخول', error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp, type } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp,
      type,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      const existing = await OTP.findOne({ email, type });
      if (existing && existing.attempts >= 3) {
        await OTP.deleteOne({ _id: existing._id });
        return res.status(400).json({ message: 'تم تجاوز عدد المحاولات المسموح بها' });
      }
      if (existing) {
        existing.attempts += 1;
        await existing.save();
      }
      return res.status(400).json({ message: 'رمز التحقق غير صالح أو منتهي الصلاحية' });
    }

    await User.findOneAndUpdate({ email }, { isVerified: true });
    await OTP.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ email });

    res.json({
      message: 'تم التحقق بنجاح',
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التحقق', error: error.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email, type } = req.body;

    await OTP.deleteMany({ email, type });

    const newOtp = generateOTP(type === 'email' ? 6 : 5);
    await OTP.create({
      email,
      otp: newOtp,
      type,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });

    if (type === 'email') {
      await sendEmail(
        email,
        'رمز التحقق الجديد - Book Beacon',
        `<h2>رمز التحقق الجديد</h2><p>الرمز: <strong>${newOtp}</strong></p><p>صالح لمدة دقيقتين</p>`
      );
    }

    res.json({ message: 'تم إرسال رمز التحقق الجديد' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إعادة الإرسال', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات' });
  }
};

module.exports = { register, login, verifyOTP, resendOTP, getProfile };
