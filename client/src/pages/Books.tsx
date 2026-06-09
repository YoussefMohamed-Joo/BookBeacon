import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, BookOpen, GraduationCap, Filter } from 'lucide-react';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ScrollReveal from '../components/animations/ScrollReveal';
import { booksAPI } from '../lib/api';
import { GRADES } from '../lib/utils';

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [gradeFilter, setGradeFilter] = useState(searchParams.get('grade') || '');

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (search) params.search = search;
    if (gradeFilter) params.grade = gradeFilter;
    booksAPI.getAll(params).then((res) => {
      setBooks(res.data.books);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, gradeFilter]);

  const handleGradeChange = (grade: string) => {
    setGradeFilter(grade);
    const params = new URLSearchParams(searchParams);
    if (grade) params.set('grade', grade);
    else params.delete('grade');
    setSearchParams(params);
  };

  return (
    <>
      <Helmet>
        <title>جميع الكتب | Book Beacon - كتب الثانوية العامة</title>
        <meta name="description" content="تصفح جميع كتب الثانوية العامة في مصر. كتب أولى ثانوي، تانية ثانوي، تالتة ثانوي. أفضل الأسعار والتوصيل لكل مصر." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        {/* Header */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-dark-800/30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/5 rounded-full blur-[100px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/20">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold gradient-text">جميع الكتب</h1>
                  <p className="text-gray-500 dark:text-gray-400">تصفح جميع كتب الثانوية العامة المتاحة</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن اسم الكتاب أو المادة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pr-12 rounded-2xl border-gray-200 dark:border-dark-700 focus:ring-primary-500/30"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['', ...GRADES].map((g) => (
                <button
                  key={g || 'all'}
                  onClick={() => handleGradeChange(g)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    gradeFilter === g
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-gray-100 dark:bg-dark-700/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600 border border-transparent'
                  }`}
                >
                  {g || 'الكل'}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="py-20"><LoadingSpinner size="lg" /></div>
          ) : books.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-50 dark:bg-dark-800 flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-400 mb-1">لا توجد كتب متاحة</p>
              <p className="text-sm text-gray-400">حاول تغيير معايير البحث</p>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">{books.length} نتيجة</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book: any, i: number) => (
                  <ScrollReveal key={book._id} delay={i * 0.03}>
                    <BookCard book={book} index={i} />
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
