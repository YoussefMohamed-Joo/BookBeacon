import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Eye } from 'lucide-react';
import { formatPrice, getGradeColor } from '../lib/utils';

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

export default function BookCard({ book, index = 0 }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/books/${book.slug}`} className="group block card overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
        <div className="relative h-52 bg-gradient-to-br from-primary-50 via-primary-100/50 to-primary-100 dark:from-dark-700 dark:via-dark-800 dark:to-dark-700 flex items-center justify-center overflow-hidden">
          {book.image ? (
            <img src={book.image} alt={book.titleAr} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out" />
          ) : (
            <div className="text-5xl font-bold text-primary-200 dark:text-primary-700">{book.titleAr.charAt(0)}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-2xl p-2.5 shadow-xl">
                <Eye className="w-5 h-5 text-primary-500" />
              </div>
            </div>
          </div>

          {/* Grade badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${getGradeColor(book.grade)}`}>
              {book.grade}
            </span>
          </div>

          {/* Sales badge */}
          {book.salesCount > 0 && (
            <div className="absolute top-3 left-3">
              <span className="text-[11px] px-2 py-1 rounded-full bg-white/70 dark:bg-dark-800/70 backdrop-blur-sm text-gray-600 dark:text-gray-300 font-medium">
                {book.salesCount} مبيعات
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-0.5 line-clamp-1 group-hover:text-primary-500 transition-colors">{book.titleAr}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{book.subject}</p>
          {book.teacher && <p className="text-xs text-primary-400 mb-3">تدريس {book.teacher}</p>}

          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-3 h-3 ${star <= Math.round(book.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-dark-600'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {book.rating > 0 ? book.rating.toFixed(1) : 'جديد'}
              {book.numReviews > 0 && ` (${book.numReviews})`}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-dark-700">
            <div>
              <span className="text-lg font-bold gradient-text">{formatPrice(book.price)}</span>
              <p className="text-[10px] text-gray-400">مقدم {formatPrice(book.deposit || Math.round(book.price * 0.1))}</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium">
              التفاصيل
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
