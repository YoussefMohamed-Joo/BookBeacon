import { Link } from 'react-router-dom';
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
      <div className="aspect-[4/3] flex items-center justify-center p-6" style={{ background: 'var(--soft)' }}>
        {book.image ? (
          <img src={book.image} alt={book.titleAr} className="w-full h-full object-contain" />
        ) : (
          <span className="text-3xl font-bold" style={{ color: 'var(--muted)' }}>{book.titleAr.charAt(0)}</span>
        )}
      </div>

      <div className="p-4 flex flex-col" style={{ minHeight: '160px' }}>
        <div className="flex-1">
          <h3 className="font-semibold mb-0.5 line-clamp-1" style={{ color: 'var(--text-primary)' }}>{book.titleAr}</h3>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{book.subject}</p>
          {book.grade && (
            <span className="text-[11px] px-2 py-0.5 rounded-full mt-1.5 inline-block" style={{ background: 'var(--soft)', color: 'var(--muted)' }}>
              {book.grade}
            </span>
          )}
        </div>

        <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{formatPrice(book.price)}</span>
            <span className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all" style={{ background: 'var(--soft)', color: 'var(--primary)' }}>
              أضف للسلة
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
