export default function Logo({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="beamGrad" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d="M40 160V50c0-8 6-14 14-14h92c8 0 14 6 14 14v110" stroke="url(#logoGrad)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 50v110" stroke="url(#logoGrad)" strokeWidth="5" strokeLinecap="round" />
      <path d="M40 160h120" stroke="url(#logoGrad)" strokeWidth="5" strokeLinecap="round" />
      <path d="M54 78h92" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M54 94h92" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <path d="M54 110h60" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <circle cx="100" cy="42" r="18" fill="url(#logoGrad)" />
      <path d="M100 28 L104 38 L114 40 L107 47 L109 57 L100 51 L91 57 L93 47 L86 40 L96 38 Z" fill="white" />
      <path d="M100 60 L100 140" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M72 130 Q100 155 128 130" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M85 140 Q100 160 115 140" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}
