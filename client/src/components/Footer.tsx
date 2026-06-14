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
  { icon: Phone, text: '01033558125 / 01285635691' },
  { icon: Mail, text: 'info@bookbeacon.com' },
  { icon: Clock, text: '٩ ص - ١٠ م يومياً' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy-dark)', borderTop: '1px solid var(--border)' }}>
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 no-underline">
              <Logo noLink showText={false} />
              <div>
                <span className="text-lg font-bold text-white">Book Beacon</span>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>بوك بيكون — منصة الكتب التعليمية</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
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
                    <Link to={link.path} className="text-sm transition-all duration-200" style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
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
                <li key={text} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <p>© {new Date().getFullYear()} Book Beacon <span style={{ color: 'var(--accent)' }}>by Yousef&Moaz</span>. جميع الحقوق محفوظة.</p>
          <p>صنع في مصر 🇪🇬</p>
        </div>
      </div>
    </footer>
  );
}
