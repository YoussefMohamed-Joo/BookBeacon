import { Link } from 'react-router-dom';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';  // 28, 36, 52
  noLink?: boolean;
  className?: string;
}

export default function Logo({ showText = true, size = 'md', noLink = false, className = '' }: LogoProps) {
  const dim = size === 'sm' ? 28 : size === 'md' ? 36 : 52;
  const fontSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl';
  const subSize = size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px]' : 'text-xs';

  const svg = (
    <div className="relative shrink-0" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="6" width="32" height="36" rx="4" className="fill-primary-500" opacity="0.9" />
        <rect x="22" y="6" width="4" height="36" rx="1" className="fill-primary-700" />
        <rect x="12" y="10" width="8" height="28" rx="1" className="fill-primary-200" opacity="0.4" />
        <rect x="28" y="10" width="8" height="28" rx="1" className="fill-primary-200" opacity="0.4" />
        <path d="M24 2 L30 14 L18 14 Z" className="fill-amber-400" />
        <circle cx="24" cy="6" r="2" className="fill-amber-300" />
        <line x1="24" y1="2" x2="32" y2="0" className="stroke-amber-300" strokeWidth="1.5" opacity="0.6" />
        <line x1="24" y1="2" x2="16" y2="0" className="stroke-amber-300" strokeWidth="1.5" opacity="0.6" />
        <line x1="24" y1="2" x2="24" y2="0" className="stroke-amber-300" strokeWidth="1.5" opacity="0.8" />
      </svg>
    </div>
  );

  const textBlock = showText ? (
    <div className="flex flex-col leading-tight">
      <span className={`${fontSize} font-extrabold tracking-wide text-primary-500 group-hover:text-primary-600 transition-colors`}>
        BOOK BEACON
      </span>
      <span className={`${subSize} text-gray-400 font-medium`}>
        بوك بيكون
      </span>
    </div>
  ) : null;

  if (noLink) {
    return <div className={`flex items-center gap-2 ${className}`}>{svg}{textBlock}</div>;
  }

  return (
    <Link to="/" className={`flex items-center gap-2 no-underline group ${className}`}>
      {svg}{textBlock}
    </Link>
  );
}
