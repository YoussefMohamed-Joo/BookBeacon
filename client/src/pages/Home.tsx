import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Star, Truck, Shield, ArrowLeft, GraduationCap, TrendingUp, Sparkles, ChevronDown, BookMarked, Award, Zap, Brain, Users, MapPin, BookText, Globe, MessageCircle, PhoneCall, Wallet, Clock, Lock, BadgeCheck, Store } from 'lucide-react';
import BookCard from '../components/BookCard';
import ScrollReveal from '../components/animations/ScrollReveal';
import MagneticButton from '../components/animations/MagneticButton';
import FloatingParticles from '../components/FloatingParticles';
import Logo from '../components/Logo';
import ErrorBoundary from '../components/ErrorBoundary';
import { booksAPI } from '../lib/api';

const HeroScene = lazy(() => import('../components/3d/HeroScene'));

const features = [
  { icon: Shield, title: 'دفع آمن', desc: 'طرق دفع آمنة عبر فودافون كاش — متاح ف كل مصر', gradient: 'from-emerald-500 to-teal-500' },
  { icon: Truck, title: 'توصيل سريع', desc: 'بنوصل لكل محافظات مصر بسرعة و في أمان', gradient: 'from-emerald-500 to-emerald-600' },
  { icon: BookOpen, title: 'كتالوج ضخم', desc: 'أكتر من ٥٠٠ كتاب لكل الصفوف و المواد', gradient: 'from-green-500 to-green-600' },
  { icon: Star, title: 'نقاط الولاء', desc: 'اجمع نقاط و استبدلها بخصومات جامدة', gradient: 'from-amber-500 to-orange-500' },
];

const stats = [
  { value: '٥٠٠+', label: 'كتاب متوفر', icon: BookOpen },
  { value: '١٠٠٠٠+', label: 'طالب استفاد', icon: Users },
  { value: '٢٧', label: 'محافظة بنوصلها', icon: MapPin },
  { value: '٥+', label: 'سنين خبرة', icon: Star },
];

const grades = [
  { name: 'أولى ثانوي', icon: GraduationCap, gradient: 'from-emerald-500 to-emerald-600', slug: 'أولى+ثانوي', desc: 'كتب الصف الأول الثانوي', emoji: '📚' },
  { name: 'تانية ثانوي', icon: BookOpen, gradient: 'from-blue-500 to-blue-600', slug: 'تانية+ثانوي', desc: 'كتب الصف الثاني الثانوي', emoji: '📖' },
  { name: 'تالتة ثانوي', icon: TrendingUp, gradient: 'from-orange-500 to-orange-600', slug: 'تالتة+ثانوي', desc: 'كتب الصف الثالث الثانوي', emoji: '🎯' },
];

const trustFeatures = [
  { icon: BadgeCheck, title: 'ضمان الحق للجميع', desc: 'بنضمن حق البائع و المشتري — المقدم بيأمن الطرفين, و الفلوس مش بتضيع', color: 'from-emerald-500 to-teal-500' },
  { icon: MessageCircle, title: 'تواصل مباشر', desc: 'تقدر تكلمنا ع الواتساب 01033558125 أو عبر الموقع — احنا معاك ١٢ ساعة يومياً', color: 'from-green-500 to-emerald-500' },
  { icon: Wallet, title: 'نظام المقدم (١٠٪)', desc: 'ادفع ١٠٪ بس عشان تحجز الكتاب, و الباقي تدفعه لما تستلم — النظام ده بيضمن الكل', color: 'from-amber-500 to-orange-500' },
  { icon: Clock, title: 'متابعة الطلب', desc: 'تقدر تتابع طلبك خطوة بخطوة — من التأكيد للتحضير للشحن للتوصيل', color: 'from-emerald-500 to-emerald-600' },
  { icon: Store, title: 'استلام يد بيد', desc: 'بنقابلك ف مكان عام عشان تسلم الكتاب بنفسك — أو بنوصلك لباب البيت', color: 'from-amber-500 to-orange-500' },
  { icon: Lock, title: 'بياناتك آمنة', desc: 'مش بنشارك بياناتك مع حد تالت — كل حاجة مشفرة و مضمونة', color: 'from-red-500 to-rose-500' },
];

