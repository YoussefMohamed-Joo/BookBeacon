import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Truck, Shield, Check, MessageCircle, BookOpen, ArrowLeft, Minus, Plus, CreditCard, Image, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ScrollReveal from '../components/animations/ScrollReveal';
import { useStore } from '../store/useStore';
import { booksAPI, ordersAPI, reviewsAPI, deliveryAPI } from '../lib/api';
import { formatPrice, getGradeColor } from '../lib/utils';

export default function BookDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryPrices, setDeliveryPrices] = useState<any[]>([]);
  const [selectedGov, setSelectedGov] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      booksAPI.getBySlug(slug).then((res) => { setBook(res.data); setLoading(false); }).catch(() => navigate('/books'));
      deliveryAPI.getAll().then((res) => setDeliveryPrices(res.data)).catch(() => {});
    }
  }, [slug]);

  useEffect(() => {
    if (book) reviewsAPI.getByBook(book._id).then((res) => setReviews(res.data)).catch(() => {});
  }, [book]);

  useEffect(() => {
    if (selectedGov && deliveryPrices.length > 0) {
      const found = deliveryPrices.find((d) => d.governorate === selectedGov);
      setDeliveryPrice(found?.price || 0);
    }
  }, [selectedGov, deliveryPrices]);

  if (loading) return <div className="pt-24"><LoadingSpinner size="lg" /></div>;
  if (!book) return null;

  const totalPrice = book.price * quantity + (deliveryMethod === 'delivery' ? deliveryPrice : 0);

  const handleOrder = async () => {
    if (!user) { toast.error('يرجى تسجيل الدخول أولاً'); navigate('/login'); return; }
    if (!user.isVerified) { toast.error('يرجى التحقق من البريد الإلكتروني أولاً'); navigate('/login'); return; }
    if (deliveryMethod === 'delivery' && (!address || !phone || !selectedGov)) { toast.error('يرجى إكمال بيانات التوصيل'); return; }

    setOrderLoading(true);
    try {
      const orderData: any = { bookId: book._id, grade: book.grade, subject: book.subject, quantity, deliveryMethod };
      if (deliveryMethod === 'delivery') {
        orderData.deliveryDetails = { governorate: selectedGov, center, address, phone, whatsapp, deliveryPrice };
      }
      const order = await ordersAPI.create(orderData);
      if (paymentFile) {
        const fd = new FormData();
        fd.append('paymentProof', paymentFile);
        fd.append('senderPhone', senderPhone);
        await ordersAPI.uploadPayment(order.data._id, fd);
      }
      toast.success('تم إنشاء الطلب بنجاح!');
      navigate('/orders');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'حدث خطأ');
    } finally { setOrderLoading(false); }
  };

  return (
    <>
      <Helmet>
        <title>{book.metaTitle || `${book.titleAr} | Book Beacon`}</title>
        <meta name="description" content={book.metaDescription || book.descriptionAr} />
        <meta name="keywords" content={book.keywords} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Product', name: book.titleAr,
          description: book.descriptionAr, offers: { '@type': 'Offer', price: book.price, priceCurrency: 'EGP', availability: book.stock > 0 ? 'InStock' : 'OutOfStock' }
        })}</script>
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link to="/books" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-500 transition-colors">
              <ArrowLeft className="w-4 h-4" /> العودة إلى الكتب
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Book Image */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="sticky top-24">
                <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-primary-50 via-primary-100/30 to-purple-50 dark:from-dark-800 dark:via-dark-800/50 dark:to-dark-700 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-dark-700 shadow-xl">
                  {book.image ? (
                    <img src={book.image} alt={book.titleAr} className="w-full h-full object-contain p-10 hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="text-center">
                      <BookOpen className="w-20 h-20 text-primary-200 dark:text-primary-700 mx-auto mb-2" />
                      <span className="text-6xl font-bold text-primary-200 dark:text-primary-700 block">{book.titleAr.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Book Info */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(book.grade)}`}>{book.grade}</span>
                {book.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
                    <Check className="w-3 h-3" /> متوفر
                  </span>
                ) : (
                  <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full">غير متوفر</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.titleAr}</h1>
              <p className="text-lg text-gray-400 dark:text-gray-500 mb-1">{book.subject}</p>
              {book.teacher && <p className="text-primary-500 font-medium mb-6">تدريس {book.teacher}</p>}

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= Math.round(book.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-dark-600'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-400">({book.numReviews} تقييم)</span>
                <span className="text-sm text-gray-300">|</span>
                <span className="text-sm text-gray-400">{book.salesCount} مبيعات</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold gradient-text">{formatPrice(book.price)}</div>
                <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl font-medium">
                  مقدم {formatPrice(book.deposit || Math.round(book.price * 0.1))}
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed text-base">{book.descriptionAr}</p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {[
                  { icon: Truck, text: 'توصيل لكل مصر' },
                  { icon: Shield, text: 'دفع آمن' },
                  { icon: MessageCircle, text: 'دعم واتساب' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-dark-800/50 border border-gray-100 dark:border-dark-700">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary-500" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>
                  </div>
                ))}
              </div>

              {/* Order Form */}
              <div className="bg-white dark:bg-dark-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-dark-700/50 space-y-5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  اطلب الآن
                </h3>

                {/* Delivery Method */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">طريقة الاستلام</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'pickup' as const, label: 'استلام يد بيد', desc: 'عربون ١٠ ج', icon: Check },
                      { value: 'delivery' as const, label: 'توصيل', desc: 'لكل المحافظات', icon: Truck },
                    ].map(({ value, label, desc, icon: Icon }) => (
                      <button key={value}
                        onClick={() => setDeliveryMethod(value)}
                        className={`relative p-3 rounded-2xl text-right border-2 transition-all ${
                          deliveryMethod === value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-sm'
                            : 'border-gray-100 dark:border-dark-700 hover:border-gray-200'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${deliveryMethod === value ? 'text-primary-500' : 'text-gray-400'}`} />
                        <div className={`text-sm font-semibold ${deliveryMethod === value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>{label}</div>
                        <div className="text-xs text-gray-400">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Details */}
                {deliveryMethod === 'delivery' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                    <select value={selectedGov} onChange={(e) => setSelectedGov(e.target.value)} className="input-field rounded-2xl">
                      <option value="">اختر المحافظة</option>
                      {deliveryPrices.map((dp) => (<option key={dp._id} value={dp.governorate}>{dp.governorate} — {formatPrice(dp.price)}</option>))}
                    </select>
                    <input type="text" placeholder="المركز / الحي" value={center} onChange={(e) => setCenter(e.target.value)} className="input-field rounded-2xl" />
                    <input type="text" placeholder="العنوان بالتفصيل" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field rounded-2xl" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pr-10 rounded-2xl" dir="ltr" />
                      </div>
                      <input type="text" placeholder="واتساب (اختياري)" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="input-field rounded-2xl" dir="ltr" />
                    </div>
                  </motion.div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">الكمية</label>
                  <div className="inline-flex items-center gap-3 bg-gray-50 dark:bg-dark-700 rounded-2xl p-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-white dark:bg-dark-600 flex items-center justify-center shadow-sm hover:shadow transition-all">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold w-10 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(book.stock, quantity + 1))} className="w-10 h-10 rounded-xl bg-white dark:bg-dark-600 flex items-center justify-center shadow-sm hover:shadow transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 dark:bg-dark-700/50 rounded-2xl p-5 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">سعر الكتاب</span><span>{formatPrice(book.price * quantity)}</span></div>
                  {deliveryMethod === 'delivery' && <div className="flex justify-between text-sm"><span className="text-gray-500">التوصيل</span><span>{formatPrice(deliveryPrice)}</span></div>}
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-dark-600 pt-3 mt-2">
                    <span>الإجمالي</span>
                    <span className="text-primary-500">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 mt-1 border-t border-dashed border-gray-200 dark:border-dark-600">
                    <span className="text-amber-600 font-medium">المطلوب دفعه</span>
                    <span className="text-lg font-bold text-amber-500">
                      {deliveryMethod === 'pickup' ? formatPrice(book.deposit || 10) : formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-amber-50/80 dark:bg-amber-900/10 rounded-2xl p-5 border border-amber-200/50 dark:border-amber-800/30 space-y-3">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm mb-1">
                        {deliveryMethod === 'pickup'
                          ? `حول عربون ${formatPrice(book.deposit || 10)}`
                          : `حول ${formatPrice(totalPrice)}`}
                      </p>
                      <p className="text-sm text-gray-500">فودافون كاش: <span className="font-bold text-gray-800 dark:text-gray-200" dir="ltr">01033558125</span></p>
                      <p className="text-xs text-gray-400">صاحب الحساب: Book Beacon</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="رقم هاتف المرسل" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} className="input-field pr-10 rounded-2xl" dir="ltr" />
                  </div>
                  <div className="relative">
                    <Image className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input type="file" onChange={(e) => e.target.files?.[0] && setPaymentFile(e.target.files[0])}
                      className="input-field pr-10 rounded-2xl file:mr-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 dark:file:bg-primary-900/20 file:text-primary-600 file:text-xs file:font-medium"
                      accept="image/*"
                    />
                  </div>
                  {paymentFile && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-600 text-xs flex items-center gap-1">
                      <Check className="w-3 h-3" /> تم اختيار الملف: {paymentFile.name}
                    </motion.p>
                  )}
                </div>

                <motion.button onClick={handleOrder} disabled={orderLoading}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-500 text-white font-bold text-base shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-70"
                >
                  {orderLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري إنشاء الطلب...
                    </span>
                  ) : 'تأكيد الطلب'}
                </motion.button>
              </div>

              {/* Reviews */}
              {reviews.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
                  <h3 className="text-lg font-bold mb-5">التقييمات ({reviews.length})</h3>
                  <div className="space-y-3">
                    {reviews.map((r: any) => (
                      <div key={r._id} className="p-4 rounded-2xl bg-white dark:bg-dark-800/50 border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                            {r.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium text-sm block">{r.user?.name}</span>
                            <div className="flex gap-0.5 mt-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-dark-600'}`} />))}
                            </div>
                          </div>
                        </div>
                        {r.comment && <p className="text-sm text-gray-500 dark:text-gray-400 pr-12">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
