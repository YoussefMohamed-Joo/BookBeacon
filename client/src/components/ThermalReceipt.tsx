import { useRef } from 'react';
import { formatPrice } from '../lib/utils';

interface ReceiptItem {
  titleAr: string;
  quantity: number;
  price: number;
}

interface ReceiptProps {
  items: ReceiptItem[];
  total: number;
  paidAmount: number;
  discount?: number;
  cashierName: string;
  customerName?: string;
  storeName?: string;
  onClose: () => void;
}

export default function ThermalReceipt({ items, total, paidAmount, discount = 0, cashierName, customerName, storeName = 'Book Beacon', onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = receiptRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '', 'width=400,height=600');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>فاتورة</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Alexandria', 'Segoe UI', Tahoma, sans-serif;
            width: 80mm;
            padding: 4mm 3mm;
            font-size: 10px;
            color: #000;
            background: #fff;
            direction: rtl;
          }
          .receipt-header { text-align: center; margin-bottom: 4mm; padding-bottom: 3mm; border-bottom: 1px dashed #000; }
          .receipt-logo { font-size: 18px; font-weight: 900; margin-bottom: 1mm; }
          .receipt-store-name { font-size: 14px; font-weight: 700; }
          .receipt-info { font-size: 9px; margin-top: 2mm; text-align: center; line-height: 1.6; }
          .receipt-divider { border-top: 1px dashed #000; margin: 3mm 0; }
          .receipt-table { width: 100%; border-collapse: collapse; }
          .receipt-table th { text-align: right; font-size: 8px; padding: 1mm 0; border-bottom: 1px solid #000; }
          .receipt-table td { padding: 1.5mm 0; font-size: 10px; vertical-align: top; }
          .receipt-table .item-name { max-width: 100px; overflow: hidden; }
          .receipt-table .item-qty { text-align: center; }
          .receipt-table .item-price { text-align: left; }
          .receipt-totals { margin-top: 3mm; }
          .receipt-totals table { width: 100%; }
          .receipt-totals td { padding: 1mm 0; font-size: 10px; }
          .receipt-totals .total-row td { font-size: 14px; font-weight: 900; padding-top: 2mm; border-top: 1px solid #000; }
          .receipt-footer { text-align: center; margin-top: 4mm; padding-top: 3mm; border-top: 1px dashed #000; font-size: 8px; line-height: 1.8; }
          .receipt-footer .warning { color: #c00; font-weight: 700; font-size: 9px; }
          .receipt-footer .thanks { margin-top: 2mm; font-size: 10px; font-weight: 700; }
          .no-print { display: none; }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() { window.print(); window.close(); }
        <\/script>
      </body>
      </html>
    `);
    win.document.close();
  };

  const dueAmount = total - paidAmount;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">معاينة الفاتورة</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">إلغاء</button>
        </div>

        {/* Receipt preview */}
        <div ref={receiptRef} className="bg-white text-black p-4 rounded-xl font-[Alexandria] text-right" style={{ fontFamily: 'Alexandria, sans-serif', direction: 'rtl', width: '80mm', margin: '0 auto' }}>
          <div className="text-center mb-3 pb-2" style={{ borderBottom: '1px dashed #000' }}>
            <div style={{ fontSize: '16px', fontWeight: 900 }}>📚</div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>{storeName}</div>
            <div style={{ fontSize: '8px', marginTop: '2px', lineHeight: 1.6 }}>
              <div>منصة كتب الثانوية العامة</div>
              <div>الكاشير: {cashierName}</div>
              <div>{new Date().toLocaleString('ar-EG')}</div>
            </div>
          </div>

          {customerName && (
            <div style={{ fontSize: '9px', marginBottom: '2mm' }}>العميل: {customerName}</div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: '8px', borderBottom: '1px solid #000' }}>
                <th style={{ textAlign: 'right', padding: '1mm 0' }}>الكتاب</th>
                <th style={{ textAlign: 'center', padding: '1mm 0' }}>العدد</th>
                <th style={{ textAlign: 'left', padding: '1mm 0' }}>السعر</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: '1.5mm 0', fontSize: '9px' }}>{item.titleAr}</td>
                  <td style={{ textAlign: 'center', padding: '1.5mm 0', fontSize: '10px' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'left', padding: '1.5mm 0', fontSize: '10px', whiteSpace: 'nowrap' }}>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '3mm' }}>
            <table style={{ width: '100%' }}>
              <tbody>
                {discount > 0 && (
                  <tr><td style={{ fontSize: '9px', padding: '0.5mm 0' }}>الخصم</td><td style={{ textAlign: 'left', fontSize: '9px', padding: '0.5mm 0' }}>{discount}%</td></tr>
                )}
                <tr><td style={{ fontSize: '9px', padding: '0.5mm 0' }}>المدفوع</td><td style={{ textAlign: 'left', fontSize: '9px', padding: '0.5mm 0' }}>{formatPrice(paidAmount)}</td></tr>
                {dueAmount > 0 && (
                  <tr><td style={{ fontSize: '9px', padding: '0.5mm 0' }}>المتبقي</td><td style={{ textAlign: 'left', fontSize: '9px', padding: '0.5mm 0' }}>{formatPrice(dueAmount)}</td></tr>
                )}
                <tr style={{ fontWeight: 900 }}>
                  <td style={{ fontSize: '13px', paddingTop: '2mm', borderTop: '1px solid #000' }}>الإجمالي</td>
                  <td style={{ textAlign: 'left', fontSize: '13px', paddingTop: '2mm', borderTop: '1px solid #000' }}>{formatPrice(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: 'center', marginTop: '4mm', paddingTop: '3mm', borderTop: '1px dashed #000', fontSize: '8px', lineHeight: 1.8 }}>
            <div style={{ color: '#c00', fontWeight: 700, fontSize: '9px' }}>
              ⚠ المكتبة غير مسؤولة عن ترجيع الكتاب بعد 3 أيام من تاريخ الفاتورة
            </div>
            <div style={{ marginTop: '2mm', fontSize: '9px', fontWeight: 700 }}>
              شكراً لثقتكم في {storeName} ❤️
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={handlePrint} className="flex-1 btn-primary text-sm justify-center">
            🖨️ طباعة الفاتورة
          </button>
          <button onClick={onClose} className="flex-1 btn-secondary text-sm justify-center">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
