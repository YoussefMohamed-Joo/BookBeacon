import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
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
  };
  index?: number;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link to={`/books/${book.slug}`} className="card overflow-hidden block hover:-translate-y-0.5 transition-all duration-200">
      <div className="aspect-[4/3] flex items-center justify-center p-5" style={{ background: 'var(--soft)' }}>
        {book.image ? (
          <img src={book.image} alt={book.titleAr} className="w-full h-full object-contain" />
        ) : (
          <span className="text-2xl font-bold" style={{ color: 'var(--muted)' }}>{book.titleAr?.charAt(0)}</span>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-semibold mb-0.5 text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>{book.titleAr}</h3>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>{book.subject}</p>

        {book.rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5 mb-2">
            <Star className="w-3 h-3 fill-[var(--accent)]" style={{ color: 'var(--accent)' }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{book.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2.5 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{formatPrice(book.price)}</span>
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all" style={{ background: 'var(--accent)', color: 'white' }}>
            أضف للسلة
          </span>
        </div>
      </div>
    </Link>
  );
}
