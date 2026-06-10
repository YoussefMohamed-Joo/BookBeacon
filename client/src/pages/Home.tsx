import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import BookCard from '../components/BookCard';
import AnimatedIcon from '../components/animations/AnimatedIcon';
import { booksAPI } from '../lib/api';

// Hero slider data
const slides = [
  {
    id: 1,
    title: 'كتب تالتة ثانوي',
    subtitle: 'من أفضل الأساتذة في مصر',
    cta: 'تسوق الآن',
    badge: '🔥 الأكثر مبيعاً',
  },
  {
    id: 2,
    title: 'خصم يصل إلى ٣٠٪',
    subtitle: 'على جميع كتب أولى وتانية ثانوي',
    cta: 'استفيد دلوقتي',
    badge: '🎉 عروض حصرية',
  },
];

// Grade categories for quick navigation
const grades = [
  { name: 'أولى ثانوي', slug: 'أولى+ثانوي' },
  { name: 'تانية ثانوي', slug: 'تانية+ثانوي' },
  { name: 'تالتة ثانوي', slug: 'تالتة+ثانوي' },
];

// Hide scrollbar globally for sliders
const sliderScrollStyle = `
  .slider-track::-webkit-scrollbar { display: none; }
  .slider-track { scrollbar-width: none; -ms-overflow-style: none; }
`;

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Fetch books on mount
  useEffect(() => {
    booksAPI.getAll({ limit: 10 }).then((res) => setBooks(res.data.books)).catch(() => {});
  }, []);

  // Hero slider navigation
  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-rotate hero slider every 5s
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  // Horizontal scroll for best sellers slider
  const scrollSlider = (dir: 'left' | 'right') => {
    if (sliderRef.current) {
      const amount = 300;
      sliderRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Book Beacon | منصة كتب الثانوية العامة في مصر</title>
        <meta name="description" content="أفضل منصة لشراء كتب الثانوية العامة في مصر" />
      </Helmet>

      <style>{sliderScrollStyle}</style>

      {/* Hero Slider Section */}
      <section className="pt-28 pb-8">
        <div className="page-container">
          <div
            className="relative overflow-hidden rounded-card"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              minHeight: '380px',
            }}
          >
            {/* Decorative background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: 'var(--primary)' }} />
              <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full opacity-10" style={{ background: 'var(--accent)' }} />
            </div>

            {/* Animated book decoration */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-30 pointer-events-none">
              <AnimatedIcon src="/animations/book.json" size={160} />
            </div>

            {/* Slide content */}
            <div className="relative z-10 p-8 md:p-12 flex items-center" style={{ minHeight: '380px' }}>
              <div className="max-w-lg">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold mb-4"
                  style={{ background: 'rgba(78,231,243,0.15)', color: 'var(--accent)' }}
                >
                  {slides[slideIndex].badge}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                  {slides[slideIndex].title}
                </h2>
                <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
                  {slides[slideIndex].subtitle}
                </p>
                <Link to={slideIndex === 0 ? '/books?grade=تالتة+ثانوي' : '/books'} className="btn-cta text-base !py-3 !px-8">
                  {slides[slideIndex].cta} <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Slider arrows */}
            <button onClick={prevSlide} className="slider-arrow absolute right-4 top-1/2 -translate-y-1/2 z-20">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={nextSlide} className="slider-arrow absolute left-4 top-1/2 -translate-y-1/2 z-20">
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slider dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    background: i === slideIndex ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
                    width: i === slideIndex ? '24px' : '8px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers — Horizontal Scrollable Slider */}
      <section className="py-10">
        <div className="page-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title flex items-center gap-2">🔥 الأكثر مبيعاً</h2>
            <div className="flex gap-2">
              <button onClick={() => scrollSlider('left')} className="slider-arrow !w-9 !h-9">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => scrollSlider('right')} className="slider-arrow !w-9 !h-9">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="slider-track flex gap-4 overflow-x-auto pb-4"
          >
            {books.length > 0 ? books.map((book: any, i: number) => (
              <div key={book._id || i} className="flex-shrink-0" style={{ width: '250px' }}>
                <BookCard book={book} index={i} />
              </div>
            )) : (
              <p className="text-sm opacity-50 py-8">لا توجد كتب بعد</p>
            )}
          </div>
        </div>
      </section>

      {/* Grade Categories Grid */}
      <section className="py-10">
        <div className="page-container">
          <h2 className="section-title mb-6">تصفح حسب الصف الدراسي</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {grades.map((grade) => (
              <Link
                key={grade.name}
                to={`/books?grade=${grade.slug}`}
                className="card p-7 text-center block hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-lg font-bold mb-1">{grade.name}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  تصفح جميع كتب {grade.name}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-sm font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  تسوق الآن <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid — All Books */}
      <section className="py-10 pb-24">
        <div className="page-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title mb-1">الكتب</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                اختر من بين أفضل الكتب الدراسية
              </p>
            </div>
            <Link
              to="/books"
              className="hidden md:flex items-center gap-1 text-sm font-medium"
              style={{ color: 'var(--primary)' }}
            >
              عرض الكل <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {books.map((book: any, i: number) => (
              <BookCard key={book._id || i} book={book} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
