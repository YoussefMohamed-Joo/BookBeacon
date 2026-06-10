import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, Clock, Award, ShoppingBag, CreditCard, MapPin, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ordersAPI } from '../lib/api';
import { formatPrice, getStatusColor, getStatusText } from '../lib/utils';
import LoadingSpinner from '../components/LoadingSpinner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CustomerDashboard() {
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pickupOrders = orders.filter((o) => (o.deliveryMethod || o.deliveryType) === 'pickup');
  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    currentReservations: pickupOrders.filter((o) => o.status !== 'delivered' && o.status !== 'rejected').length,
  };

  return (
    <>
      <Helmet><title>حسابي | Book Beacon</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/20">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="section-title !text-2xl md:!text-3xl !mb-0">حسابي</h1>
                <p className="section-subtitle !mb-0">مرحباً بعودتك، {user?.name || 'عميلنا العزيز'}</p>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="stat-card bg-gradient-to-br from-primary-500 to-primary-700 shadow-xl shadow-primary-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 opacity-80" />
                    <span className="text-xs font-medium uppercase tracking-wider opacity-80">إجمالي الطلبات</span>
                  </div>
                  <span className="text-3xl font-bold">{stats.totalOrders}</span>
                </div>
                <div className="stat-card bg-gradient-to-br from-emerald-500 to-teal-700 shadow-xl shadow-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 opacity-80" />
                    <span className="text-xs font-medium uppercase tracking-wider opacity-80">إجمالي الإنفاق</span>
                  </div>
                  <span className="text-3xl font-bold">{formatPrice(stats.totalSpent)}</span>
                </div>
                <div className="stat-card bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 opacity-80" />
                    <span className="text-xs font-medium uppercase tracking-wider opacity-80">الحجوزات الحالية</span>
                  </div>
                  <span className="text-3xl font-bold">{stats.currentReservations}</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 via-primary-500 to-cyan-600 p-6 md:p-8 shadow-2xl shadow-primary-500/30">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
                  <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white" />
                </div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1 font-medium">نقاط الولاء</p>
                    <p className="text-4xl md:text-5xl font-extrabold text-white">{user?.loyaltyPoints ?? 250}</p>
                    <p className="text-white/80 text-sm mt-1">نقطة ولاء</p>
                  </div>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
                    <Award className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-white/70 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  استمر في الشراء لجمع المزيد من النقاط
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-bold">طلباتي</h2>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-400 mb-1">لا توجد طلبات بعد</p>
                    <p className="text-sm text-gray-400">تصفح الكتب واطلب الآن</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order: any) => (
                      <motion.div key={order._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-dark-800/50 rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-dark-700/50 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                              <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-dark-700 px-2 py-0.5 rounded-lg">{order.orderId}</span>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <h3 className="font-semibold text-sm">{order.book?.titleAr || 'كتاب'}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                              <span>الكمية: {order.quantity || 1}</span>
                              <span>الإجمالي: {formatPrice(order.totalPrice)}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold">حجوزات الاستلام</h2>
                </div>

                {pickupOrders.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-dark-800/30 rounded-2xl border border-gray-100 dark:border-dark-700/50">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-400 mb-1">لا توجد حجوزات استلام</p>
                    <p className="text-sm text-gray-400">اختر استلام يد بيد عند الطلب للحجز</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pickupOrders.map((order: any) => (
                      <motion.div key={order._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-dark-800/50 rounded-2xl p-5 shadow-soft border border-amber-100 dark:border-amber-900/20 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                              <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-dark-700 px-2 py-0.5 rounded-lg">{order.orderId}</span>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <h3 className="font-semibold text-sm">{order.book?.titleAr || 'كتاب'}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                              <span>الكمية: {order.quantity || 1}</span>
                              <span>{formatPrice(order.totalPrice)}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
