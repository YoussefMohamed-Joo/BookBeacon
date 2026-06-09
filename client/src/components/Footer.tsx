import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Phone, Mail, Clock, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const footerLinks = {
  خدمات: [
    { label: 'جميع الكتب', path: '/books' },
    { label: 'المدونة', path: '/blog' },
    { label: 'سياسة الخصوصية', path: '/privacy' },
    { label: 'الشروط والأحكام', path: '/terms' },
  ],
  المساعدة: [
    { label: 'الأسئلة الشائعة', path: '/faq' },
    { label: 'طرق الدفع', path: '/payment-methods' },
    { label: 'سياسة التوصيل', path: '/delivery-policy' },
    { label: 'اتصل بنا', path: '/contact' },
  ],
};

const contactInfo = [
  { icon: MapPin, text: 'مصر، القاهرة', dir: 'ltr' as const },
  { icon: Phone, text: '01033558125', dir: 'ltr' as const },
  { icon: Mail, text: 'info@bookbeacon.com', dir: 'ltr' as const },
  { icon: Clock, text: '٩ ص - ١٠ م يومياً', dir: 'rtl' as const },
];

export default function Footer() {
  return (
    <footer className="relative bg-dark-950 text-gray-300 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/20">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">Book Beacon</span>
                <p className="text-xs text-gray-500">بوك بيكون — منصة الكتب التعليمية</p>
              </div>
            </Link>

            <p className="text-gray-400 mb-6 max-w-md text-sm leading-relaxed">
              منصة متخصصة في بيع كتب الثانوية العامة في مصر. نقدم أفضل الكتب الدراسية مع أسرع توصيل لجميع المحافظات.
            </p>

            <div className="flex gap-2">
              {[
                { icon: Facebook, href: '#', color: 'hover:bg-blue-600 hover:text-white' },
                { icon: Twitter, href: '#', color: 'hover:bg-sky-500 hover:text-white' },
                { icon: Youtube, href: '#', color: 'hover:bg-red-600 hover:text-white' },
                { icon: Instagram, href: '#', color: 'hover:bg-pink-600 hover:text-white' },
              ].map(({ icon: Icon, href, color }) => (
                <a key={href} href={href}
                  className={`w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-5 text-sm">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}
                      className="text-gray-400 hover:text-primary-400 text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm">تواصل معنا</h4>
            <ul className="space-y-4">
              {contactInfo.map(({ icon: Icon, text, dir }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-400" />
                  </div>
                  <span dir={dir}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-dark-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Book Beacon. جميع الحقوق محفوظة.</p>
          <p>صنع في مصر 🇪🇬 بالحب</p>
        </div>
      </div>
    </footer>
  );
}
