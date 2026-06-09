import { Truck } from 'lucide-react';

// Top announcement bar — shows shipping info across the full width
export default function TopBar() {
  return (
    <div
      className="h-9 flex items-center justify-center text-xs font-medium fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(30,94,255,0.12)',
        color: 'var(--accent)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Truck className="w-3.5 h-3.5 ml-1.5" />
      توصيل لجميع المحافظات — الدفع عند الاستلام
    </div>
  );
}
