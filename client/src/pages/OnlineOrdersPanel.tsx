import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ordersAPI } from '../lib/api';
import { formatPrice, getStatusColor, getStatusText, getOrderTypeText, getOrderTypeColor, getPaymentTypeText } from '../lib/utils';
import toast from 'react-hot-toast';
import {
  Search, X, Check, Package, Phone, MapPin, Hash, Image as ImageIcon,
  ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Filter, Calendar,
  AlertTriangle, RefreshCw, User, BookOpen, DollarSign, Store, Truck, Zap
} from 'lucide-react';

export default function OnlineOrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [status, setStatus] = useState('');
  const [dateType, setDateType] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [actionModal, setActionModal] = useState<{ order: any; action: 'approve' | 'reject' } | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [imageModal, setImageModal] = useState<{ url: string; senderPhone?: string } | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params: any = { orderSource: 'online', page, limit: 20 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (deliveryType) params.deliveryType = deliveryType;
    if (status) params.status = status;
    if (dateType === 'today') {
      const today = new Date().toISOString().split('T')[0];
      params.dateFrom = today;
      params.dateTo = today;
    } else if (dateType === 'week') {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      params.dateFrom = weekAgo.toISOString().split('T')[0];
      params.dateTo = now.toISOString().split('T')[0];
    } else if (dateType === 'custom') {
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
    }
    ordersAPI.getAll(params)
      .then((res) => {
        setOrders(res.data.orders || []);
        setTotalPages(res.data.pages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [debouncedSearch, deliveryType, status, dateType, dateFrom, dateTo, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleAction = async () => {
    if (!actionModal) return;
    if (actionModal.action === 'reject' && !actionNote.trim()) {
      toast.error('يرجى كتابة سبب الرفض');
      return;
    }
    setActionLoading(true);
    try {
      await ordersAPI.adminAction(actionModal.order._id, {
        action: actionModal.action,
        note: actionNote,
      });
      toast.success(actionModal.action === 'approve' ? 'تمت الموافقة على الطلب' : 'تم رفض الطلب');
      setActionModal(null);
      setActionNote('');
      fetchOrders();
    } catch {
      toast.error('حدث خطأ');
    }
    setActionLoading(false);
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setDeliveryType('');
    setStatus('');
    setDateType('all');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasFilters = search || deliveryType || status || dateType !== 'all' || dateFrom || dateTo;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">الطلبات الأونلاين</h1>
          <p className="text-gray-400 text-sm">إدارة ومراجعة طلبات العملاء الأونلاين</p>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث باسم العميل، الهاتف، أو رقم الطلب..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pr-10 py-2 text-sm"
            />
          </div>
          <select value={deliveryType} onChange={(e) => { setDeliveryType(e.target.value); setPage(1); }} className="input-field py-2 text-sm w-auto">
            <option value="">كل الأنواع</option>
            <option value="shipping">شحن</option>
            <option value="pickup">استلام</option>
            <option value="delivery">دليفري</option>
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field py-2 text-sm w-auto">
            <option value="">كل الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="approved">تمت الموافقة</option>
            <option value="rejected">مرفوض</option>
          </select>
          <select value={dateType} onChange={(e) => setDateType(e.target.value)} className="input-field py-2 text-sm w-auto">
            <option value="all">كل التواريخ</option>
            <option value="today">اليوم</option>
            <option value="week">هذا الأسبوع</option>
            <option value="custom">مخصص</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary text-sm !py-2 flex items-center gap-1">
              <X className="w-4 h-4" /> مسح الفلتر
            </button>
          )}
        </div>
        {dateType === 'custom' && (
          <div className="flex gap-3 items-center">
            <label className="text-sm text-gray-400">من:</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-field py-1.5 text-sm w-auto" />
            <label className="text-sm text-gray-400">إلى:</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-field py-1.5 text-sm w-auto" />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">لا توجد طلبات أونلاين</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order: any) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 md:p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{order.orderId || `#${order._id.slice(-6)}`}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full ${getOrderTypeColor(order.deliveryType)}`}>
                        {getOrderTypeText(order.deliveryType)}
                      </span>
                      <span className={`text-xs ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{order.customerName || order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-400" dir="ltr">{order.user?.phone || order.deliveryDetails?.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{order.book?.titleAr || 'N/A'}</p>
                        <p className="text-xs text-gray-400">الكمية: {order.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-primary-500">{formatPrice(order.totalPrice)}</p>
                        <p className="text-xs text-gray-400">
                          <span className="text-green-500">{formatPrice(order.paidAmount)}</span>
                          {order.remainingAmount > 0 && (
                            <span className="text-amber-500"> / {formatPrice(order.remainingAmount)}</span>
                          )}
                          <span className="mr-1">({getPaymentTypeText(order.paymentType || (order.remainingAmount > 0 ? 'deposit' : 'full'))})</span>
                        </p>
                      </div>
                    </div>
                    {order.deliveryType !== 'pickup' && order.deliveryDetails?.governorate && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-sm">{order.deliveryDetails.governorate}</p>
                          <p className="text-xs text-gray-400">{order.deliveryDetails.center}</p>
                        </div>
                      </div>
                    )}
                    {order.deliveryType === 'pickup' && (
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-gray-400 shrink-0" />
                        <p className="text-sm">استلام من المنفذ</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:shrink-0">
                  {['pending', 'payment_review'].includes(order.status) && (
                    <>
                      <button
                        onClick={() => setActionModal({ order, action: 'approve' })}
                        className="btn-success text-sm !py-1.5 !px-4 flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> موافقة
                      </button>
                      <button
                        onClick={() => setActionModal({ order, action: 'reject' })}
                        className="btn-danger text-sm !py-1.5 !px-4 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> رفض
                      </button>
                    </>
                  )}
                  {order.paymentProof?.imageUrl && (
                    <button
                      onClick={() => {
                        setImageModal({ url: order.paymentProof.imageUrl, senderPhone: order.paymentProof.senderPhone });
                        setZoom(1);
                      }}
                      className="text-sm !py-1.5 !px-4 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 transition-colors flex items-center gap-1"
                    >
                      <ImageIcon className="w-4 h-4" /> عرض الصورة
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="btn-secondary text-sm flex items-center gap-1"
          >
            <ChevronRight className="w-4 h-4" /> السابق
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  p === page
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="btn-secondary text-sm flex items-center gap-1"
          >
            التالي <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {actionModal && (
          <div className="modal-overlay" onClick={() => { if (!actionLoading) { setActionModal(null); setActionNote(''); } }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {actionModal.action === 'approve' ? (
                    <><Check className="w-5 h-5 text-green-500" /> موافقة على الطلب</>
                  ) : (
                    <><X className="w-5 h-5 text-red-500" /> رفض الطلب</>
                  )}
                </h3>
                <button onClick={() => { if (!actionLoading) { setActionModal(null); setActionNote(''); } }} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">رقم الطلب</p>
                  <p className="font-medium">{actionModal.order.orderId || `#${actionModal.order._id.slice(-6)}`}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">العميل</p>
                  <p className="font-medium">{actionModal.order.customerName || actionModal.order.user?.name}</p>
                  <p className="text-xs text-gray-400">{actionModal.order.user?.phone || actionModal.order.deliveryDetails?.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">الكتاب</p>
                  <p className="font-medium">{actionModal.order.book?.titleAr} × {actionModal.order.quantity}</p>
                  <p className="text-xs text-gray-400">{formatPrice(actionModal.order.totalPrice)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {actionModal.action === 'approve' ? 'ملاحظة (اختياري)' : 'سبب الرفض *'}
                  </label>
                  <textarea
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder={actionModal.action === 'approve' ? 'أي ملاحظات...' : 'السبب مطلوب...'}
                    className="input-field text-sm w-full min-h-[80px]"
                    required={actionModal.action === 'reject'}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAction}
                    disabled={actionLoading}
                    className={`flex-1 text-sm flex items-center justify-center gap-1 ${
                      actionModal.action === 'approve' ? 'btn-success' : 'btn-danger'
                    }`}
                  >
                    {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    {actionModal.action === 'approve' ? 'تأكيد الموافقة' : 'تأكيد الرفض'}
                  </button>
                  <button
                    onClick={() => { setActionModal(null); setActionNote(''); }}
                    disabled={actionLoading}
                    className="flex-1 btn-secondary text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {imageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setImageModal(null)}
            onKeyDown={(e) => e.key === 'Escape' && setImageModal(null)}
          >
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(z => Math.min(z + 0.5, 5))}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-white/60 text-sm">{Math.round(zoom * 100)}%</span>
              </div>
              <button
                onClick={() => setImageModal(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {imageModal.senderPhone && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 text-white text-sm flex items-center gap-2 z-10">
                <Phone className="w-4 h-4" /> رقم المحول: {imageModal.senderPhone}
              </div>
            )}
            <motion.img
              src={imageModal.url}
              alt="إيصال الدفع"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
              style={{ transform: `scale(${zoom})` }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: zoom, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
