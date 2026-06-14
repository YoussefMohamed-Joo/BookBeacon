import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <>
      <Helmet><title>سياسة الخصوصية | Book Beacon</title></Helmet>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--primary)]">سياسة الخصوصية</h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-dark-800/50 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-dark-700/50 space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">المعلومات التي نجمعها</h2>
              <p>نحن في Book Beacon نلتزم بحماية خصوصية مستخدمينا. نقوم بجمع المعلومات التالية عند التسجيل: الاسم، البريد الإلكتروني، رقم الهاتف، وعنوان التوصيل.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">كيف نستخدم معلوماتك</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>معالجة طلبات الشراء والتوصيل</li>
                <li>التواصل معك بخصوص طلباتك</li>
                <li>تحسين خدماتنا وتجربة المستخدم</li>
                <li>إرسال العروض والخصومات (بموافقتك)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">حماية البيانات</h2>
              <p>نستخدم أحدث تقنيات التشفير لحماية بياناتك. لا نشارك معلوماتك مع أطراف ثالثة دون موافقتك، إلا عندما يقتضي القانون ذلك.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">ملفات تعريف الارتباط (Cookies)</h2>
              <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع، مثل تذكر تفضيلاتك وتتبع عربة التسوق.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">حقوقك</h2>
              <p>لديك الحق في طلب تصحيح أو حذف بياناتك الشخصية في أي وقت. يمكنك التواصل معنا عبر صفحة اتصل بنا.</p>
            </section>
            <p className="text-sm text-gray-400 pt-4 border-t border-gray-100 dark:border-dark-700">آخر تحديث: يونيو 2026</p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
