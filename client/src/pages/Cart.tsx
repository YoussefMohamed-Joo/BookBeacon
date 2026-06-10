import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, AlertTriangle, Package, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatPrice } from '../lib/utils';

export default function Cart() {
  const { cart, updateCartQty, removeFromCart, clearCart } = useStore();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">سلة المشتريات</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{cart.length} كتاب في السلة</p>
          </div>
          <div className="flex items-center gap-3">
            {cart.length > 0 && (
              <button onClick={() => { clearCart(); }} className="text-xs flex items-center gap-1 px-3 py-2 rounded-lg" style={{ color: 'var(--danger)', background: 'rgba(255,107,107,0.1)' }}>
                <Trash2 className="w-3 h-3" /> تفريغ السلة
              </button>
            )}
            <Link to="/books" className="text-xs flex items-center gap-1 px-3 py-2 rounded-lg btn-secondary">
              <ArrowLeft className="w-3 h-3" /> متابعة التسوق
            </Link>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-20 h-20 mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-bold mb-2">السلة فارغة</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>لم تقم بإضافة أي كتب بعد</p>
            <Link to="/books" className="btn-primary">تصفح الكتب</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div key={item._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                    className="card p-4 flex items-center gap-4">
                    <Link to={`/books/${item.book.slug}`} className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {item.book.image ? (
                        <img src={item.book.image} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Package className="w-6 h-6 opacity-30" />
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/books/${item.book.slug}`} className="text-sm font-semibold hover:underline">{item.book.titleAr}</Link>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatPrice(item.book.price)} لكل وحدة</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateCartQty(item._id, item.quantity - 1)}
                        className="qty-btn !w-7 !h-7"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateCartQty(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.book.stock}
                        className="qty-btn !w-7 !h-7"><Plus className="w-3 h-3" /></button>
                    </div>
                    <div className="text-left min-w-[80px]">
                      <p className="text-sm font-bold">{formatPrice(item.book.price * item.quantity)}</p>
                    </div>
                    <button onClick={() => removeFromCart(item._id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all" style={{ color: 'var(--muted)' }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="card p-5 space-y-4 sticky top-24">
                <h3 className="font-bold">ملخص الطلب</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>عدد الكتب</span>
                    <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>سعر الكتب</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <hr style={{ borderColor: 'var(--border)' }} />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {useStore.getState().user ? (
                  <Link to={`/books/${cart[0]?.book.slug}`}
                    className="btn-primary w-full justify-center text-sm !py-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> إتمام الطلب
                  </Link>
                ) : (
                  <Link to="/login?redirect=/cart"
                    className="btn-primary w-full justify-center text-sm !py-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> تسجيل الدخول للطلب
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
