import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, LogOut, ShoppingCart, LayoutDashboard, User, ChevronDown, Sparkles, Store } from 'lucide-react';
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
    { label: 'تواصل معنا', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-dark-800/50 shadow-soft'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5">
              <Logo size={42} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none gradient-text">Book Beacon</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">بوك بيكون</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100/50 dark:hover:bg-dark-700/50'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-dark-700/50 transition-all"
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5 text-gray-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {user && <NotificationBell />}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-dark-700/50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-500/20">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute left-0 top-full mt-2 w-56 bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 dark:border-dark-700/50 p-2"
                    >
                      <div className="px-3 py-2.5 border-b border-gray-100 dark:border-dark-700 mb-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-dark-700 transition-all">
                        <ShoppingCart className="w-4 h-4 text-gray-400" /> طلباتي
                      </Link>
                      <Link to="/my-pickups" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-dark-700 transition-all">
                        <Store className="w-4 h-4 text-primary-400" /> حجوزاتي
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-dark-700 transition-all">
                          <LayoutDashboard className="w-4 h-4 text-primary-500" /> لوحة التحكم
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all mt-1">
                        <LogOut className="w-4 h-4" /> تسجيل الخروج
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/register" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-dark-700/50 transition-all">
                  <Sparkles className="w-4 h-4 inline ml-1" /> إنشاء حساب
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/login" className="btn-primary text-sm !py-2.5 !px-5 shadow-lg shadow-primary-500/20">
                    <User className="w-4 h-4 inline ml-1.5" /> تسجيل الدخول
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          <button className="md:hidden p-2.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-dark-700/50 transition-all" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl border-t border-gray-100/50 dark:border-dark-800/50"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-gray-100 dark:border-dark-700" />
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500">{user.name} - {user.email}</div>
                  <Link to="/orders" className="block px-4 py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-dark-700">
                    <ShoppingCart className="w-4 h-4 inline ml-1.5" /> طلباتي
                  </Link>
                  <Link to="/my-pickups" className="block px-4 py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-dark-700">
                    <Store className="w-4 h-4 inline ml-1.5" /> حجوزاتي
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-3 rounded-xl text-sm text-primary-500 hover:bg-gray-50 dark:hover:bg-dark-700">
                      <LayoutDashboard className="w-4 h-4 inline ml-1.5" /> لوحة التحكم
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-right px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="w-4 h-4 inline ml-1.5" /> تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className="block px-4 py-3 rounded-xl text-sm font-medium text-center text-primary-500 border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 mb-2">
                    <Sparkles className="w-4 h-4 inline ml-1" /> إنشاء حساب
                  </Link>
                  <Link to="/login" className="block px-4 py-3 rounded-xl text-sm btn-primary text-center">
                    تسجيل الدخول
                  </Link>
                </>
              )}
              <button onClick={toggleDarkMode} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 w-full">
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
