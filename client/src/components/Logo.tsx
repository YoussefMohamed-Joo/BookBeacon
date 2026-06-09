export default function Logo({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <img
      src="/logo.jpeg"
      alt="Book Beacon"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ borderRadius: '10px' }}
    />
  );
}
