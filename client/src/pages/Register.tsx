import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>إنشاء حساب جديد</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>انضم إلى Book Beacon وابدأ رحلة التعلم</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 space-y-3.5">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>الاسم</label>
              <div className="relative">
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pr-10" placeholder="الاسم الكامل" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pr-10" placeholder="example@email.com" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pr-10" placeholder="01012345678" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-10 pl-10" placeholder="••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field pr-10" placeholder="••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center !py-2.5 mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري إنشاء الحساب...
                </span>
              ) : 'إنشاء حساب'}
            </button>

            <p className="text-center text-sm pt-1" style={{ color: 'var(--muted)' }}>
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="font-medium" style={{ color: 'var(--primary)' }}>تسجيل الدخول</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
