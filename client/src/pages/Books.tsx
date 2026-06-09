import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, BookOpen, GraduationCap, X, ChevronDown } from 'lucide-react';
import BookCard from '../components/BookCard';
import AnimatedIcon from '../components/animations/AnimatedIcon';
import { booksAPI } from '../lib/api';
import { GRADES } from '../lib/utils';

// Subjects available for filtering
const SUBJECTS = [
  'اللغة العربية', 'اللغة الإنجليزية', 'اللغة الفرنسية', 'الرياضيات',
  'التاريخ', 'الجغرافيا', 'الفلسفة', 'علم النفس', 'الفيزياء',
  'الكيمياء', 'الأحياء', 'الجيولوجيا',
];

// Sorting options
const SORT_OPTIONS = [
  { value: '', label: 'الأحدث' },
  { value: 'price_asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price_desc', label: 'السعر: من الأعلى للأقل' },
  { value: 'sales', label: 'الأكثر مبيعاً' },
  { value: 'rating', label: 'الأعلى تقييماً' },
];

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [gradeFilter, setGradeFilter] = useState(searchParams.get('grade') || '');
  const [subjectFilter, setSubjectFilter] = useState(searchParams.get('subject') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync URL params to state on mount
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setGradeFilter(searchParams.get('grade') || '');
    setSubjectFilter(searchParams.get('subject') || '');
    setSortBy(searchParams.get('sort') || '');
  }, [searchParams]);

  // Fetch books whenever filters change
  useEffect(() => {
    setLoading(true);
    const params: any = { limit: 50 };
    if (search) params.search = search;
    if (gradeFilter) params.grade = gradeFilter;
    if (subjectFilter) params.subject = subjectFilter;
    if (sortBy) params.sort = sortBy;
    booksAPI.getAll(params).then((res) => {
      setBooks(res.data.books || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, gradeFilter, subjectFilter, sortBy]);

  // Debounced search input -> URL params
  const handleSearchInput = (val: string) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const p = new URLSearchParams(searchParams);
      if (val) p.set('search', val); else p.delete('search');
      setSearchParams(p);
    }, 400);
  };

  // Update URL when a filter changes
  const applyFilter = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    setSearchParams(p);
  };

  // Clear all filters
  const clearAll = () => {
    setSearch('');
    setGradeFilter('');
    setSubjectFilter('');
    setSortBy('');
    setSearchParams({});
  };

  const hasActiveFilters = gradeFilter || subjectFilter || sortBy;

  return (
    <>
      <Helmet>
        <title>جميع الكتب | Book Beacon</title>
        <meta name="description" content="تصفح جميع كتب الثانوية العامة. بحث وفلترة حسب الصف الدراسي والمادة." />
      </Helmet>

      <div className="min-h-screen pt-28 pb-16">
        <div className="page-container">

          {/* Header */}
          <div className="mb-6">
            <h1 className="section-title flex items-center gap-3">
              <BookOpen className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              جميع الكتب
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {loading ? 'جاري التحميل...' : `تم العثور على ${books.length} كتاب`}
            </p>
          </div>

          {/* ===== Search & Filters Bar ===== */}
          <div className="card p-4 mb-6">
            {/* Search row */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="ابحث عن اسم الكتاب، المادة، أو المدرس..."
                className="w-full py-3 pr-11 pl-4 rounded-xl text-sm outline-none"
                style={{ background: 'var(--input-bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
              />
              {search && (
                <button onClick={() => { setSearch(''); applyFilter('search', ''); }} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter chips row */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* Grade filter */}
              <div className="relative">
                <select
                  value={gradeFilter}
                  onChange={(e) => applyFilter('grade', e.target.value)}
                  className="appearance-none px-3 py-2 rounded-lg text-xs font-medium outline-none cursor-pointer"
                  style={{ background: gradeFilter ? 'var(--primary)' : 'var(--input-bg)', color: gradeFilter ? 'white' : 'var(--text)', border: '1px solid var(--border)', paddingLeft: '28px' }}
                >
                  <option value="">كل الصفوف</option>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: gradeFilter ? 'white' : 'var(--muted)' }} />
              </div>

              {/* Subject filter */}
              <div className="relative">
                <select
                  value={subjectFilter}
                  onChange={(e) => applyFilter('subject', e.target.value)}
                  className="appearance-none px-3 py-2 rounded-lg text-xs font-medium outline-none cursor-pointer"
                  style={{ background: subjectFilter ? 'var(--primary)' : 'var(--input-bg)', color: subjectFilter ? 'white' : 'var(--text)', border: '1px solid var(--border)', paddingLeft: '28px' }}
                >
                  <option value="">كل المواد</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: subjectFilter ? 'white' : 'var(--muted)' }} />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => applyFilter('sort', e.target.value)}
                  className="appearance-none px-3 py-2 rounded-lg text-xs font-medium outline-none cursor-pointer"
                  style={{ background: sortBy ? 'var(--primary)' : 'var(--input-bg)', color: sortBy ? 'white' : 'var(--text)', border: '1px solid var(--border)', paddingLeft: '28px' }}
                >
                  <option value="">ترتيب</option>
                  {SORT_OPTIONS.filter(o => o.value).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: sortBy ? 'white' : 'var(--muted)' }} />
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button onClick={clearAll} className="px-3 py-2 rounded-lg text-xs font-medium transition-all" style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--danger)' }}>
                  <X className="w-3 h-3 inline ml-1" />مسح
                </button>
              )}
            </div>
          </div>

          {/* ===== Results ===== */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <AnimatedIcon src="/animations/loading.json" size={64} className="mx-auto" />
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-20">
              <AnimatedIcon src="/animations/empty.json" size={120} className="mx-auto mb-4" />

              <h3 className="text-lg font-semibold mb-1">لا توجد كتب متاحة</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>حاول تغيير معايير البحث أو إزالة الفلاتر</p>
              {hasActiveFilters && (
                <button onClick={clearAll} className="btn-secondary text-sm">مسح جميع الفلاتر</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {books.map((book: any, i: number) => (
                <BookCard key={book._id} book={book} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
