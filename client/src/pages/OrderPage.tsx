import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Store, MapPin, User, Phone, Hash, Image, Check, ArrowLeft, CreditCard, Upload, BookOpen, Package, X, Search, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { booksAPI, ordersAPI, deliveryAPI } from '../lib/api';
import { formatPrice, EGYPTIAN_GOVERNORATES } from '../lib/utils';
import LoadingSpinner from '../components/LoadingSpinner';

type DeliveryType = 'shipping' | 'pickup' | 'delivery';
type PaymentType = 'full' | 'deposit';

interface DeliveryPrice {
  _id: string;
  governorate: string;
  price: number;
}

interface BookData {
  _id: string;
  titleAr: string;
  price: number;
  image?: string;
  stock: number;
  grade: string;
  subject: string;
}

const ARABIC_ONLY = /^[\u0600-\u06FF\s]+$/;
const PHONE_ONLY = /^[\d]+$/;

const stepIcons = [Truck, User, CreditCard];
const stepLabels = ['النوع', 'البيانات', 'الدفع'];

const typeCards = [
  { type: 'shipping' as DeliveryType, icon: Truck, title: 'شحن لكل المحافظات', subtitle: 'الدفع كامل + مصاريف الشحن', gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
  { type: 'pickup' as DeliveryType, icon: Store, title: 'استلام من المنفذ', subtitle: 'دفع 10% فقط كعربون', gradient: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20' },
  { type: 'delivery' as DeliveryType, icon: MapPin, title: 'دليفري داخل المحافظة', subtitle: 'دفع كامل أو عربون', gradient: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/20' },
];

export default function OrderPage() {
  const { bookId: paramBookId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStore();
  const stateBookId = (location.state as any)?.bookId;
  const bookId = paramBookId || stateBookId || '';

  const [step, setStep] = useState(0);
  const [deliveryType, setDeliveryType] = useState<DeliveryType | null>(null);
  const [book, setBook] = useState<BookData | null>(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [deliveryPrices, setDeliveryPrices] = useState<DeliveryPrice[]>([]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [center, setCenter] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentType>('full');

  const [senderPhone, setSenderPhone] = useState('');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const [govSearch, setGovSearch] = useState('');
  const [govOpen, setGovOpen] = useState(false);
  const govRef = useRef<HTMLDivElement>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Pre-fill user data from profile
  useEffect(() => {
    if (user) { setName(user.name); setPhone(user.phone); }
  }, [user]);

  useEffect(() => {
    if (bookId) {
      booksAPI.getById(bookId).then((res) => { setBook(res.data); setBookLoading(false); }).catch(() => { toast.error('الكتاب غير موجود'); navigate('/books'); });
    } else {
      setBookLoading(false);
      toast.error('لم يتم تحديد كتاب');
      navigate('/books');
    }
    deliveryAPI.getAll().then((res) => setDeliveryPrices(res.data)).catch(() => {});
  }, [bookId]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (govRef.current && !govRef.current.contains(e.target as Node)) setGovOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredGovernorates = deliveryPrices.filter((dp) =>
    dp.governorate.includes(govSearch)
  );

  const shippingPrice = governorate
    ? deliveryPrices.find((dp) => dp.governorate === governorate)?.price || 0
    : 0;

  const bookTotal = book ? book.price * quantity : 0;

  const getTotal = () => {
    if (!deliveryType || !book) return 0;
    if (deliveryType === 'shipping') return bookTotal + shippingPrice;
    return bookTotal;
  };

  const getDeposit = () => {
    if (!book) return 0;
    return Math.round(book.price * quantity * 0.1);
  };

  const getRequiredPayment = () => {
    if (!deliveryType || !book) return 0;
    if (deliveryType === 'shipping') return getTotal();
    if (deliveryType === 'pickup') return getDeposit();
    return paymentType === 'full' ? getTotal() : getDeposit();
  };

  const validateStep1 = () => deliveryType !== null;

  const validateStep2 = () => {
    if (!name || !ARABIC_ONLY.test(name)) { toast.error('الاسم يجب أن يكون باللغة العربية'); return false; }
    if (!phone || !PHONE_ONLY.test(phone)) { toast.error('رقم الهاتف غير صحيح'); return false; }
    if (deliveryType === 'shipping') {
      if (!altPhone || !PHONE_ONLY.test(altPhone)) { toast.error('رقم الهاتف البديل مطلوب'); return false; }
      if (!governorate) { toast.error('يرجى اختيار المحافظة'); return false; }
      if (!center) { toast.error('يرجى إدخال المركز'); return false; }
      if (!address) { toast.error('يرجى إدخال العنوان'); return false; }
    }
    if (deliveryType === 'delivery') {
      if (!altPhone || !PHONE_ONLY.test(altPhone)) { toast.error('رقم الهاتف البديل مطلوب'); return false; }
      if (!address) { toast.error('يرجى إدخال العنوان'); return false; }
    }
    if (!quantity || quantity < 1) { toast.error('الكمية غير صحيحة'); return false; }
    if (book && quantity > book.stock) { toast.error('الكمية المطلوبة أكبر من المتاح'); return false; }
    return true;
  };

  const handleCreateOrder = async () => {
    if (!user) { toast.error('يرجى تسجيل الدخول أولاً'); navigate('/login'); return; }
    if (!book || !deliveryType) return;
    if (!validateStep1() || !validateStep2()) return;
    setSubmitting(true);
    try {
      const data: any = {
        bookId: book._id,
        grade: book.grade,
        subject: book.subject,
        quantity,
        deliveryType,
        paymentType: deliveryType === 'shipping' ? 'full' : deliveryType === 'pickup' ? 'deposit' : paymentType,
        senderPhone,
      };
      if (deliveryType === 'shipping') {
        data.deliveryDetails = { governorate, center, address, phone, altPhone };
      } else if (deliveryType === 'delivery') {
        data.deliveryDetails = { address, phone, altPhone };
      }
      const res = await ordersAPI.create(data);
      setOrderId(res.data._id || res.data.order?._id);
      setStep(2);
      toast.success('تم إنشاء الطلب بنجاح');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء إنشاء الطلب');
    } finally { setSubmitting(false); }
  };

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleUploadPayment = async () => {
    if (!orderId) return;
    if (!paymentFile) { toast.error('يرجى اختيار صورة الإيصال'); return; }
    if (!senderPhone) { toast.error('يرجى إدخال رقم هاتف المرسل'); return; }
    setUploading(true);
    try {
      const imageBase64 = await fileToBase64(paymentFile);
      await ordersAPI.uploadPayment(orderId, { image: imageBase64, senderPhone });
      toast.success('تم رفع إيصال الدفع بنجاح');
      setDone(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء رفع الإيصال');
    } finally { setUploading(false); }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) setPaymentFile(file);
    else toast.error('يرجى اختيار صورة فقط');
  }, []);

  if (bookLoading) return <div className="min-h-screen pt-24 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!book) return null;

  return (
    <div className="min-h-screen pt-24 pb-16" dir="rtl">
      <div className="page-container max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">طلب جديد</h1>
          {step > 0 && (
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="flex items-center gap-1.5 text-sm btn-secondary">
              <ArrowLeft className="w-4 h-4" /> رجوع
            </button>
          )}
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {stepLabels.map((label, i) => {
            const Icon = stepIcons[i];
            const isActive = step === i;
            const isDone = step > i;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isDone ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' :
                    isActive ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-110' :
                    'glass-card text-gray-400'
                  }`}>
                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium ${isActive || isDone ? 'text-teal-400' : 'text-gray-400'}`}>{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`w-16 md:w-24 h-0.5 mx-2 rounded-full transition-colors duration-300 ${step > i ? 'bg-teal-500' : 'glass-card'}`} />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <p className="text-sm text-gray-400 mb-6 text-center">اختر طريقة الطلب المناسبة لك</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {typeCards.map(({ type, icon: Icon, title, subtitle, gradient, shadow }) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setDeliveryType(type); setStep(1); }}
                    className={`relative p-6 rounded-2xl text-right border-2 transition-all ${
                      deliveryType === type
                        ? 'border-teal-500 bg-teal-500/10 shadow-xl shadow-teal-500/20'
                        : 'glass-card border-transparent hover:border-teal-500/30'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg ${shadow}`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{title}</h3>
                    <p className="text-sm text-gray-400">{subtitle}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && deliveryType && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
              {/* Book Info Card */}
              <div className="glass-card p-4 flex items-center gap-4 rounded-2xl">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {book.image ? (
                    <img src={book.image} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <Package className="w-6 h-6 opacity-30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{book.titleAr}</p>
                  <p className="text-xs text-gray-400">{book.grade} - {book.subject}</p>
                  <p className="text-xs text-gray-400">المخزون: {book.stock}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-teal-400">{formatPrice(book.price)}</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><User className="w-4 h-4 text-teal-400" />الاسم الكامل</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="input-field rounded-2xl" placeholder="الاسم بالعربية" />
              </div>

              {/* Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><Phone className="w-4 h-4 text-teal-400" />رقم الهاتف</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="input-field rounded-2xl" placeholder="01xxxxxxxxx" dir="ltr" />
                </div>
                {(deliveryType === 'shipping' || deliveryType === 'delivery') && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><Phone className="w-4 h-4 text-teal-400" />هاتف بديل</label>
                    <input type="text" value={altPhone} onChange={(e) => setAltPhone(e.target.value)}
                      className="input-field rounded-2xl" placeholder="01xxxxxxxxx" dir="ltr" />
                  </div>
                )}
              </div>

              {/* Shipping specific */}
              {deliveryType === 'shipping' && (
                <>
                  <div ref={govRef} className="relative">
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-teal-400" />المحافظة</label>
                    <div onClick={() => setGovOpen(!govOpen)} className="input-field rounded-2xl flex items-center justify-between cursor-pointer">
                      <span className={governorate ? '' : 'text-gray-500'}>{governorate || 'اختر المحافظة'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${govOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {govOpen && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="absolute z-20 mt-1 w-full rounded-2xl glass-card p-2 shadow-xl max-h-60 overflow-hidden flex flex-col">
                        <div className="relative mb-1">
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" value={govSearch} onChange={(e) => setGovSearch(e.target.value)}
                            className="input-field rounded-xl pr-9 text-sm" placeholder="بحث..." autoFocus />
                        </div>
                        <div className="overflow-y-auto flex-1 space-y-0.5">
                          {filteredGovernorates.length === 0 ? (
                            <p className="text-center text-sm text-gray-400 py-3">لا توجد نتائج</p>
                          ) : filteredGovernorates.map((dp) => (
                            <button key={dp._id} onClick={() => { setGovernorate(dp.governorate); setGovOpen(false); setGovSearch(''); }}
                              className={`w-full text-right px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-teal-500/10 ${
                                governorate === dp.governorate ? 'bg-teal-500/15 text-teal-400 font-medium' : ''
                              }`}>
                              <span>{dp.governorate}</span>
                              <span className="text-xs text-gray-400 mr-2">{formatPrice(dp.price)}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">المركز / الحي</label>
                    <input type="text" value={center} onChange={(e) => setCenter(e.target.value)}
                      className="input-field rounded-2xl" placeholder="المركز أو الحي" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">العنوان بالتفصيل</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)}
                      className="input-field rounded-2xl min-h-[80px]" placeholder="الشارع، المبنى، الشقة..." />
                  </div>
                </>
              )}

              {/* Delivery specific */}
              {deliveryType === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-teal-400" />العنوان</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                    className="input-field rounded-2xl" placeholder="العنوان بالتفصيل" />
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><Hash className="w-4 h-4 text-teal-400" />الكمية</label>
                <div className="inline-flex items-center gap-3 glass-card rounded-2xl p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center hover:bg-teal-500/20 transition-all">
                    <span className="text-lg font-bold">-</span>
                  </button>
                  <span className="text-lg font-bold w-10 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(book.stock, quantity + 1))} className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center hover:bg-teal-500/20 transition-all">
                    <span className="text-lg font-bold">+</span>
                  </button>
                </div>
              </div>

              {/* Payment Type (only for local delivery) */}
              {deliveryType === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-teal-400" />نوع الدفع</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setPaymentType('full')}
                      className={`p-3 rounded-2xl text-right border-2 transition-all ${
                        paymentType === 'full' ? 'border-teal-500 bg-teal-500/10' : 'glass-card border-transparent'
                      }`}>
                      <div className="text-sm font-bold">دفع كامل</div>
                      <div className="text-xs text-gray-400">{formatPrice(getTotal())}</div>
                    </button>
                    <button onClick={() => setPaymentType('deposit')}
                      className={`p-3 rounded-2xl text-right border-2 transition-all ${
                        paymentType === 'deposit' ? 'border-teal-500 bg-teal-500/10' : 'glass-card border-transparent'
                      }`}>
                      <div className="text-sm font-bold">عربون 10%</div>
                      <div className="text-xs text-gray-400">{formatPrice(getDeposit())}</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">سعر الكتاب</span>
                  <span>{formatPrice(bookTotal)}</span>
                </div>
                {deliveryType === 'shipping' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">التوصيل</span>
                    <span>{formatPrice(shippingPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-3 mt-2">
                  <span>الإجمالي</span>
                  <span className="text-teal-400">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 mt-1 border-t border-dashed border-white/10">
                  <span className="text-amber-400 font-medium">المطلوب دفعه</span>
                  <span className="text-lg font-bold text-amber-400">{formatPrice(getRequiredPayment())}</span>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <button onClick={handleCreateOrder} disabled={submitting}
                  className="btn-primary flex-1 justify-center text-base !py-3.5 rounded-2xl disabled:opacity-50">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري...
                    </span>
                  ) : 'تأكيد الطلب'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
              {done ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto">
                    <Check className="w-10 h-10 text-teal-400" />
                  </div>
                  <h2 className="text-2xl font-bold">تم استلام طلبك بنجاح!</h2>
                  <p className="text-gray-400">رقم الطلب: <span className="font-bold text-teal-400" dir="ltr">{orderId}</span></p>
                  <p className="text-sm text-gray-400">سيتم مراجعة الدفع وتأكيد الطلب قريباً</p>
                  <div className="flex gap-3 justify-center pt-4">
                    <Link to="/orders" className="btn-primary">طلباتي</Link>
                    <Link to="/books" className="btn-secondary">متابعة التسوق</Link>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="glass-card rounded-2xl p-5 text-center space-y-2">
                    <Check className="w-10 h-10 text-teal-400 mx-auto" />
                    <p className="font-bold">تم إنشاء الطلب بنجاح</p>
                    <p className="text-sm text-gray-400">رقم الطلب: <span className="font-bold text-teal-400" dir="ltr">{orderId}</span></p>
                    <p className="text-sm text-gray-400">الرجاء تحويل المبلغ المطلوب وإرفاق صورة الإيصال</p>
                    <p className="text-sm text-amber-400 font-bold">{formatPrice(getRequiredPayment())}</p>
                  </div>

                  <div className="glass-card rounded-2xl p-5 space-y-4">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-teal-400" />
                      بيانات الدفع
                    </p>
                    <div className="bg-teal-500/5 rounded-2xl p-4 space-y-1 text-sm border border-teal-500/10">
                      <p>فودافون كاش: <span className="font-bold" dir="ltr">01033558125</span></p>
                      <p className="text-gray-400">صاحب الحساب: Book Beacon</p>
                      <p className="text-gray-400">المطلوب: {formatPrice(getRequiredPayment())}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><Phone className="w-4 h-4 text-teal-400" />رقم هاتف المرسل (فودافون كاش)</label>
                    <input type="text" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)}
                      className="input-field rounded-2xl" placeholder="رقم الهاتف المرسل منه" dir="ltr" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><Image className="w-4 h-4 text-teal-400" />صورة الإيصال</label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`input-field rounded-2xl min-h-[120px] flex flex-col items-center justify-center cursor-pointer border-dashed transition-all ${
                        dragOver ? 'border-teal-400 bg-teal-500/5' : ''
                      } ${paymentFile ? 'border-teal-500 bg-teal-500/5' : ''}`}
                    >
                      {paymentFile ? (
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-teal-400" />
                          <span className="text-sm">{paymentFile.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); setPaymentFile(null); }} className="p-1 rounded-lg hover:bg-red-500/10 text-red-400">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-400">اسحب وأفلت الصورة هنا أو اضغط للاختيار</p>
                          <p className="text-xs text-gray-500 mt-1">jpg, png, webp</p>
                        </>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setPaymentFile(e.target.files[0])} className="hidden" />
                    </div>
                  </div>

                  <button onClick={handleUploadPayment} disabled={uploading || !paymentFile}
                    className="btn-primary w-full justify-center text-base !py-3.5 rounded-2xl disabled:opacity-50">
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        جاري الرفع...
                      </span>
                    ) : 'رفع إيصال الدفع'}
                  </button>

                  <div className="text-center">
                    <Link to="/orders" className="text-sm text-teal-400 hover:underline">تخطي، سأرفع لاحقاً</Link>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
