import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationsAPI } from '../lib/api';
import { useStore } from '../store/useStore';

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useStore();

  useEffect(() => {
    if (!user) return;
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await notificationsAPI.getUnreadCount();
      if (res.data.count !== undefined) setUnread(res.data.count);
    } catch {}
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await notificationsAPI.getAll({ limit: 20 });
      setNotifications(res.data.notifications || []);
    } catch {}
    setLoading(false);
  };

  const toggle = () => {
    if (!open) fetchAll();
    setOpen(!open);
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch {}
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order_created': return '🛒';
      case 'order_approved': return '✅';
      case 'order_rejected': return '❌';
      case 'payment_uploaded': return '💳';
      case 'payment_verified': return '✔️';
      case 'new_user': return '👤';
      case 'low_stock': return '📦';
      case 'fraud_alert': return '🚨';
      default: return '🔔';
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggle} className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute left-0 top-full mt-2 w-80 md:w-96 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-700 z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-100 dark:border-dark-700 flex items-center justify-between">
              <h4 className="font-bold text-sm">الإشعارات</h4>
              <div className="flex gap-1">
                {unread > 0 && (
                  <button onClick={handleMarkAllRead} className="text-[10px] px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-500 hover:bg-primary-100 transition-colors">
                    قراءة الكل
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400 text-sm">جاري التحميل...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">لا توجد إشعارات</div>
              ) : (
                notifications.map((n: any) => (
                  <div key={n._id} className={`p-3 border-b border-gray-50 dark:border-dark-700/50 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors ${!n.isRead ? 'bg-primary-50/30 dark:bg-primary-900/5' : ''}`}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg shrink-0 mt-0.5">{getIcon(n.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{n.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-gray-300 mt-1">{new Date(n.createdAt).toLocaleString('ar-EG')}</p>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {!n.isRead && (
                          <button onClick={() => handleMarkRead(n._id)} className="p-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-400 transition-colors" title="تحديد كمقروء">
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        {n.link && (
                          <Link to={n.link} onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-400 transition-colors" title="فتح">
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                        <button onClick={() => handleDelete(n._id)} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors" title="حذف">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
