import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, Eye, X, ShoppingBag, MapPin, Calendar, Phone } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { ordersAPI } from '../lib/api';
import { formatPrice, getStatusColor, getStatusText, getDeliveryMethodText } from '../lib/utils';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    ordersAPI.getMyOrders().then((res) => { setOrders(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>طلباتي | Book Beacon</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/20">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="section-title !text-2xl md:!text-3xl !mb-0">طلباتي</h1>
                <p className="section-subtitle !mb-0">عرض حالة طلباتك</p>
              </div>
            </div>
          </motion.div>

          {loading ? <LoadingSpinner /> : orders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-50 dark:bg-dark-800 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-400 mb-1">لا توجد طلبات بعد</p>
              <p className="text-sm text-gray-400">تصفح الكتب واطلب الآن</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <motion.div key={order._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-dark-800/50 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-dark-700/50 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base">{order.book?.titleAr || 'كتاب'}</h3>
                          <p className="text-xs text-gray-400">{order.book?.subject}</p>
                        </div>
                        <span className={`mr-auto text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500 mr-13">
                        <span>الكمية: {order.quantity}</span>
                        <span>الإجمالي: {formatPrice(order.totalPrice)}</span>
                        <span>{getDeliveryMethodText(order.deliveryMethod)}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                      {order.deliveryMethod === 'delivery' && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 dark:bg-dark-700/50 rounded-xl px-3 py-2">
                          <MapPin className="w-3 h-3" />
                          <span>{order.deliveryDetails?.governorate}</span>
                          <span className="text-gray-300">|</span>
                          <span>{order.deliveryDetails?.address}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {order.paymentProof?.imageUrl && (
                        <button onClick={() => setSelectedOrder(order)}
                          className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 text-sm transition-all flex items-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" /> الإيصال
                        </button>
                      )}
                    </div>
                  </div>
                  {order.deliveryStatus !== 'not_started' && order.status === 'approved' && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-700 flex items-center gap-2">
                      <span className="text-xs text-gray-400">حالة التوصيل:</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.deliveryStatus)}`}>
                        {getStatusText(order.deliveryStatus)}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {selectedOrder && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={() => setSelectedOrder(null)}
              >
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white dark:bg-dark-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">إيصال الدفع</h3>
                    <button onClick={() => setSelectedOrder(null)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <img src={selectedOrder.paymentProof.imageUrl} alt="Payment proof" className="w-full rounded-xl" />
                  <p className="text-sm text-gray-500 mt-3 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> رقم المرسل: {selectedOrder.paymentProof.senderPhone}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