const subjectsList = [
  { name: 'الفيزياء', icon: Brain, slug: 'الفيزياء', color: 'from-blue-500 to-blue-600', emoji: '⚡' },
  { name: 'الكيمياء', icon: BookText, slug: 'الكيمياء', color: 'from-emerald-500 to-emerald-600', emoji: '🧪' },
  { name: 'الأحياء', icon: BookOpen, slug: 'الأحياء', color: 'from-green-500 to-green-600', emoji: '🧬' },
  { name: 'الرياضيات', icon: TrendingUp, slug: 'الرياضيات', color: 'from-orange-500 to-orange-600', emoji: '📐' },
  { name: 'العربي', icon: BookMarked, slug: 'اللغة+العربية', color: 'from-amber-500 to-orange-500', emoji: '📝' },
  { name: 'الإنجليزي', icon: Globe, slug: 'اللغة+الإنجليزية', color: 'from-green-500 to-green-600', emoji: '🌍' },
];

function ParallaxSection({ children, className = '', speed = 0.5 }: { children: React.ReactNode; className?: string; speed?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 5}%`, `${speed * 5}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="relative z-10">
        {children}
      </motion.div>
    </div>
  );
}

function Counter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <span ref={ref} className={`counter-value text-3xl md:text-4xl font-bold gradient-text mb-1 block transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {value}{suffix}
    </span>
  );
}

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.95]);

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    booksAPI.getAll({ limit: 8 }).then((res) => setBooks(res.data.books)).catch(() => {});
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--mouse-x', String(x));
      el.style.setProperty('--mouse-y', String(y));
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <>
      <Helmet>
        <title>Book Beacon | منصة كتب الثانوية العامة ف مصر</title>
        <meta name="description" content="أفضل منصة لشراء كتب الثانوية العامة في مصر. كتب أولى و تانية و تالتة ثانوي بأسعار تحفة." />
      </Helmet>

      {/* Hero Section */}
      <section ref={heroRef}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-white dark:from-dark-900 dark:via-dark-950 dark:to-dark-950" />
        <FloatingParticles count={20} />

        <div className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ transform: 'translateX(calc(var(--mouse-x, 0) * -20px)) translateY(calc(var(--mouse-y, 0) * -20px))' }}
        >
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary-400/10 dark:bg-primary-500/5 blur-[120px] animate-glow-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cta-400/10 dark:bg-cta-500/5 blur-[120px] animate-glow-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-amber-400/10 dark:bg-amber-500/5 blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-right lg:text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 mb-6">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">منصة كتب ثانوية عامة — مصري ١٠٠٪</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">Book Beacon</span>
              <br />
              <span className="text-gray-800 dark:text-gray-100">مستقبل الكتب المدرسية</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-xl leading-relaxed">
              أحسن الكتب الدراسية للثانوية العامة ف مصر — بنوفرلك كل اللي محتاجه عشان تتفوق، مع أسرع توصيل و أحسن الأسعار. بكل بساطة 🤝
            </p>

            <div className="flex flex-wrap gap-4 justify-start">
              <MagneticButton>
                <Link to="/books" className="btn-primary text-lg px-8 py-3 shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40">
                  تصفح الكتب
                  <ArrowLeft className="w-5 h-5 inline mr-2" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/register" className="btn-outline text-lg px-8 py-3">
                  إنشاء حساب
                </Link>
              </MagneticButton>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 border-2 border-white dark:border-dark-900 flex items-center justify-center text-[10px] text-white font-bold"
                  >
                    {['أ', 'ب', 'ج', 'د'][i - 1]}
                  </motion.div>
                ))}
              </div>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                انضم لـ <strong className="text-gray-700 dark:text-gray-300">١٠٠٠+</strong> طالب
              </motion.span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.85, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block h-[600px] relative"
          >
            <ErrorBoundary fallback={
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-800 dark:to-dark-900 rounded-3xl">
                <div className="text-center p-8">
                  <Logo size={80} />
                  <p className="text-gray-400 mt-4">عذراً، لم نتمكن من تحميل المشهد ثلاثي الأبعاد</p>
                </div>
              </div>
            }>
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <HeroScene />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-6 h-6 text-gray-300" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <ParallaxSection>
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="text-center p-6 rounded-2xl bg-white dark:bg-dark-800/50 border border-gray-100 dark:border-dark-700/50 shadow-soft hover:shadow-xl transition-all group"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <Counter value={stat.value} />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Trust & Safety — ضمان حق البائع و المشتري */}
      <ParallaxSection>
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 to-transparent dark:from-primary-900/10 dark:to-transparent" />
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
                  <Shield className="w-4 h-4" /> ضمان حق البائع و المشتري
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">إزاي بنضمن حقك؟ 🤝</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">احنا وسيط موثوق — بنضمن حق الطالب و حق الناشر/البائع عشان الكل يبقى مرتاح</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {trustFeatures.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group p-6 rounded-2xl bg-white dark:bg-dark-800/50 border border-gray-100 dark:border-dark-700/50 shadow-soft hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} p-2.5 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* How It Works — خطوات الشراء */}
      <ParallaxSection>
        <section className="py-20 bg-white/50 dark:bg-dark-900/30">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="section-title">إزاي تشتري؟ 🛒</h2>
                <p className="section-subtitle">٣ خطوات بس و تبقى مالك الكتاب — بسيطة و سريعة</p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '١', icon: Search, title: 'اختار الكتاب', desc: 'تصفح الكتب و اختار اللي يناسبك — فيه كتب لكل الصفوف و المواد' },
                { step: '٢', icon: Wallet, title: 'ادفع المقدم', desc: 'ادفع ١٠٪ بس من قيمة الكتاب عبر فودافون كاش على 01033558125' },
                { step: '٣', icon: Truck, title: 'استلم الكتاب', desc: 'استلم الكتاب لباب البيت أو قابلنا ف مكان عام — و ادفع الباقي' },
              ].map((item, i) => (
                <ScrollReveal key={item.step} delay={i * 0.15}>
                  <motion.div whileHover={{ y: -8 }} className="relative p-8 rounded-2xl bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700/50 shadow-soft hover:shadow-xl transition-all text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-primary-500/20">
                      {item.step}
                    </div>
                    <item.icon className="w-8 h-8 mx-auto mb-3 text-primary-400" />
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Features */}
      <ParallaxSection>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="section-title">إيه اللي يخلينا مختلفين؟ 🤔</h2>
                <p className="section-subtitle">احنا مش مجرد منصة كتب — احنا تجربة متكاملة عشان نسهل عليك</p>
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
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
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
      </ParallaxSection>

      {/* Grades */}
      <ParallaxSection>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="section-title">اختر صفك الدراسي 📖</h2>
                <p className="section-subtitle">صفح الكتب حسب الصف اللي انت فيه و ابدأ رحلة التفوق</p>
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
                      <span className="text-4xl mb-4 block">{grade.emoji}</span>
                      <grade.icon className="w-10 h-10 mb-3 opacity-80" />
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
      </ParallaxSection>

      {/* Subjects */}
      <ParallaxSection>
        <section className="py-20 bg-white/50 dark:bg-dark-900/30">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="section-title">اختار المادة بتاعتك 📚</h2>
                <p className="section-subtitle">كل المواد الدراسية للثانوية العامة ف مكان واحد — سهل و بسيط</p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {subjectsList.map((subject, i) => (
                <ScrollReveal key={subject.name} delay={i * 0.05}>
                  <Link to={`/books?subject=${subject.slug}`} className="block group">
                    <motion.div whileHover={{ scale: 1.05, y: -4 }}
                      className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700/50 shadow-soft hover:shadow-lg transition-all"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md`}>
                        <subject.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-center">{subject.emoji} {subject.name}</span>
                    </motion.div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Bestsellers */}
      <ParallaxSection>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <ScrollReveal>
                <div>
                  <h2 className="section-title">الأكثر مبيعاً 🔥</h2>
                  <p className="section-subtitle">أكتر الكتب اللي الطلاب بيثقوا فيها — اختار من الأفضل</p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="left">
                <Link to="/books" className="hidden md:flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors group">
                  عرض الكل <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
      </ParallaxSection>

      {/* Premium CTA — مع معلومات التواصل */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <FloatingParticles count={12} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <motion.div whileHover={{ scale: 1.02 }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
              >
                <Award className="w-10 h-10 text-white/90" />
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">جهز نفسك للتفوق دلوقتي 🚀</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                انضم لآلاف الطلاب اللي بيثقوا في Book Beacon — احنا معاك ف كل خطوة ف طريق النجاح
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <MagneticButton>
                  <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3.5 px-10 rounded-xl text-lg shadow-2xl transition-all">
                    <Zap className="w-5 h-5 inline ml-2" /> إنشاء حساب — مجاني
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to="/books" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-3.5 px-10 rounded-xl text-lg transition-all">
                    تصفح الكتب
                  </Link>
                </MagneticButton>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 inline-flex items-center gap-6 text-white/60 text-sm">
                <a href="tel:01033558125" className="hover:text-white transition-colors flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" /> 01033558125
                </a>
                <a href="https://wa.me/201033558125" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> واتساب
                </a>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

function Search(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
