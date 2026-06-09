import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Star, Truck, Shield, ArrowLeft, GraduationCap, TrendingUp, Sparkles, ChevronDown, BookMarked, Award, Zap, Brain, Percent, Users, MapPin, Calendar, CheckCircle, BookText } from 'lucide-react';
import BookCard from '../components/BookCard';
import ScrollReveal from '../components/animations/ScrollReveal';
import MagneticButton from '../components/animations/MagneticButton';
import { booksAPI } from '../lib/api';

const HeroScene = lazy(() => import('../components/3d/HeroScene'));

const features = [
  { icon: Shield, title: 'دفع آمن', desc: 'طرق دفع آمنة عبر فودافون كاش', gradient: 'from-emerald-500 to-teal-500' },
  { icon: Truck, title: 'توصيل سريع', desc: 'نوصل لكل محافظات مصر بسرعة وأمان', gradient: 'from-cyan-500 to-blue-500' },
  { icon: BookOpen, title: 'كتالوج ضخم', desc: 'أكثر من ٥٠٠ كتاب لجميع الصفوف', gradient: 'from-primary-500 to-purple-500' },
  { icon: Star, title: 'نقاط الولاء', desc: 'اجمع نقاط واستبدلها بخصومات', gradient: 'from-amber-500 to-orange-500' },
];

const stats = [
  { value: '٥٠٠+', label: 'كتاب متوفر', icon: BookOpen },
  { value: '١٠٠٠٠+', label: 'طالب استفاد', icon: Users },
  { value: '٢٧', label: 'محافظة نوصّل لها', icon: MapPin },
  { value: '٥+', label: 'سنوات خبرة', icon: Calendar },
];

