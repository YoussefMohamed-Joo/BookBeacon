import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { formatPrice } from '../lib/utils';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    titleAr: string;
    slug: string;
    grade: string;
    subject: string;
    teacher: string;
    price: number;
    deposit: number;
    image: string;
    rating: number;
    numReviews: number;
    salesCount: number;
    stock?: number;
  };
  index?: number;
}

export default function BookCard({ book }: BookCardProps) {
  // Local quantity state for +/- buttons (default 1)
  const [qty, setQty] = useState(1);
  const outOfStock = (book.stock ?? 10) <= 0;

  return (
    <Link to={`/books/${book.slug}`} className="card overflow-hidden block group">
      {/* Book image container */}
      <div className="aspect-[4/3] flex items-center justify-center p-5 relative" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {book.image ? (
          <img src={book.image} alt={book.titleAr} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
        ) : (
          // Fallback: first letter of Arabic title
          <span className="text-2xl font-bold" style={{ color: 'var(--muted)' }}>{book.titleAr?.charAt(0)}</span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: 'var(--danger)', color: 'white' }}>غير متوفر</span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-semibold mb-0.5 text-sm line-clamp-1">{book.titleAr}</h3>
        {book.teacher && <p className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>{book.teacher}</p>}
        <span className="badge mb-2" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>{book.grade || book.subject}</span>

        {/* Price + Quantity selector */}
        <div className="flex items-center justify-between pt-3 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="font-bold text-sm">{formatPrice(book.price)}</span>

          {!outOfStock && (
            <div className="flex items-center gap-1.5">
              <button onClick={(e) => { e.preventDefault(); setQty(Math.max(1, qty - 1)); }}
                className="qty-btn !w-7 !h-7"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-semibold min-w-[20px] text-center">{qty}</span>
              <button onClick={(e) => { e.preventDefault(); setQty(qty + 1); }}
                className="qty-btn !w-7 !h-7"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Add to cart button */}
        {!outOfStock && (
          <button onClick={(e) => { e.preventDefault(); }}
            className="w-full mt-2 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            style={{ background: 'var(--primary)', color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#007A83'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
          >
            <ShoppingCart className="w-3.5 h-3.5" /> أضف للسلة
          </button>
        )}
      </div>
    </Link>
  );
}
