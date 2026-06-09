import { useEffect, useRef, useState } from 'react';
import { X, Camera, Scan, Check, AlertTriangle } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<any>(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    let mounted = true;
    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!mounted || !videoRef.current) return;

        const scanner = new Html5Qrcode('barcode-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText: string) => {
            if (scanning) {
              setScanning(false);
              scanner.stop().catch(() => {});
              onScan(decodedText.trim());
            }
          },
          () => {}
        );
      } catch (err: any) {
        if (mounted) setError(err.message || 'تعذر تشغيل الكاميرا');
      }
    };

    initScanner();

    return () => {
      mounted = false;
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
      }
    };
  }, [scanning]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-900 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-700">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Scan className="w-5 h-5 text-primary-500" /> مسح الباركود
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div id="barcode-reader" ref={videoRef}
            className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative">
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-900/90">
                <div className="text-center p-4">
                  <Camera className="w-10 h-10 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            )}
            {!error && scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-32 border-2 border-primary-500 rounded-xl opacity-70" />
              </div>
            )}
            {!scanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-900/70">
                <div className="text-center">
                  <Check className="w-10 h-10 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-green-400">تم المسح!</p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input type="text" value={manualInput} onChange={(e) => setManualInput(e.target.value)}
              placeholder="أدخل الباركود يدوياً..."
              className="input-field text-sm flex-1" dir="ltr" />
            <button type="submit" className="btn-primary text-sm !px-4">
              بحث
            </button>
          </form>

          <button onClick={() => { setScanning(true); setError(''); setManualInput(''); }}
            className="btn-secondary w-full text-sm flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" /> إعادة المسح
          </button>
        </div>
      </div>
    </div>
  );
}