const grades = [
  { name: 'أولى ثانوي', icon: GraduationCap, gradient: 'from-emerald-500 to-emerald-600', slug: 'أولى+ثانوي', desc: 'كتب الصف الأول الثانوي' },
  { name: 'تانية ثانوي', icon: BookOpen, gradient: 'from-blue-500 to-blue-600', slug: 'تانية+ثانوي', desc: 'كتب الصف الثاني الثانوي' },
  { name: 'تالتة ثانوي', icon: TrendingUp, gradient: 'from-purple-500 to-purple-600', slug: 'تالتة+ثانوي', desc: 'كتب الصف الثالث الثانوي' },
];

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.95]);

  useEffect(() => {
    booksAPI.getAll({ limit: 8 }).then((res) => setBooks(res.data.books)).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Book Beacon | منصة كتب الثانوية العامة في مصر</title>
        <meta name="description" content="أفضل منصة لشراء كتب الثانوية العامة في مصر. كتب أولى ثانوي، تانية ثانوي، تالتة ثانوي بأسعار ممتازة." />
      </Helmet>

      {/* Hero Section */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-white dark:from-dark-900 dark:via-dark-950 dark:to-dark-950" />

        {/* Subtle background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-400/10 dark:bg-primary-500/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-400/10 dark:bg-purple-500/5 blur-[120px]" />
          <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-cyan-400/10 dark:bg-cyan-500/5 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-right lg:text-right">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 mb-6">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">منصة كتب الثانوية العامة رقم ١ في مصر</span>
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              <span className="gradient-text">Book Beacon</span>
              <br />
              <span className="text-gray-800 dark:text-gray-100">منصة كتب الثانوية العامة</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-xl leading-relaxed"
            >
              أفضل الكتب الدراسية للثانوية العامة في مصر — نوفر لك كل ما تحتاج للتفوق مع أسرع توصيل وأفضل الأسعار
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="flex flex-wrap gap-4 justify-start">
              <MagneticButton>
                <Link to="/books" className="btn-primary text-lg px-8 py-3 shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30">
                  تصفح الكتب
                  <ArrowLeft className="w-5 h-5 inline mr-2" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/register" className="btn-outline text-lg px-8 py-3">
                  إنشاء حساب
                </Link>
              </MagneticButton>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 flex items-center gap-8 text-sm text-gray-400"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 border-2 border-white dark:border-dark-900" />
                ))}
              </div>
              <span>انضم إلى <strong className="text-gray-700 dark:text-gray-300">١٠٠٠+</strong> طالب</span>
            </motion.div>
          </div>

          {/* 3D Scene */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:block h-[600px] relative"
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <HeroScene />
            </Suspense>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-6 h-6 text-gray-300" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="text-center p-6 rounded-2xl bg-white dark:bg-dark-800/50 border border-gray-100 dark:border-dark-700/50 shadow-soft"
                >
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deposit System */}
      <section className="py-16 bg-gradient-to-l from-primary-50/80 to-primary-100/30 dark:from-dark-800/30 dark:to-dark-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <ScrollReveal>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
                  <Percent className="w-4 h-4" /> نظام المقدم
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">احجز ب ١٠٪ مقدم</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  احجز أي كتاب بدفع ١٠٪ فقط من قيمته مقدم، وادفع الباقي عند الاستلام. نظام مرن وسهل يضمن لك حجز الكتاب قبل نفاد الكمية.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white dark:bg-dark-800 rounded-xl px-4 py-2.5 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium">١٠٪ مقدم فقط</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-dark-800 rounded-xl px-4 py-2.5 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium">استلام يد بيد</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-dark-800 rounded-xl px-4 py-2.5 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium">توصيل لكل مصر</span>
                  </div>
                </div>
                <Link to="/books" className="inline-flex items-center gap-2 mt-6 text-primary-500 hover:text-primary-600 font-medium transition-colors">
                  تصفح الكتب <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white dark:bg-dark-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 dark:border-dark-700/50 shadow-xl">
                  <h3 className="text-lg font-bold mb-4">مثال لحساب المقدم</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-dark-700">
                      <span className="text-sm text-gray-500">سعر الكتاب</span>
                      <span className="font-bold">٢٥٠ ج.م</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                      <span className="text-sm text-emerald-600 font-medium">المقدم (١٠٪)</span>
                      <span className="font-bold text-emerald-600">٢٥ ج.م</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-dark-700">
                      <span className="text-sm text-gray-500">الباقي عند الاستلام</span>
                      <span className="font-bold">٢٢٥ ج.م</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">ادفع ٢٥ ج.م عبر فودافون كاش واستلم الكتاب</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white/50 dark:bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">لماذا Book Beacon؟</h2>
              <p className="section-subtitle">نقدم أفضل تجربة لشراء الكتب الدراسية في مصر</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-8 rounded-2xl bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700/50 shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 flex items-center justify-center mb-5 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Grades */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">اختر صفك الدراسي</h2>
              <p className="section-subtitle">تصفح الكتب حسب الصف الدراسي وابدأ رحلة التفوق</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {grades.map((grade, i) => (
              <ScrollReveal key={grade.name} delay={i * 0.1}>
                <Link to={`/books?grade=${grade.slug}`} className="block group">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -6 }}
                    className={`relative p-8 rounded-2xl bg-gradient-to-br ${grade.gradient} text-white overflow-hidden`}
                  >
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
                    <grade.icon className="w-12 h-12 mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold mb-1">{grade.name}</h3>
                    <p className="opacity-80 text-sm mb-4">{grade.desc}</p>
                    <div className="flex items-center gap-2 text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                      <span>تصفح الكتب</span>
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects / Materials */}
      <section className="py-20 bg-white/50 dark:bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="section-title">اختر المادة</h2>
              <p className="section-subtitle">جميع المواد الدراسية للثانوية العامة في مكان واحد</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'الفيزياء', icon: Brain, slug: 'الفيزياء', color: 'from-blue-500 to-blue-600' },
              { name: 'الكيمياء', icon: BookText, slug: 'الكيمياء', color: 'from-emerald-500 to-emerald-600' },
              { name: 'الأحياء', icon: BookOpen, slug: 'الأحياء', color: 'from-green-500 to-green-600' },
              { name: 'الرياضيات', icon: TrendingUp, slug: 'الرياضيات', color: 'from-purple-500 to-purple-600' },
              { name: 'اللغة العربية', icon: BookMarked, slug: 'اللغة+العربية', color: 'from-amber-500 to-orange-500' },
              { name: 'اللغة الإنجليزية', icon: BookText, slug: 'اللغة+الإنجليزية', color: 'from-cyan-500 to-cyan-600' },
            ].map((subject, i) => (
              <ScrollReveal key={subject.name} delay={i * 0.05}>
                <Link to={`/books?subject=${subject.slug}`} className="block group">
                  <motion.div whileHover={{ scale: 1.05, y: -4 }}
                    className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700/50 shadow-soft hover:shadow-lg transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md`}>
                      <subject.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">{subject.name}</span>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 bg-white/50 dark:bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <ScrollReveal>
              <div>
                <h2 className="section-title">أكثر الكتب مبيعاً</h2>
                <p className="section-subtitle">اختر من بين أفضل الكتب التي يثق بها الآلاف</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left">
              <Link to="/books" className="hidden md:flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors">
                عرض الكل <ArrowLeft className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book: any, i: number) => (
              <ScrollReveal key={book._id} delay={i * 0.05}>
                <BookCard book={book} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Award className="w-16 h-16 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">ابدأ رحلة التفوق الآن</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                انضم إلى آلاف الطلاب الذين يثقون في Book Beacon وابدأ رحلتك نحو التفوق
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <MagneticButton>
                  <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3.5 px-10 rounded-xl text-lg shadow-2xl transition-all">
                    <Zap className="w-5 h-5 inline ml-2" /> إنشاء حساب مجاني
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to="/books" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-3.5 px-10 rounded-xl text-lg transition-all">
                    تصفح الكتب
                  </Link>
                </MagneticButton>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
