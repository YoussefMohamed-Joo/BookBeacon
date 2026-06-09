import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <>
      <Helmet><title>الشروط والأحكام | Book Beacon</title></Helmet>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/30">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">الشروط والأحكام</h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-dark-800/50 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-dark-700/50 space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">مقدمة</h2>
              <p>باستخدامك لمنصة Book Beacon، فإنك توافق على هذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام خدماتنا.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">الحسابات</h2>
              <p>أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور. يمنع إنشاء أكثر من حساب لنفس الشخص.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">الطلبات والدفع</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>يتم دفع 10% من قيمة الطلب كعربون عند تقديم الطلب</li>
                <li>يتم الدفع عبر Vodafone Cash على الرقم 01033558125</li>
                <li>الباقي يُدفع عند الاستلام (للتوصيل) أو عند الاستلام من الفرع</li>
                <li>يجب رفع صورة التحويل كدليل على الدفع</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">الإلغاء والاسترجاع</h2>
              <p>يمكن إلغاء الطلب قبل تجهيزه. في حالة الإلغاء بعد التجهيز، يتم خصم قيمة العربون.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">التوصيل</h2>
              <p>نوفر التوصيل لجميع محافظات مصر مع اختلاف أسعار التوصيل حسب المحافظة. يمكنك أيضاً اختيار الاستلام من الفرع مجاناً.</p>
            </section>
            <p className="text-sm text-gray-400 pt-4 border-t border-gray-100 dark:border-dark-700">آخر تحديث: يونيو 2026</p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
