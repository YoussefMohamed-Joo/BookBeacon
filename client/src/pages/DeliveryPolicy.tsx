import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Truck, Store, Clock, MapPin, Package } from 'lucide-react';

const governorates = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'القليوبية', 'الغربية',
  'المنوفية', 'البحيرة', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس',
  'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'الفيوم', 'بني سويف',
  'مطروح', 'الوادي الجديد', 'شمال سيناء', 'جنوب سيناء', 'البحر الأحمر'
];

export default function DeliveryPolicy() {
  return (
    <>
      <Helmet><title>سياسة التوصيل | Book Beacon</title></Helmet>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/30">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">سياسة التوصيل</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">نوصل لكل محافظات مصر</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white dark:bg-dark-800/50 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-dark-700/50"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4 shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">التوصيل للمنزل</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">نوصل الطلب لباب البيت. سعر التوصيل يختلف حسب المحافظة. المدة التقريبية: 2-7 أيام عمل.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white dark:bg-dark-800/50 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-dark-700/50"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">الاستلام من الفرع</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">استلم طلبك من أقرب فرع ليك مجاناً بدون أي مصاريف توصيل.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white dark:bg-dark-800/50 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-dark-700/50"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">مدة التوصيل</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">المدة التقريبية من 2 إلى 7 أيام عمل حسب المحافظة وظروف الشحن.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-white dark:bg-dark-800/50 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-dark-700/50"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">متابعة الطلب</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">تقدر تتابع حالة طلبك من صفحة "طلباتي" وبنرسلك إشعارات بأي تحديث.</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-800/50 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-dark-700/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">المحافظات التي نغطيها</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {governorates.map((gov) => (
                <div key={gov} className="px-3 py-2 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-sm text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-dark-700">{gov}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
