import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Truck, Shield, Star, ArrowLeft, Search } from 'lucide-react';
import BookCard from '../components/BookCard';
import { booksAPI } from '../lib/api';

const features = [
  { icon: Shield, title: 'دفع آمن', desc: 'طرق دفع آمنة عبر فودافون كاش — متاح في كل مصر' },
  { icon: Truck, title: 'توصيل سريع', desc: 'بنوصل لكل محافظات مصر بسرعة وفي أمان' },
  { icon: BookOpen, title: 'كتالوج ضخم', desc: 'أكثر من 500 كتاب لكل الصفوف والمواد' },
  { icon: Star, title: 'نقاط الولاء', desc: 'اجمع نقاط واستبدلها بخصومات' },
];

const grades = [
  { name: 'أولى ثانوي', slug: 'أولى+ثانوي', desc: 'كتب الصف الأول الثانوي' },
  { name: 'تانية ثانوي', slug: 'تانية+ثانوي', desc: 'كتب الصف الثاني الثانوي' },
  { name: 'تالتة ثانوي', slug: 'تالتة+ثانوي', desc: 'كتب الصف الثالث الثانوي' },
];

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    booksAPI.getAll({ limit: 8 }).then((res) => setBooks(res.data.books)).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Book Beacon | منصة كتب الثانوية العامة في مصر</title>
        <meta name="description" content="أفضل منصة لشراء كتب الثانوية العامة في مصر. كتب أولى وتانية وتالتة ثانوي بأسعار تحفة." />
      </Helmet>

      {/* Hero */}
      <section className="min-h-[85vh] flex items-center pt-20">
        <div className="page-container w-full">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm mb-6" style={{ background: 'var(--soft)', color: 'var(--muted)' }}>
              <Star className="w-3.5 h-3.5" style={{ color: 'var(--cta)' }} />
              منصة كتب ثانوية عامة — مصري 100%
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5" style={{ color: 'var(--text-primary)' }}>
              <span className="gradient-text">Book Beacon</span>
              <br />
              مستقبل الكتب المدرسية
            </h1>

            <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
              أحسن الكتب الدراسية للثانوية العامة في مصر — بنوفرلك كل اللي محتاجه عشان تتفوق، مع أسرع توصيل وأحسن الأسعار
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/books" className="btn-primary text-base !py-3 !px-7">
                تصفح الكتب <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link to="/register" className="btn-secondary text-base !py-3 !px-7">
                إنشاء حساب <Search className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-2">إيه اللي يخلينا مختلفين؟</h2>
            <p className="section-subtitle max-w-xl mx-auto">احنا مش مجرد منصة كتب — احنا تجربة متكاملة عشان نسهل عليك</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item) => (
              <div key={item.title} className="card p-6 text-center">
                <div className="w-11 h-11 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--soft)' }}>
                  <item.icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grades */}
      <section className="py-20 md:py-28" style={{ background: 'var(--soft)' }}>
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-2">اختر صفك الدراسي</h2>
            <p className="section-subtitle max-w-xl mx-auto">صفح الكتب حسب الصف اللي انت فيه وابدأ رحلة التفوق</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {grades.map((grade) => (
              <Link key={grade.name} to={`/books?grade=${grade.slug}`} className="card p-8 text-center block hover:-translate-y-0.5 transition-all duration-200">
                <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{grade.name}</h3>
                <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>{grade.desc}</p>
                <span className="text-sm font-medium" style={{ color: 'var(--cta)' }}>
                  تصفح الكتب <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 md:py-28">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title mb-1">الأكثر مبيعاً</h2>
              <p className="section-subtitle">أكتر الكتب اللي الطلاب بيثقوا فيها</p>
            </div>
            <Link to="/books" className="hidden md:flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--cta)' }}>
              عرض الكل <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {books.map((book: any, i: number) => (
              <BookCard key={book._id} book={book} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24" style={{ background: 'var(--primary)' }}>
        <div className="page-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">جهز نفسك للتفوق دلوقتي</h2>
          <p className="text-white/70 text-lg mb-7 max-w-lg mx-auto">
            انضم لآلاف الطلاب اللي بيثقوا في Book Beacon
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="inline-flex items-center gap-2 bg-white font-semibold px-7 py-2.5 rounded-xl text-sm" style={{ color: 'var(--primary)' }}>
              إنشاء حساب — مجاني
            </Link>
            <Link to="/books" className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-medium px-7 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-all">
              تصفح الكتب
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
