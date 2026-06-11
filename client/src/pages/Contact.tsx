import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import ScrollReveal from '../components/animations/ScrollReveal';

const contactInfo = [
  { icon: Phone, label: 'الهاتف', value: '01033558125 / 01285635691', href: 'tel:01033558125', dir: 'ltr' },
  { icon: MessageCircle, label: 'واتساب', value: '01033558125', href: 'https://wa.me/201033558125', dir: 'ltr' },
  { icon: Mail, label: 'البريد الإلكتروني', value: 'info@bookbeacon.com', href: 'mailto:info@bookbeacon.com', dir: 'ltr' },
  { icon: MapPin, label: 'العنوان', value: 'القاهرة، مصر', dir: 'rtl' },
  { icon: Clock, label: 'مواعيد العمل', value: 'السبت - الخميس، ٩ ص - ١٠ م', dir: 'rtl' },
];

export default function Contact() {
  const [formSent, setFormSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setFormSent(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>تواصل معنا | Book Beacon</title>
        <meta name="description" content="تواصل مع Book Beacon - فريقنا جاهز لمساعدتك. هاتف، واتساب، بريد إلكتروني." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        {/* Header */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-dark-800/30" />
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/20">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold gradient-text">تواصل معنا</h1>
                  <p className="text-gray-500 dark:text-gray-400">فريقنا جاهز لمساعدتك على مدار الأسبوع</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, i) => (
                <ScrollReveal key={item.label} delay={i * 0.05}>
                  {item.href ? (
                    <a href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-dark-800/50 border border-gray-100 dark:border-dark-700/50 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="w-5 h-5 text-primary-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                        <p className="font-medium text-sm" dir={item.dir}>{item.value}</p>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-dark-800/50 border border-gray-100 dark:border-dark-700/50 shadow-soft">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                        <p className="font-medium text-sm" dir={item.dir}>{item.value}</p>
                      </div>
                    </div>
                  )}
                </ScrollReveal>
              ))}
            </div>

            {/* Quick Contact Form */}
            <ScrollReveal direction="left">
              <div className="bg-white dark:bg-dark-800/50 rounded-3xl p-8 border border-gray-100 dark:border-dark-700/50 shadow-xl">
                <h2 className="text-xl font-bold mb-2">أرسل لنا رسالة</h2>
                <p className="text-sm text-gray-500 mb-6">نحن نرد خلال ٢٤ ساعة</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">الاسم</label>
                    <input type="text" className="input-field rounded-2xl" placeholder="الاسم الكامل" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">البريد الإلكتروني</label>
                      <input type="email" className="input-field rounded-2xl" placeholder="example@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">رقم الهاتف</label>
                      <input type="text" className="input-field rounded-2xl" placeholder="01012345678" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">الرسالة</label>
                    <textarea className="input-field rounded-2xl min-h-[120px]" placeholder="اكتب رسالتك هنا..." />
                  </div>
                  <button type="submit" disabled={formSent} className="w-full py-3 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-500 text-white font-bold shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> {formSent ? 'تم الإرسال ✓' : 'إرسال الرسالة'}
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </>
  );
}
