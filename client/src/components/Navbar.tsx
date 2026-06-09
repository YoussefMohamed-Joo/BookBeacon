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
      scrolled
        ? 'bg-[var(--card-bg)]/90 backdrop-blur-lg border-b border-[var(--border)]'
        : 'bg-transparent'
    }`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={38} />
            <div className="flex flex-col">
              <span className="text-base font-bold leading-none" style={{ color: 'var(--text-primary)' }}>Book Beacon</span>
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>بوك بيكون</span>
            </div>
          </Link>

          {/* Center: Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path
                    ? '!text-[var(--text-primary)] !bg-[var(--soft)]'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-[var(--soft)] transition-all"
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user && <NotificationBell />}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="btn-ghost flex items-center gap-2 !px-2"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm hidden lg:block">{user.name}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute left-0 top-full mt-2 w-52 bg-[var(--card-bg)] backdrop-blur-xl rounded-xl shadow-warm border border-[var(--border)] p-1.5 z-50">
                      <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{user.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-[var(--soft)] transition-all">
                        <ShoppingCart className="w-4 h-4" style={{ color: 'var(--muted)' }} /> طلباتي
                      </Link>
                      <Link to="/my-pickups" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-[var(--soft)] transition-all">
                        <Store className="w-4 h-4" style={{ color: 'var(--primary)' }} /> حجوزاتي
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-[var(--soft)] transition-all">
                          <LayoutDashboard className="w-4 h-4" style={{ color: 'var(--primary)' }} /> لوحة التحكم
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-1">
                        <LogOut className="w-4 h-4" /> تسجيل الخروج
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/register" className="btn-ghost text-sm">
                  إنشاء حساب
                </Link>
                <Link to="/login" className="btn-primary text-sm !py-2 !px-4">
                  <User className="w-4 h-4" /> تسجيل الدخول
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--soft)] transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--card-bg)]/95 backdrop-blur-lg border-t border-[var(--border)]">
          <div className="page-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`block px-4 py-2.5 rounded-lg text-sm transition-all ${
                  location.pathname === link.path
                    ? 'bg-[var(--soft)] font-medium'
                    : 'hover:bg-[var(--soft)]'
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
                <Link to="/orders" className="block px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--soft)] transition-all">
                  <ShoppingCart className="w-4 h-4 inline ml-1.5" /> طلباتي
                </Link>
                <Link to="/my-pickups" className="block px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--soft)] transition-all">
                  <Store className="w-4 h-4 inline ml-1.5" /> حجوزاتي
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--soft)] transition-all">
                    <LayoutDashboard className="w-4 h-4 inline ml-1.5" /> لوحة التحكم
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full text-right px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <LogOut className="w-4 h-4 inline ml-1.5" /> تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="block px-4 py-2.5 rounded-lg text-sm text-center hover:bg-[var(--soft)] transition-all">
                  إنشاء حساب
                </Link>
                <Link to="/login" className="block px-4 py-2.5 rounded-lg text-sm text-center btn-primary justify-center mt-2">
                  تسجيل الدخول
                </Link>
              </>
            )}
            <button onClick={toggleDarkMode} className="flex items-center gap-2 px-4 py-2.5 text-sm w-full rounded-lg hover:bg-[var(--soft)] transition-all mt-1">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
