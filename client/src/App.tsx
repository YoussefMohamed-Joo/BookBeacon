import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import { pageTransition } from './lib/animations';
import { setNavigate } from './lib/navigate';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Orders from './pages/Orders';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import PaymentMethods from './pages/PaymentMethods';
import DeliveryPolicy from './pages/DeliveryPolicy';
import MyPickups from './pages/MyPickups';
import CustomerDashboard from './pages/CustomerDashboard';
import Cart from './pages/Cart';
import OrderPage from './pages/OrderPage';
import ScrollDemo from './pages/ScrollDemo';
import NavbarDemo from './pages/NavbarDemo';
import SplineDemo from './pages/SplineDemo';
import ComponentsDemo from './pages/ComponentsDemo';
import ChatBot from './components/ChatBot';
import { FloatingPathsBackground } from './components/ui/background-paths';
import ErrorBoundary from './components/ErrorBoundary';

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const { isDarkMode } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Register navigate for API 401 redirect (avoids full page reload)
  useEffect(() => { setNavigate(navigate); }, [navigate]);

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg)', backgroundImage: 'var(--bg-gradient)', color: 'var(--text)' }}>
      <FloatingPathsBackground />
      <div className="relative z-10">
        <ErrorBoundary>
          <LoadingScreen />
          <TopBar />
          <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/books" element={<AnimatedPage><Books /></AnimatedPage>} />
            <Route path="/books/:slug" element={<AnimatedPage><BookDetail /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
            <Route path="/verify-otp" element={<AnimatedPage><VerifyOTP /></AnimatedPage>} />
            <Route path="/orders" element={<AnimatedPage><Orders /></AnimatedPage>} />
            <Route path="/blog" element={<AnimatedPage><Blog /></AnimatedPage>} />
            <Route path="/blog/:slug" element={<AnimatedPage><BlogDetail /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
            <Route path="/admin" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
            <Route path="/privacy" element={<AnimatedPage><Privacy /></AnimatedPage>} />
            <Route path="/terms" element={<AnimatedPage><Terms /></AnimatedPage>} />
            <Route path="/faq" element={<AnimatedPage><FAQ /></AnimatedPage>} />
            <Route path="/payment-methods" element={<AnimatedPage><PaymentMethods /></AnimatedPage>} />
            <Route path="/delivery-policy" element={<AnimatedPage><DeliveryPolicy /></AnimatedPage>} />
            <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
            <Route path="/order/new" element={<AnimatedPage><OrderPage /></AnimatedPage>} />
            <Route path="/scroll-demo" element={<AnimatedPage><ScrollDemo /></AnimatedPage>} />
            <Route path="/navbar-demo" element={<AnimatedPage><NavbarDemo /></AnimatedPage>} />
            <Route path="/spline-demo" element={<AnimatedPage><SplineDemo /></AnimatedPage>} />
            <Route path="/components-demo" element={<AnimatedPage><ComponentsDemo /></AnimatedPage>} />
            <Route path="/my-pickups" element={<AnimatedPage><MyPickups /></AnimatedPage>} />
            <Route path="/dashboard" element={<AnimatedPage><CustomerDashboard /></AnimatedPage>} />
            <Route path="*" element={<AnimatedPage><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-6xl font-bold opacity-20 mb-4">404</h1><p className="opacity-50">الصفحة غير موجودة</p></div></div></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
        <ChatBot />
        <Footer />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
