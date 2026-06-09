import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BookOpen, User, Mail, Phone, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { authAPI } from '../lib/api';

export default function Register() {
  const navigate = useNavigate();
  const setUser = useStore((s) => s.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) { toast.error('يرجى ملء جميع الحقول'); return; }
    if (password !== confirmPassword) { toast.error('كلمة المرور غير متطابقة'); return; }
    if (password.length < 6) { toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    if (!/^01[0-9]{9}$/.test(phone)) { toast.error('رقم الهاتف غير صالح'); return; }

    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, phone, password });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast.success('تم التسجيل بنجاح!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطأ في التسجيل');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>إنشاء حساب | Book Beacon</title></Helmet>
      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary-400/10 rounded-full blur-[100px]" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/30">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold gradient-text">إنشاء حساب جديد</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">انضم إلى <span className="font-semibold text-gray-700 dark:text-gray-300">Book Beacon</span> وابدأ رحلة التعلم</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-dark-700/50 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">الاسم</label>
              <div className="relative">
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pr-10" placeholder="الاسم الكامل" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pr-10" placeholder="example@email.com" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pr-10" placeholder="01012345678" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-10 pl-10" placeholder="••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field pr-10" placeholder="••••••" />
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full py-3 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-500 text-white font-bold text-base shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري إنشاء الحساب...
                </span>
              ) : 'إنشاء حساب'}
            </motion.button>

            <p className="text-center text-sm text-gray-500">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium transition-colors">تسجيل الدخول</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
}
