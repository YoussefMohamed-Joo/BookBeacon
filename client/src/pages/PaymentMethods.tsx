import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Smartphone, Building, CreditCard, AlertCircle } from 'lucide-react';

export default function PaymentMethods() {
  const methods = [
    { icon: Smartphone, title: 'Vodafone Cash', desc: 'حول المبلغ المطلوب (العربون 10%) على رقم 01033558125. بعد التحويل، ارفع صورة الإيصال في صفحة الطلب.', color: 'from-red-500 to-red-600' },
    { icon: Building, title: 'الدفع عند الاستلام', desc: 'يمكنك دفع باقي المبلغ عند استلام الطلب (للتوصيل) أو عند الاستلام من الفرع.', color: 'from-green-500 to-green-600' },
    { icon: CreditCard, title: 'التحويل البنكي', desc: 'يمكنك التحويل البنكي للحسابات الرسمية للمنصة. للاستفسار عن بيانات الحساب، تواصل معنا.', color: 'from-blue-500 to-blue-600' },
  ];

  return (
    <>
      <Helmet><title>طرق الدفع | Book Beacon</title></Helmet>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/30">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">طرق الدفع</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">نوفر لك أكثر من طريقة دفع مرنة</p>
          </motion.div>
          <div className="grid gap-6">
            {methods.map((method, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-dark-800/50 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-dark-700/50 flex items-start gap-4"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shrink-0 shadow-lg`}>
                  <method.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{method.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{method.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-1">ملاحظة مهمة</h3>
              <p className="text-amber-700 dark:text-amber-400 text-sm">يُرجى الاحتفاظ بإيصال التحويل حتى استلام طلبك. العربون غير قابل للاسترداد في حالة إلغاء الطلب بعد تجهيزه.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
