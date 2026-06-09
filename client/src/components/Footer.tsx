import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Logo from './Logo';

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
  { icon: MapPin, text: 'بني سويف، مصر' },
  { icon: Phone, text: '01033558125' },
  { icon: Mail, text: 'info@bookbeacon.com' },
  { icon: Clock, text: '٩ ص - ١٠ م يومياً' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#1f1f1f' }}>
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <Logo size={42} />
              <div>
                <span className="text-lg font-bold text-white">بوكيفاي</span>
                <p className="text-xs" style={{ color: '#a8a29e' }}>منصة الكتب التعليمية</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: '#a8a29e' }}>
              منصة متخصصة في بيع كتب الثانوية العامة في مصر. نقدم أفضل الكتب الدراسية مع أسرع توصيل لجميع المحافظات.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}
                      className="text-sm transition-all duration-200"
                      style={{ color: '#a8a29e' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#dcb29c'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#a8a29e'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">تواصل معنا</h4>
            <ul className="space-y-3">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-sm" style={{ color: '#a8a29e' }}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#dcb29c' }} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm" style={{ borderTop: '1px solid #3a3a3a', color: '#a8a29e' }}>
          <p>© {new Date().getFullYear()} بوكيفاي. جميع الحقوق محفوظة.</p>
          <p>صنع في مصر 🇪🇬</p>
        </div>
      </div>
    </footer>
  );
}
