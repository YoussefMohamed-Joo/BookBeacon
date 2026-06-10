import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ShoppingCart, LayoutDashboard, Store, User, Menu, X, Moon, Sun } from 'lucide-react';
import { useStore } from '../store/useStore';
import NotificationBell from './NotificationBell';
import SearchBar from './SearchBar';
import Logo from './Logo';

export default function Navbar() {
  const { user, isDarkMode, toggleDarkMode, logout, cart } = useStore();
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
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
    <nav className={`fixed top-9 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[var(--card-bg)]/95 backdrop-blur-lg border-b border-[var(--border)]' : 'bg-transparent'
    }`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`nav-link ${location.pathname === link.path ? '!text-white !bg-white/10' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-white/5 transition-all">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <SearchBar />

            {user && <NotificationBell />}

            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-white/5 transition-all">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: 'var(--accent)', color: '#0a1628' }}>{cartCount}</span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm hidden lg:block">{user.name}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute left-0 top-full mt-2 w-48 bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border)] p-1.5 z-50" style={{ backdropFilter: 'blur(20px)' }}>
                      <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{user.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-all"><ShoppingCart className="w-4 h-4" /> طلباتي</Link>
                      <Link to="/my-pickups" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-all"><Store className="w-4 h-4" /> حجوزاتي</Link>
                      {(user.role === 'admin' || user.role === 'cashier') && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-all"><LayoutDashboard className="w-4 h-4" /> لوحة التحكم</Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-all mt-1" style={{ color: 'var(--danger)' }}><LogOut className="w-4 h-4" /> تسجيل الخروج</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link to="/register" className="btn-secondary text-sm !py-1.5 !px-3.5">إنشاء حساب</Link>
                <Link to="/login" className="btn-primary text-sm !py-1.5 !px-4">
                  <User className="w-3.5 h-3.5" /> تسجيل الدخول
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-all" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[var(--card-bg)]/95 backdrop-blur-lg border-t border-[var(--border)]">
          <div className="page-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`block px-4 py-2.5 rounded-lg text-sm transition-all ${
                  location.pathname === link.path ? 'bg-white/10 font-medium' : 'hover:bg-white/5'
                }`}
                style={{ color: location.pathname === link.path ? 'white' : 'var(--text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2" style={{ borderColor: 'var(--border)' }} />
            {user ? (
              <>
                <div className="px-4 py-2 text-sm" style={{ color: 'var(--muted)' }}>{user.name}</div>
                <Link to="/orders" className="block px-4 py-2.5 rounded-lg text-sm hover:bg-white/5">طلباتي</Link>
                <Link to="/my-pickups" className="block px-4 py-2.5 rounded-lg text-sm hover:bg-white/5">حجوزاتي</Link>
                {(user.role === 'admin' || user.role === 'cashier') && <Link to="/admin" className="block px-4 py-2.5 rounded-lg text-sm hover:bg-white/5">لوحة التحكم</Link>}
                <button onClick={handleLogout} className="w-full text-right px-4 py-2.5 rounded-lg text-sm" style={{ color: 'var(--danger)' }}>تسجيل الخروج</button>
              </>
            ) : (
              <>
                <Link to="/register" className="block px-4 py-2.5 rounded-lg text-sm text-center hover:bg-white/5">إنشاء حساب</Link>
                <Link to="/login" className="btn-primary block text-center justify-center mt-2">تسجيل الدخول</Link>
              </>
            )}
            <button onClick={toggleDarkMode} className="flex items-center gap-2 px-4 py-2.5 text-sm w-full rounded-lg hover:bg-white/5 mt-1">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
