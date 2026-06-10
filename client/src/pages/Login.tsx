import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { authAPI } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useStore();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Submit -> call API, store user, redirect based on role
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast.success(`مرحباً ${data.name}`);
      navigate(data.role === 'admin' || data.role === 'cashier' ? '/admin' : '/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطأ في تسجيل الدخول');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>تسجيل الدخول | بوك بيكون</title></Helmet>
      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>تسجيل الدخول</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>مرحباً بك مرة أخرى</p>
          </div>

          {/* Login form card */}
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pr-10" placeholder="admin@bookbeacon.com" dir="ltr" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-10 pl-10" placeholder="••••••" />
                {/* Toggle password visibility */}
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-2.5">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </span>
              ) : 'تسجيل الدخول'}
            </button>

            <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>
              ليس لديك حساب؟{' '}
              <Link to="/register" className="font-medium" style={{ color: 'var(--accent)' }}>إنشاء حساب جديد</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
