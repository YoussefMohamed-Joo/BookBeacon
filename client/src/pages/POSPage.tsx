import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus, Trash2, Scan, Zap, ShoppingCart, CreditCard, DollarSign, Percent, CheckCircle, AlertTriangle, Package, User, Minus as Dash, Loader2 } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { booksAPI, ordersAPI } from '../lib/api';
import BarcodeScanner from '../components/BarcodeScanner';
import toast from 'react-hot-toast';

interface CartItem {
  _id: string;
  book: any;
  quantity: number;
}

export default function POSPage({ onBack }: { onBack?: () => void }) {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [submitting, setSubmitting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [todaySales, setTodaySales] = useState<any[]>([]);
  const [showTodaySales, setShowTodaySales] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    booksAPI.getAll({ limit: 500 }).then(res => {
      const all = res.data.books.filter((b: any) => b.isActive !== false && (b.stock - (b.reservedQuantity || 0)) > 0);
      setBooks(all);
      setFilteredBooks(all.slice(0, 30));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredBooks(books.slice(0, 30));
      return;
    }
    const q = search.toLowerCase();
    const results = books.filter(b =>
      b.titleAr?.toLowerCase().includes(q) ||
      b.title?.toLowerCase().includes(q) ||
      b.barcode?.includes(q) ||
      b.subject?.toLowerCase().includes(q) ||
      b.teacher?.toLowerCase().includes(q)
    );
    setFilteredBooks(results.slice(0, 50));
  }, [search, books]);

  const subtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const total = Math.max(0, subtotal - discountAmount);
  const dueAmount = total - paidAmount;

  useEffect(() => {
    if (cart.length > 0 && paidAmount === 0) setPaidAmount(total);
  }, [cart.length, total]);

  const addToCart = useCallback((book: any) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === book._id);
      if (existing) {
        const maxQty = book.stock - (book.reservedQuantity || 0);
        if (existing.quantity >= maxQty) {
          toast.error('الكمية المتاحة غير كافية');
          return prev;
        }
        return prev.map(item =>
          item._id === book._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { _id: book._id, book, quantity: 1 }];
    });
    toast.success(`تمت إضافة ${book.titleAr}`);
  }, []);

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item._id !== id) return item;
      const book = books.find(b => b._id === id);
      const maxQty = book ? book.stock - (book.reservedQuantity || 0) : 99;
      const newQty = Math.max(1, Math.min(item.quantity + delta, maxQty));
      return { ...item, quantity: newQty };
    }));
  };

  const removeFromCart = (id: string) => {
    const item = cart.find(i => i._id === id);
    setCart(prev => prev.filter(i => i._id !== id));
    if (item) toast(`${item.book.titleAr} تمت الإزالة`, { icon: '🗑️' });
  };

  const handleScan = async (barcode: string) => {
    try {
      const res = await booksAPI.lookupBarcode(barcode);
      addToCart(res.data);
    } catch {
      toast.error('لم يتم العثور على كتاب بهذا الباركود');
    }
    setShowScanner(false);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) { toast.error('السلة فارغة'); return; }
    if (discountPercent < 0 || discountPercent > 100) { toast.error('نسبة الخصم يجب أن تكون بين 0 و 100'); return; }
    setSubmitting(true);
    try {
      await Promise.all(cart.map(item =>
        ordersAPI.createInstantSale({
          bookId: item._id,
          quantity: item.quantity,
          customerName: customerName || undefined,
          paidAmount: paidAmount > 0 ? Math.min(paidAmount, item.book.price * item.quantity) : undefined,
        })
      ));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setCart([]);
      setCustomerName('');
      setDiscountPercent(0);
      setPaidAmount(0);
      setSearch('');
      searchRef.current?.focus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء البيع');
    }
    setSubmitting(false);
  };

  const availableStock = (book: any) => book.stock - (book.reservedQuantity || 0);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-500 transition-all px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              رجوع
            </button>
          )}
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-500" />
            <h1 className="font-bold text-lg">البيع الفوري</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Package className="w-3 h-3" />{books.length} كتاب</span>
        </div>
      </div>
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-lg font-bold">
            <CheckCircle className="w-6 h-6" /> تم البيع بنجاح
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* ===================== LEFT PANEL: Products ===================== */}
        <div className="w-[320px] xl:w-[360px] bg-white dark:bg-dark-900 border-l border-gray-100 dark:border-dark-800 flex flex-col">
          <div className="p-3 border-b border-gray-100 dark:border-dark-800 space-y-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input ref={searchRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن كتاب..."
                className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
              {search && <button onClick={() => setSearch('')} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowScanner(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-all">
                <Scan className="w-4 h-4" /> مسح باركود
              </button>
            </div>
          </div>
          <AnimatePresence>
            {showScanner && (
              <div className="p-3 border-b border-gray-100 dark:border-dark-800">
                <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
              </div>
            )}
          </AnimatePresence>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredBooks.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">لا توجد نتائج</div>
            )}
            {filteredBooks.map(book => {
              const stock = availableStock(book);
              return (
                <motion.button key={book._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => addToCart(book)}
                  disabled={stock < 1}
                  className={`w-full text-right p-2.5 rounded-xl transition-all flex items-center gap-3 ${
                    stock < 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-dark-800 active:scale-[0.98]'
                  }`}>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center shrink-0">
                    {book.image ? (
                      <img src={book.image} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{book.titleAr}</p>
                    <p className="text-[11px] text-gray-400">{book.subject} • {book.grade}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-sm font-bold text-primary-500">{formatPrice(book.price)}</p>
                    <p className={`text-[10px] ${stock <= 3 ? 'text-red-500' : 'text-gray-400'}`}>
                      {stock <= 3 ? `${stock} فقط` : `${stock} متاح`}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ===================== CENTER PANEL: Cart ===================== */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-dark-950">
          <div className="p-4 border-b border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-500" />
                <h2 className="font-bold text-lg">السلة</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 font-medium">{cart.length}</span>
              </div>
              {cart.length > 0 && (
                <button onClick={() => { setCart([]); toast('تم تفريغ السلة', { icon: '🗑️' }); }}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> تفريغ
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingCart className="w-16 h-16 mb-3 opacity-30" />
                <p className="text-sm">السلة فارغة</p>
                <p className="text-xs">اختر كتباً من القائمة أو امسح باركود</p>
              </div>
            )}
            <AnimatePresence>
              {cart.map(item => {
                const stock = availableStock(item.book);
                return (
                  <motion.div key={item._id} layout initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                    className="bg-white dark:bg-dark-900 rounded-xl p-3 border border-gray-100 dark:border-dark-800 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.book.titleAr}</p>
                        <p className="text-[11px] text-gray-400">{formatPrice(item.book.price)} لكل وحدة</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQty(item._id, -1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-800 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500 transition-all">
                          <Dash className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQty(item._id, 1)}
                          disabled={item.quantity >= stock}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            item.quantity >= stock
                              ? 'bg-gray-50 dark:bg-dark-800 text-gray-300 cursor-not-allowed'
                              : 'bg-gray-100 dark:bg-dark-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 hover:text-emerald-500'
                          }`}>
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-left min-w-[80px]">
                        <p className="text-sm font-bold">{formatPrice(item.book.price * item.quantity)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {item.quantity >= stock && (
                      <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> الحد الأقصى للمخزون
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ===================== RIGHT PANEL: Checkout ===================== */}
        <div className="w-[320px] xl:w-[360px] bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-dark-800 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-dark-800">
            <h2 className="font-bold text-lg">إتمام البيع</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white text-center">
              <p className="text-xs opacity-80 mb-1">الإجمالي</p>
              <p className="text-3xl font-bold">{formatPrice(total)}</p>
              {discountPercent > 0 && (
                <p className="text-xs opacity-80 mt-1">بعد خصم {discountPercent}%</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">اسم العميل (اختياري)</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                  placeholder="مثال: أحمد علي"
                  className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">نسبة الخصم %</label>
              <div className="relative">
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
              </div>
              {discountPercent > 0 && (
                <p className="text-xs text-emerald-500 mt-1">الخصم: {formatPrice(discountAmount)}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">المبلغ المدفوع</label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="number" min="0" value={paidAmount} onChange={e => setPaidAmount(Number(e.target.value))}
                  className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
              </div>
              {paidAmount < total && cart.length > 0 && (
                <p className="text-xs text-amber-500 mt-1">المتبقي: {formatPrice(dueAmount)}</p>
              )}
              {paidAmount >= total && cart.length > 0 && (
                <p className="text-xs text-emerald-500 mt-1">تم دفع كامل المبلغ ✓</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">طريقة الدفع</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-700'
                  }`}>
                  <DollarSign className="w-4 h-4" /> نقداً
                </button>
                <button onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-700'
                  }`}>
                  <CreditCard className="w-4 h-4" /> كارت
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-dark-800 space-y-2">
            <button onClick={handleSubmit} disabled={cart.length === 0 || submitting}
              className={`w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                cart.length === 0 || submitting
                  ? 'bg-gray-200 dark:bg-dark-800 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 active:scale-[0.98]'
              }`}>
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {submitting ? 'جاري البيع...' : 'إتمام البيع'}
            </button>
            <div className="flex items-center justify-center gap-3 text-[10px] text-gray-400">
              <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-800 font-mono">Enter</kbd> بيع</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-800 font-mono">+</kbd> زيادة</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-800 font-mono">-</kbd> نقص</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-800 font-mono">Esc</kbd> إلغاء</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
