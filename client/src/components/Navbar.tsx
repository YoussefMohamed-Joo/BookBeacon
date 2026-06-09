import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, LogOut, ShoppingCart, LayoutDashboard, Store, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import NotificationBell from './NotificationBell';
import Logo from './Logo';

export default function Navbar() {
  const { user, isDarkMode, toggleDarkMode, logout } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setShowUserMenu(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = [
    { label: 'الرئيسية', path: '/' },
    { label: 'الكتب', path: '/books' },
    { label: 'المدونة', path: '/blog' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[var(--card-bg)]/95 backdrop-blur-lg border-b border-[var(--border)]' : 'bg-transparent'
    }`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">

          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={38} />
            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>بوكيفاي</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`nav-link ${location.pathname === link.path ? '!text-[var(--primary)] !bg-[var(--soft)]' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-[var(--soft)] transition-all" title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}>
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user && <NotificationBell />}

            {user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--soft)] transition-all">
                  <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm hidden lg:block">{user.name}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute left-0 top-full mt-2 w-48 bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border)] p-1.5 z-50">
                      <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{user.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[var(--soft)] transition-all">
                        <ShoppingCart className="w-4 h-4" /> طلباتي
                      </Link>
                      <Link to="/my-pickups" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[var(--soft)] transition-all">
                        <Store className="w-4 h-4" /> حجوزاتي
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[var(--soft)] transition-all">
                          <LayoutDashboard className="w-4 h-4" /> لوحة التحكم
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-all mt-1">
                        <LogOut className="w-4 h-4" /> تسجيل الخروج
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link to="/register" className="btn-secondary text-sm !py-1.5 !px-3.5">إنشاء حساب</Link>
                <Link to="/login" className="btn-primary text-sm !py-1.5 !px-3.5">
                  <User className="w-3.5 h-3.5" /> تسجيل الدخول
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-[var(--soft)] transition-all" onClick={() => setIsOpen(!isOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[var(--card-bg)]/95 backdrop-blur-lg border-t border-[var(--border)]">
          <div className="page-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`block px-4 py-2.5 rounded-lg text-sm transition-all ${
                  location.pathname === link.path ? 'bg-[var(--soft)] font-medium' : 'hover:bg-[var(--soft)]'
                }`}
                style={{ color: location.pathname === link.path ? 'var(--text-primary)' : 'var(--muted)' }}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2" style={{ borderColor: 'var(--border)' }} />
            {user ? (
              <>
                <div className="px-4 py-2 text-sm" style={{ color: 'var(--muted)' }}>{user.name}</div>
                <Link to="/orders" className="block px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--soft)]">طلباتي</Link>
                <Link to="/my-pickups" className="block px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--soft)]">حجوزاتي</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--soft)]">لوحة التحكم</Link>
                )}
                <button onClick={handleLogout} className="w-full text-right px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50">تسجيل الخروج</button>
              </>
            ) : (
              <>
                <Link to="/register" className="block px-4 py-2.5 rounded-lg text-sm text-center hover:bg-[var(--soft)]">إنشاء حساب</Link>
                <Link to="/login" className="btn-primary block text-center justify-center mt-2">تسجيل الدخول</Link>
              </>
            )}
            <button onClick={toggleDarkMode} className="flex items-center gap-2 px-4 py-2.5 text-sm w-full rounded-lg hover:bg-[var(--soft)] mt-1">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
