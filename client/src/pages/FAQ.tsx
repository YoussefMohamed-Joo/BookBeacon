import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'ما هي منصة Book Beacon؟', a: 'Book Beacon هي منصة مصرية متخصصة في بيع كتب الثانوية العامة (المناهج المصرية) مع خدمة التوصيل لجميع المحافظات.' },
  { q: 'كيف يمكنني تقديم طلب؟', a: 'تصفح الكتب، اختر الكتاب الذي تريده، حدد الكمية وطريقة التوصيل، ثم ارفع صورة تحويل العربون (10% من السعر) على Vodafone Cash.' },
  { q: 'ما هي قيمة العربون المطلوب؟', a: 'العربون هو 10% من إجمالي قيمة الطلب. يتم دفعه مقدماً لتأكيد الطلب.' },
  { q: 'كيف يمكنني الدفع؟', a: 'يمكنك الدفع عبر Vodafone Cash على الأرقام 01033558125 أو 01285635691 (by Yousef&Moaz). بعد التحويل، ارفع صورة الإيصال في صفحة الطلب.' },
  { q: 'ما هي طرق التوصيل المتاحة؟', a: 'لدينا خياران: التوصيل للمنزل (بسعر حسب المحافظة) أو الاستلام من الفرع (مجاناً).' },
  { q: 'كم يستغرق التوصيل؟', a: 'مدة التوصيل تختلف حسب المحافظة، وتتراوح عادة بين 2-7 أيام عمل من تاريخ تأكيد الطلب.' },
  { q: 'هل يمكنني إلغاء الطلب؟', a: 'نعم، يمكن إلغاء الطلب قبل تجهيزه. في حالة الإلغاء بعد التجهيز، يتم خصم قيمة العربون.' },
  { q: 'كيف يمكنني تتبع طلبي؟', a: 'يمكنك متابعة حالة طلبك من صفحة "طلباتي" في حسابك. سيتم إشعارك بأي تحديث.' },
  { q: 'هل توفرون كتب لسنوات غير الثانوية العامة؟', a: 'حالياً، نحن متخصصون في كتب الثانوية العامة فقط. قد نوسع نطاق خدماتنا في المستقبل.' },
  { q: 'كيف يمكنني التواصل مع الدعم؟', a: 'يمكنك التواصل عبر صفحة "تواصل معنا" أو عبر الواتساب على الرقم 01033558125.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <Helmet><title>الأسئلة الشائعة | Book Beacon</title></Helmet>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/30">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">الأسئلة الشائعة</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">إجابات لأكثر الأسئلة شيوعاً</p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-dark-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700/50 overflow-hidden"
              >
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-right"
                >
                  <span className="font-medium text-gray-800 dark:text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
