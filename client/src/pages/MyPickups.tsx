import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Store, Package, Clock, CheckCircle, Phone, MapPin, XCircle, AlertTriangle, Search, ChevronRight } from 'lucide-react';
import { deliveryAPI } from '../lib/api';
import { formatPrice } from '../lib/utils';

export default function MyPickups() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deliveryAPI.getMyPickups()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    not_started: { label: 'قيد المراجعة', color: 'text-gray-500 bg-gray-100 dark:bg-dark-700', icon: Clock },
    preparing: { label: 'قيد التجهيز', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/20', icon: Package },
    out_for_delivery: { label: 'جاهز للاستلام', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20', icon: CheckCircle },
    delivered: { label: 'تم الاستلام', color: 'text-green-600 bg-green-100 dark:bg-green-900/20', icon: CheckCircle },
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>حجوزاتي | Book Beacon</title></Helmet>
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-7 h-7 text-primary-500" />
            <h1 className="text-2xl md:text-3xl font-bold">حجوزاتي</h1>
          </div>
          <p className="text-gray-500 mb-8">متابعة حجوزات الاستلام من المنفذ</p>

          <div className="card p-4 mb-8 bg-gradient-to-l from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/10 border-primary-200 dark:border-primary-800">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">منفذ الاستلام</p>
                <p className="text-sm text-gray-500">بني سويف — الاباصيري الجديد — خلف كازيون</p>
                <p className="text-xs text-gray-400 mt-1">٩ ص — ١٠ م يومياً | اتصل بنا: 01033558125 / 01285635691</p>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400">لا توجد حجوزات</h3>
              <p className="text-sm text-gray-400 mt-1">لم تقم بأي حجز استلام من المنفذ بعد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => {
                const StatusIcon = statusConfig[order.deliveryStatus]?.icon || Clock;
                const deposit = Math.round(order.totalPrice * 0.1);
                const remaining = order.totalPrice - deposit;
                return (
                  <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="card p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{order.book?.titleAr || order.book?.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{order.book?.title}</p>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${statusConfig[order.deliveryStatus]?.color || 'bg-gray-100'}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig[order.deliveryStatus]?.label || order.deliveryStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 p-3 rounded-xl bg-gray-50 dark:bg-dark-800/50">
                      <div>
                        <p className="text-xs text-gray-400">سعر الكتاب</p>
                        <p className="font-bold">{formatPrice(order.totalPrice)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">المدفوع (مقدم)</p>
                        <p className="font-bold text-primary-500">{formatPrice(deposit)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">المتبقي</p>
                        <p className="font-bold text-amber-500">{formatPrice(remaining)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">الكمية</p>
                        <p className="font-bold">{order.quantity || 1}</p>
                      </div>
                    </div>

                    {order.deliveryStatus === 'out_for_delivery' && (
                      <div className="mt-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        كتابك جاهز للاستلام! تفضل على المنفذ و استلمه
                      </div>
                    )}

                    {order.deliveryStatus === 'delivered' && (
                      <div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        تم استلام الكتاب بنجاح. شكراً لثقتك 🤝
                      </div>
                    )}

                    {order.paymentProof?.senderPhone && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                        <Phone className="w-3 h-3" />
                        رقم الدفع: {order.paymentProof.senderPhone}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
