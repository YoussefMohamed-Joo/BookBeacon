import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Loader2, BookOpen } from 'lucide-react';
import { booksAPI } from '../lib/api';
import { formatPrice } from '../lib/utils';

// Global search bar — opens as an overlay dropdown in the navbar
export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced API call
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      booksAPI.getAll({ search: query, limit: 8 }).then((res) => {
        setResults(res.data.books || []);
      }).catch(() => {}).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  return (
    <div className="relative">
      {/* Search trigger button */}
      <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-white/5 transition-all">
        <Search className="w-5 h-5" />
      </button>

      {/* Overlay backdrop */}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      {/* Search dropdown panel */}
      {open && (
        <div className="fixed md:absolute top-0 md:top-full right-0 left-0 md:left-auto md:right-0 md:mt-2 z-50 md:w-[420px] bg-[var(--card-bg)] border-b md:border border-[var(--border)] md:rounded-2xl shadow-2xl">
          <div className="p-3">
            {/* Search input row */}
            <div className="relative" style={{ background: 'var(--input-bg)', borderRadius: '12px', border: '1.5px solid var(--border)' }}>
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن كتاب، مادة، أو مدرس..."
                className="w-full bg-transparent py-3 pr-10 pl-10 text-sm outline-none"
                style={{ color: 'var(--text)' }}
              />
              {query && (
                <button onClick={() => { setQuery(''); setResults([]); }} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--primary)' }} />
              </div>
            )}

            {/* Results list */}
            {!loading && results.length > 0 && (
              <div className="mt-2 max-h-[360px] overflow-y-auto space-y-1">
                {results.map((book: any) => (
                  <Link
                    key={book._id}
                    to={`/books/${book.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-10 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {book.image ? (
                        <img src={book.image} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <BookOpen className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{book.titleAr}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        {book.grade}{book.subject ? ` • ${book.subject}` : ''}{book.teacher ? ` • ${book.teacher}` : ''}
                      </p>
                    </div>
                    <span className="text-sm font-bold shrink-0" style={{ color: 'var(--primary)' }}>{formatPrice(book.price)}</span>
                  </Link>
                ))}

                {/* "View all" link */}
                <Link
                  to={`/books?search=${encodeURIComponent(query)}`}
                  onClick={() => setOpen(false)}
                  className="block text-center py-2.5 text-sm font-medium rounded-xl hover:bg-white/5 transition-all"
                  style={{ color: 'var(--primary)' }}
                >
                  عرض جميع النتائج ({results.length})
                </Link>
              </div>
            )}

            {/* Empty state */}
            {!loading && query && results.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>لا توجد نتائج لـ "{query}"</p>
              </div>
            )}

            {/* Initial hint */}
            {!query && !loading && (
              <div className="text-center py-6">
                <p className="text-xs" style={{ color: 'var(--muted)' }}>ابحث عن اسم الكتاب، المادة، أو المدرس</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
