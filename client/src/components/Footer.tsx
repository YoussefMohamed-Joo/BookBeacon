import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Logo from './Logo';

// Footer link groups
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

// Contact details
const contactInfo = [
  { icon: MapPin, text: 'بني سويف، مصر' },
  { icon: Phone, text: '01033558125' },
  { icon: Mail, text: 'info@bookbeacon.com' },
  { icon: Clock, text: '٩ ص - ١٠ م يومياً' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#071528', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <Logo size={42} />
              <div>
                <span className="text-lg font-bold text-white">Book Beacon</span>
                <p className="text-xs" style={{ color: '#AAB3C5' }}>بوك بيكون — منصة الكتب التعليمية</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: '#AAB3C5' }}>
              منصة متخصصة في بيع كتب الثانوية العامة في مصر. نقدم أفضل الكتب الدراسية مع أسرع توصيل لجميع المحافظات.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm transition-all duration-200" style={{ color: '#AAB3C5' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FFD84D'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#AAB3C5'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact info column */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">تواصل معنا</h4>
            <ul className="space-y-3">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-sm" style={{ color: '#AAB3C5' }}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#1E5EFF' }} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#AAB3C5' }}>
          <p>© {new Date().getFullYear()} Book Beacon. جميع الحقوق محفوظة.</p>
          <p>صنع في مصر 🇪🇬</p>
        </div>
      </div>
    </footer>
  );
}
