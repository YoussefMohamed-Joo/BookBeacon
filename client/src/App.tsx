import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorFollower from './components/CursorFollower';
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
import ChatBot from './components/ChatBot';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1],
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      {children}
    </motion.div>
  );
}

function App() {
  const { isDarkMode } = useStore();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-dark-950 text-gray-900 dark:text-gray-100 font-sans">
      <LoadingScreen />
      <CursorFollower />
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
          <Route path="*" element={<AnimatedPage><div className="min-h-screen flex items-center justify-center pt-16"><div className="text-center"><h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1><p className="text-gray-500">الصفحة غير موجودة</p></div></div></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
      <ChatBot />
      <Footer />
    </div>
  );
}

export default App;
