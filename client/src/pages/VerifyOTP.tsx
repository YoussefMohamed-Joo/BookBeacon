import { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Shield, Mail, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { authAPI } from '../lib/api';

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useStore();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { toast.error('يرجى إدخال رمز التحقق كاملاً'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.verifyOTP({ email, otp: code, type: 'email' });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast.success('تم التحقق بنجاح!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'رمز التحقق غير صالح');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    try {
      await authAPI.resendOTP({ email, type: 'email' });
      toast.success('تم إرسال رمز تحقق جديد');
    } catch { toast.error('حدث خطأ'); }
  };

  return (
    <>
      <Helmet><title>التحقق من البريد الإلكتروني | Book Beacon</title></Helmet>
      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-[100px]" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-primary-600 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold text-[var(--primary)]">التحقق من البريد الإلكتروني</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              أدخل رمز التحقق المرسل إلى
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300" dir="ltr">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-dark-700/50 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-center text-gray-600 dark:text-gray-300">رمز التحقق</label>
              <div className="flex gap-2 justify-center" dir="ltr">
                {otp.map((digit, index) => (
                  <input key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 bg-white dark:bg-dark-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all border-gray-200 dark:border-dark-600"
                    maxLength={1}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full py-3 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-500 text-white font-bold text-base shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحقق...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" /> تحقق
                </span>
              )}
            </motion.button>

            <button type="button" onClick={handleResend}
              className="flex items-center justify-center gap-1.5 text-primary-500 hover:text-primary-600 text-sm w-full transition-colors font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" /> إعادة إرسال الرمز
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
