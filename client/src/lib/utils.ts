// Format price as "XXX جنيه"
export const formatPrice = (price: number): string => {
  return `${price.toFixed(0)} جنيه`;
};

// Tailwind classes for grade badges
export const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'أولى ثانوي':
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    case 'تانية ثانوي':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    case 'تالتة ثانوي':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
  }
};

// Tailwind classes for order status badges
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'badge-warning';
    case 'payment_review':
      return 'badge-info';
    case 'approved':
      return 'badge-success';
    case 'ready_for_pickup':
      return 'badge-info';
    case 'rejected':
      return 'badge-danger';
    case 'not_started':
      return 'badge-info';
    case 'preparing':
      return 'badge-warning';
    case 'out_for_delivery':
      return 'badge-info';
    case 'delivered':
      return 'badge-success';
    default:
      return 'badge';
  }
};

// Arabic display text for order statuses
export const getStatusText = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'قيد الانتظار',
    payment_review: 'مراجعة الدفع',
    approved: 'تم الموافقة',
    ready_for_pickup: 'جاهز للاستلام',
    rejected: 'مرفوض',
    not_started: 'لم يبدأ',
    preparing: 'قيد التجهيز',
    out_for_delivery: 'خرج للتوصيل',
    delivered: 'تم التوصيل',
  };
  return map[status] || status;
};

// Arabic display text for delivery methods
export const getDeliveryMethodText = (method: string): string => {
  return method === 'pickup' ? 'استلام يد بيد' : 'توصيل';
};

// Simple Arabic-safe slug conversion
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// All 27 Egyptian governorates for delivery dropdowns
export const EGYPTIAN_GOVERNORATES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية',
  'القليوبية', 'الغربية', 'المنوفية', 'البحيرة', 'كفر الشيخ',
  'دمياط', 'بورسعيد', 'السويس', 'الإسماعيلية', 'المنيا',
  'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان',
  'الفيوم', 'بني سويف', 'مطروح', 'الوادي الجديد', 'جنوب سيناء', 'شمال سيناء',
];

export const GRADES = ['أولى ثانوي', 'تانية ثانوي', 'تالتة ثانوي'];
