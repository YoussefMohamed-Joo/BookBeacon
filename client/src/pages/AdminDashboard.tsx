import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../store/useStore';
import { dashboardAPI, ordersAPI, usersAPI, booksAPI, deliveryAPI, accountingAPI, aiAPI, blogAPI, reviewsAPI } from '../lib/api';
import { formatPrice, getStatusColor, getStatusText, getDeliveryMethodText, EGYPTIAN_GOVERNORATES, GRADES } from '../lib/utils';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, ShoppingBag, Users, BookOpen, Truck, BarChart3, Brain, Wallet, Star,
  Search, X, Check, Plus, Edit2, Trash2, Shield, TrendingUp, DollarSign, AlertTriangle,
  Package, Phone, MapPin, Hash, Upload, Image as ImageIcon, RefreshCw, Ban, Zap,
  ArrowUpDown, Filter, Clock, ChevronLeft, ChevronRight, Download, Eye, MessageSquare, Send, Calculator,
  Store, QrCode, Barcode, ClipboardList
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

type Tab = 'dashboard' | 'orders' | 'customers' | 'books' | 'delivery' | 'pickup' | 'accounting' | 'ai' | 'reviews';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useStore();

  const isCashier = user?.role === 'cashier';

  if (user?.role !== 'admin' && user?.role !== 'cashier') {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" /><p className="text-xl font-bold">غير مصرح به</p><p className="text-gray-400">هذه الصفحة للمشرفين والكاشير فقط</p></div></div>;
  }

  const allTabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة المعلومات' },
    { id: 'orders', icon: ShoppingBag, label: 'الطلبات' },
    { id: 'customers', icon: Users, label: 'العملاء' },
    { id: 'books', icon: BookOpen, label: 'الكتب' },
    { id: 'delivery', icon: Truck, label: 'التوصيل' },
    { id: 'pickup', icon: Store, label: 'حجوزات المنفذ' },
    { id: 'accounting', icon: Wallet, label: 'المحاسبة' },
    { id: 'ai', icon: Brain, label: 'الذكاء الاصطناعي' },
    { id: 'reviews', icon: Star, label: 'التقييمات' },
  ] as const;

  const cashierTabs = ['orders', 'customers'] as const;
  const tabs = isCashier ? allTabs.filter(t => cashierTabs.includes(t.id as any)) : allTabs;

  useEffect(() => {
    if (isCashier && !['orders', 'customers'].includes(activeTab)) {
      setActiveTab('orders');
    }
  }, [isCashier, activeTab]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1': e.preventDefault(); setActiveTab('dashboard'); break;
          case '2': e.preventDefault(); setActiveTab('orders'); break;
          case '3': e.preventDefault(); setActiveTab('customers'); break;
          case '4': e.preventDefault(); setActiveTab('books'); break;
          case '5': e.preventDefault(); setActiveTab('delivery'); break;
          case '6': e.preventDefault(); setActiveTab('pickup'); break;
          case '7': e.preventDefault(); setActiveTab('accounting'); break;
          case '8': e.preventDefault(); setActiveTab('ai'); break;
          case '9': e.preventDefault(); setActiveTab('reviews'); break;
          case 'b': e.preventDefault(); setSidebarOpen(p => !p); break;
        }
      }
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isCashier]);

  return (<>
    <Helmet><title>{isCashier ? 'الكاشير' : 'لوحة التحكم'} | Book Beacon</title></Helmet>
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-950">
      <div className="flex">
        <aside className={`fixed right-0 top-16 h-[calc(100vh-4rem)] z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-dark-900 border-l border-gray-100 dark:border-dark-800 overflow-hidden`}>
          <div className="p-3 overflow-y-auto h-full">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full p-2 mb-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all">
              <ChevronRight className={`w-5 h-5 text-gray-400 mx-auto transition-transform ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
            </button>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700'
                  }`}
                  title={!sidebarOpen ? tab.label : undefined}>
                  <tab.icon className="w-5 h-5 shrink-0" />
                  <span className={`transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{tab.label}</span>
                  <span className={`mr-auto text-[10px] text-gray-400 ${sidebarOpen ? 'opacity-60' : 'opacity-0 w-0 overflow-hidden'}`}>Ctrl+{tabs.indexOf(tab)+1}</span>
                </button>
              ))}
            </div>
            <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-dark-700 ${sidebarOpen ? '' : 'hidden'}`}>
              <p className="text-[10px] text-gray-400 px-3">Ctrl+B: إخفاء الشريط</p>
            </div>
          </div>
        </aside>

        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-16'}`}>
          <div className="animate-in">
            {!isCashier && activeTab === 'dashboard' && <DashboardPanel />}
            {activeTab === 'orders' && <OrdersPanel />}
            {activeTab === 'customers' && <CustomersPanel />}
            {!isCashier && activeTab === 'books' && <BooksPanel />}
            {!isCashier && activeTab === 'delivery' && <DeliveryPanel />}
            {!isCashier && activeTab === 'pickup' && <PickupPanel />}
            {!isCashier && activeTab === 'accounting' && <AccountingPanel />}
            {!isCashier && activeTab === 'ai' && <AIPanel />}
            {!isCashier && activeTab === 'reviews' && <ReviewsPanel />}
          </div>
        </main>
      </div>
    </div>
  </>);
}

function DashboardPanel() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetInput, setResetInput] = useState('');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = () => {
    setLoading(true);
    dashboardAPI.getStats().then((res) => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
  };

  const handleReset = async () => {
    try { await dashboardAPI.resetData(); toast.success('تم مسح جميع البيانات'); setShowReset(false); setResetStep(1); setResetInput(''); fetchStats(); }
    catch { toast.error('حدث خطأ'); }
  };

  if (loading) return <LoadingPanel />;
  if (!stats) return null;

  const cards = [
    { label: 'إجمالي الطلبات', value: stats.totalOrders, icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: 'الإيرادات', value: formatPrice(stats.totalRevenue || 0), icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { label: 'صافي الربح', value: formatPrice(stats.netProfit || 0), icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'طلبات معلقة', value: stats.pendingOrders, icon: AlertTriangle, color: 'from-amber-500 to-amber-600' },
    { label: 'تم التوصيل', value: stats.deliveredOrders || 0, icon: Truck, color: 'from-cyan-500 to-cyan-600' },
    { label: 'العملاء', value: stats.totalCustomers, icon: Users, color: 'from-pink-500 to-pink-600' },
  ];

  const monthlyData = (stats.monthlyRevenue || []).reverse().map((m: any) => ({
    name: `${m._id.month}/${m._id.year}`,
    income: m.income,
    expense: m.expense,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">لوحة المعلومات</h1>
          <p className="text-gray-500 dark:text-gray-400">نظرة عامة على أداء المتجر</p>
        </div>
        <button onClick={() => setShowReset(true)} className="btn-danger text-sm !py-2 flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> مسح البيانات
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`stat-card bg-gradient-to-br ${card.color}`}>
            <card.icon className="w-6 h-6 opacity-80 mb-2" />
            <p className="text-xs opacity-80">{card.label}</p>
            <p className="text-xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-semibold mb-4">الإيرادات والمصروفات (آخر 12 شهر)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="income" fill="#3b82f6" name="الإيرادات" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="المصروفات" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-4">توزيع الطلبات</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={stats.ordersByGrade || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label={({ _id, count }) => `${_id} (${count})`}>
                {(stats.ordersByGrade || []).map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">آخر الطلبات</h3>
          <span className="text-xs text-gray-400">إجمالي: {stats.totalOrders}</span>
        </div>
        <div className="space-y-2">
          {stats.recentOrders?.slice(0, 5).map((order: any) => (
            <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-500">
                  {order.user?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium">{order.book?.titleAr || 'كتاب'}</p>
                  <p className="text-xs text-gray-400">{order.user?.name} • {formatPrice(order.totalPrice)}</p>
                </div>
              </div>
              <span className={`text-xs ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showReset && (
          <div className="modal-overlay" onClick={() => setShowReset(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5" /> مسح جميع البيانات</h3>
              {resetStep === 1 && (
                <div className="space-y-4">
                  <div className="confirm-step"><p className="font-medium">الخطوة 1: هل أنت متأكد؟</p><p className="text-sm text-gray-500">سيتم حذف جميع الحركات المالية</p></div>
                  <button onClick={() => setResetStep(2)} className="btn-danger w-full">نعم، متأكد</button>
                  <button onClick={() => setShowReset(false)} className="btn-secondary w-full">إلغاء</button>
                </div>
              )}
              {resetStep === 2 && (
                <div className="space-y-4">
                  <div className="confirm-step"><p className="font-medium">الخطوة 2: هل أنت متأكد تماماً؟</p><p className="text-sm text-gray-500">لا يمكن التراجع عن هذا الإجراء</p></div>
                  <button onClick={() => setResetStep(3)} className="btn-danger w-full">نعم، متأكد تماماً</button>
                  <button onClick={() => { setResetStep(1); setShowReset(false); }} className="btn-secondary w-full">إلغاء</button>
                </div>
              )}
              {resetStep === 3 && (
                <div className="space-y-4">
                  <div className="confirm-step"><p className="font-medium">الخطوة 3: تأكيد نهائي</p><p className="text-sm text-gray-500">اكتب "RESET DATA" لتأكيد المسح</p>
                    <input type="text" value={resetInput} onChange={(e) => setResetInput(e.target.value)} className="input-field mt-2 text-sm" placeholder="RESET DATA" />
                  </div>
                  <button onClick={handleReset} disabled={resetInput !== 'RESET DATA'} className="btn-danger w-full" title={resetInput !== 'RESET DATA' ? 'اكتب RESET DATA' : ''}>تأكيد المسح النهائي</button>
                  <button onClick={() => { setResetStep(1); setShowReset(false); }} className="btn-secondary w-full">إلغاء</button>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [page, setPage] = useState(1);

  const fetchOrders = () => {
    setLoading(true);
    const params: any = { page, limit: 20 };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (deliveryFilter) params.deliveryStatus = deliveryFilter;
    ordersAPI.getAll(params).then((res) => { setOrders(res.data.orders); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, deliveryFilter, page]);

  const handleStatusUpdate = async (id: string, data: any) => {
    try { await ordersAPI.updateStatus(id, data); toast.success('تم تحديث الطلب'); fetchOrders(); setSelectedOrder(null); }
    catch { toast.error('حدث خطأ'); }
  };

  const handleInstantDelivery = async (id: string) => {
    try { await ordersAPI.instantDelivery(id); toast.success('تم التوصيل الفوري وإضافة الأرباح'); fetchOrders(); setSelectedOrder(null); }
    catch { toast.error('حدث خطأ'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">الطلبات</h1>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pr-10 py-2 text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field py-2 text-sm w-auto">
          <option value="">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="approved">تم الموافقة</option>
          <option value="rejected">مرفوض</option>
        </select>
        <select value={deliveryFilter} onChange={(e) => setDeliveryFilter(e.target.value)} className="input-field py-2 text-sm w-auto">
          <option value="">كل التوصيل</option>
          <option value="not_started">لم يبدأ</option>
          <option value="preparing">قيد التجهيز</option>
          <option value="out_for_delivery">خرج للتوصيل</option>
          <option value="delivered">تم التوصيل</option>
        </select>
      </div>

      {loading ? <LoadingPanel /> : orders.length === 0 ? (
        <div className="text-center py-16"><Package className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-400">لا توجد طلبات</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order: any) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="order-card cursor-pointer" onClick={() => setSelectedOrder(order)}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  <div><p className="text-xs text-gray-400 mb-1"><Hash className="w-3 h-3 inline" /> رقم الطلب</p><p className="text-sm font-medium">#{order._id.slice(-6)}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1"><Users className="w-3 h-3 inline" /> العميل</p><p className="text-sm font-medium truncate">{order.user?.name || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1"><Phone className="w-3 h-3 inline" /> الهاتف</p><p className="text-sm" dir="ltr">{order.user?.phone || order.deliveryDetails?.phone || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1"><BookOpen className="w-3 h-3 inline" /> الكتاب</p><p className="text-sm font-medium truncate">{order.book?.titleAr || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1"><MapPin className="w-3 h-3 inline" /> الصف</p><p className="text-sm">{order.grade || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1"><DollarSign className="w-3 h-3 inline" /> السعر</p><p className="text-sm font-medium text-primary-500">{formatPrice(order.totalPrice)}</p></div>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                  <span className={`text-xs ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
                  <span className={`text-xs ${getStatusColor(order.deliveryStatus)}`}>{getStatusText(order.deliveryStatus)}</span>
                  {order.isFraudFlagged && <span className="badge-danger text-xs"><AlertTriangle className="w-3 h-3 inline" /> احتيال</span>}
                </div>
              </div>

              {order.deliveryMethod === 'delivery' && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-700 flex flex-wrap gap-4 text-xs text-gray-400">
                  <span><MapPin className="w-3 h-3 inline" /> {order.deliveryDetails?.governorate}</span>
                  <span>{order.deliveryDetails?.address}</span>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-700 flex gap-2" onClick={(e) => e.stopPropagation()}>
                {order.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatusUpdate(order._id, { status: 'approved' })} className="btn-success text-xs !py-1.5 !px-3"><Check className="w-3 h-3 inline ml-1" /> موافقة</button>
                    <button onClick={() => handleStatusUpdate(order._id, { status: 'rejected' })} className="btn-danger text-xs !py-1.5 !px-3"><X className="w-3 h-3 inline ml-1" /> رفض</button>
                  </>
                )}
                {order.status === 'approved' && order.deliveryStatus !== 'delivered' && (
                  <>
                    <select onChange={(e) => handleStatusUpdate(order._id, { deliveryStatus: e.target.value })} className="input-field text-xs !py-1.5 w-auto" value={order.deliveryStatus}>
                      <option value="not_started">لم يبدأ</option>
                      <option value="preparing">قيد التجهيز</option>
                      <option value="out_for_delivery">خرج للتوصيل</option>
                      <option value="delivered">تم التوصيل</option>
                    </select>
                    <button onClick={() => handleInstantDelivery(order._id)} className="btn-primary text-xs !py-1.5 !px-3 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> توصيل فوري
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">تفاصيل الطلب #{selectedOrder._id.slice(-6)}</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">العميل</p><p className="font-medium">{selectedOrder.user?.name}</p><p className="text-xs text-gray-400">{selectedOrder.user?.email}</p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">الهاتف</p><p className="font-medium" dir="ltr">{selectedOrder.user?.phone || selectedOrder.deliveryDetails?.phone || 'N/A'}</p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">الكتاب</p><p className="font-medium">{selectedOrder.book?.titleAr}</p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">الإجمالي</p><p className="font-medium text-primary-500">{formatPrice(selectedOrder.totalPrice)}</p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">الكمية</p><p className="font-medium">{selectedOrder.quantity}</p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">الحالة</p><span className={`text-xs ${getStatusColor(selectedOrder.status)}`}>{getStatusText(selectedOrder.status)}</span><br/><span className={`text-xs ${getStatusColor(selectedOrder.deliveryStatus)}`}>{getStatusText(selectedOrder.deliveryStatus)}</span></div>
                </div>

                {selectedOrder.deliveryMethod === 'delivery' && (
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-2">بيانات التوصيل</p>
                    <p className="text-sm"><MapPin className="w-4 h-4 inline ml-1" />{selectedOrder.deliveryDetails?.governorate} - {selectedOrder.deliveryDetails?.center}</p>
                    <p className="text-sm">{selectedOrder.deliveryDetails?.address}</p>
                    <p className="text-sm"><Phone className="w-4 h-4 inline ml-1" />{selectedOrder.deliveryDetails?.phone}</p>
                  </div>
                )}

                {selectedOrder.paymentProof?.imageUrl && (
                  <div><p className="text-xs text-gray-400 mb-2">إيصال الدفع</p><img src={selectedOrder.paymentProof.imageUrl} alt="receipt" className="w-full rounded-xl border border-gray-100 dark:border-dark-700" /></div>
                )}

                {selectedOrder.isFraudFlagged && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center gap-2 text-sm text-red-600"><AlertTriangle className="w-4 h-4" />{selectedOrder.fraudReason}</div>
                )}

                <div className="flex gap-2">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatusUpdate(selectedOrder._id, { status: 'approved' })} className="flex-1 btn-success text-sm"><Check className="w-4 h-4 inline ml-1" />موافقة</button>
                      <button onClick={() => handleStatusUpdate(selectedOrder._id, { status: 'rejected' })} className="flex-1 btn-danger text-sm"><X className="w-4 h-4 inline ml-1" />رفض</button>
                    </>
                  )}
                  {selectedOrder.status === 'approved' && selectedOrder.deliveryStatus !== 'delivered' && (
                    <button onClick={() => handleInstantDelivery(selectedOrder._id)} className="flex-1 btn-primary text-sm"><Zap className="w-4 h-4 inline ml-1" />توصيل فوري</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteInput, setDeleteInput] = useState('');

  const fetchUsers = () => { setLoading(true); usersAPI.getAll({ search }).then((res) => { setUsers(res.data.users); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchUsers(); }, [search]);

  const handleBlock = async (id: string) => { try { await usersAPI.toggleBlock(id); toast.success('تم'); fetchUsers(); } catch { toast.error('خطأ'); } };

  const handleDeleteAll = async () => {
    try { await usersAPI.deleteAll(); toast.success('تم حذف جميع العملاء'); setShowDelete(false); setDeleteStep(1); setDeleteInput(''); fetchUsers(); }
    catch { toast.error('حدث خطأ'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl md:text-3xl font-bold">العملاء</h1><p className="text-gray-400 text-sm">إدارة العملاء</p></div>
        <button onClick={() => setShowDelete(true)} className="btn-danger text-sm !py-2"><Trash2 className="w-4 h-4 inline ml-1" />حذف الكل</button>
      </div>
      <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pr-10 py-2 text-sm" /></div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>الاسم</th><th>البريد</th><th>الهاتف</th><th>النقاط</th><th>الطلبات</th><th>الحالة</th><th>إجراءات</th></tr></thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u._id}>
                  <td className="font-medium">{u.name}</td>
                  <td className="text-xs text-gray-400">{u.email}</td>
                  <td className="text-xs" dir="ltr">{u.phone}</td>
                  <td>{u.loyaltyPoints}</td>
                  <td>{u.totalOrders || 0}</td>
                  <td>{u.isBlocked ? <span className="badge-danger text-xs">محظور</span> : <span className="badge-success text-xs">نشط</span>}</td>
                  <td><button onClick={() => handleBlock(u._id)} className={`text-xs ${u.isBlocked ? 'text-green-500' : 'text-red-500'} hover:underline`}>{u.isBlocked ? 'إلغاء الحظر' : 'حظر'}</button></td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={7} className="text-center text-gray-400 py-8">لا يوجد عملاء</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showDelete && (
          <div className="modal-overlay" onClick={() => setShowDelete(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5" /> حذف جميع العملاء</h3>
              {deleteStep === 1 && (
                <div className="space-y-4">
                  <div className="confirm-step"><p className="font-medium">تحذير: هذا الإجراء نهائي!</p><p className="text-sm text-gray-500">سيتم حذف جميع العملاء وطلباتهم</p></div>
                  <button onClick={() => setDeleteStep(2)} className="btn-danger w-full">نعم، متأكد</button>
                  <button onClick={() => setShowDelete(false)} className="btn-secondary w-full">إلغاء</button>
                </div>
              )}
              {deleteStep >= 2 && deleteStep < 5 && (
                <div className="space-y-4">
                  <div className="confirm-step"><p className="font-medium">الخطوة {deleteStep} من 5</p><p className="text-sm text-gray-500">هل أنت متأكد من رغبتك في حذف جميع العملاء؟</p></div>
                  <button onClick={() => setDeleteStep(deleteStep + 1)} className="btn-danger w-full">تأكيد {deleteStep}</button>
                  <button onClick={() => { setDeleteStep(1); setShowDelete(false); }} className="btn-secondary w-full">إلغاء</button>
                </div>
              )}
              {deleteStep === 5 && (
                <div className="space-y-4">
                  <div className="confirm-step"><p className="font-medium">الخطوة الأخيرة: التأكيد النهائي</p><p className="text-sm text-gray-500">اكتب "DELETE ALL" لتأكيد الحذف</p>
                    <input type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} className="input-field mt-2 text-sm" placeholder="DELETE ALL" />
                  </div>
                  <button onClick={handleDeleteAll} disabled={deleteInput !== 'DELETE ALL'} className="btn-danger w-full">تأكيد الحذف النهائي</button>
                  <button onClick={() => { setDeleteStep(1); setShowDelete(false); }} className="btn-secondary w-full">إلغاء</button>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BooksPanel() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', titleAr: '', grade: 'أولى ثانوي', subject: '', teacher: '', price: 250, costPrice: 0, stock: 50, description: '', descriptionAr: '', keywords: '' });

  const fetchBooks = () => { setLoading(true); booksAPI.getAll({ limit: 100 }).then((res) => { setBooks(res.data.books); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchBooks(); }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { toast.error('يُسمح فقط بملفات JPG, PNG, WebP'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error('الحد الأقصى 2MB'); return; }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (selectedFile) fd.append('image', selectedFile);

      if (editBook) { await booksAPI.update(editBook._id, fd); toast.success('تم تحديث الكتاب'); }
      else { await booksAPI.create(fd); toast.success('تم إنشاء الكتاب'); }
      setShowForm(false); setEditBook(null); setSelectedFile(null); setImagePreview(null);
      fetchBooks();
    } catch { toast.error('حدث خطأ'); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد من حذف هذا الكتاب؟')) return; try { await booksAPI.delete(id); toast.success('تم الحذف'); fetchBooks(); } catch { toast.error('خطأ'); } };

  const openEdit = (b: any) => {
    setEditBook(b);
    setForm({ title: b.title, titleAr: b.titleAr, grade: b.grade, subject: b.subject, teacher: b.teacher || '', price: b.price, costPrice: b.costPrice || 0, stock: b.stock, description: b.description || '', descriptionAr: b.descriptionAr || '', keywords: b.keywords || '' });
    if (b.image) setImagePreview(b.image);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl md:text-3xl font-bold">الكتب</h1><p className="text-gray-400 text-sm">إدارة الكتب والمخزون</p></div>
        <button onClick={() => { setEditBook(null); setForm({ title: '', titleAr: '', grade: 'أولى ثانوي', subject: '', teacher: '', price: 250, costPrice: 0, stock: 50, description: '', descriptionAr: '', keywords: '' }); setImagePreview(null); setSelectedFile(null); setShowForm(true); }} className="btn-primary text-sm"><Plus className="w-4 h-4 inline ml-1" />إضافة كتاب</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">{editBook ? 'تعديل كتاب' : 'إضافة كتاب جديد'}</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">صورة الكتاب</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-32 rounded-xl bg-gray-100 dark:bg-dark-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-dark-600">
                      {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" /> : <ImageIcon className="w-8 h-8 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <label className="btn-secondary text-sm cursor-pointer inline-block"><Upload className="w-4 h-4 inline ml-1" />اختر صورة<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" /></label>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP - حد أقصى 2MB</p>
                    </div>
                  </div>
                </div>
                <input type="text" placeholder="English Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field text-sm" required />
                <input type="text" placeholder="العنوان بالعربي" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className="input-field text-sm" required />
                <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="input-field text-sm">{GRADES.map((g) => (<option key={g} value={g}>{g}</option>))}</select>
                <input type="text" placeholder="المادة" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field text-sm" required />
                <input type="text" placeholder="اسم المدرس" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} className="input-field text-sm" />
                <input type="number" placeholder="سعر البيع" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input-field text-sm" required />
                {form.price > 0 && <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-amber-600 text-sm"><span>المقدم (١٠٪): {Math.round(form.price * 0.1)} ج.م</span></div>}
                <input type="number" placeholder="سعر التكلفة" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })} className="input-field text-sm" />
                <input type="number" placeholder="المخزون" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input-field text-sm" />
                <div className="md:col-span-2"><textarea placeholder="الوصف بالعربي" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} className="input-field text-sm" rows={2} /></div>
                <div className="md:col-span-2"><input type="text" placeholder="كلمات مفتاحية (SEO)" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="input-field text-sm" /></div>
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" className="flex-1 btn-primary text-sm">{editBook ? 'تحديث' : 'إضافة'}</button>
                  <button type="button" onClick={() => { setShowForm(false); setSelectedFile(null); setImagePreview(null); }} className="flex-1 btn-secondary text-sm">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>الكتاب</th><th>المدرس</th><th>الصف</th><th>المقدم</th><th>سعر البيع</th><th>التكلفة</th><th>الربح</th><th>المخزون</th><th>المبيعات</th><th>إجراءات</th></tr></thead>
            <tbody>
              {books.map((b: any) => {
                const profit = b.price - (b.costPrice || 0);
                return (
                  <tr key={b._id}>
                    <td><p className="font-medium">{b.titleAr}</p><span className="text-xs text-gray-400">{b.subject}</span></td>
                    <td className="text-xs">{b.teacher || '-'}</td>
                    <td className="text-xs">{b.grade}</td>
                    <td className="text-amber-500 text-xs">{formatPrice(b.deposit || Math.round(b.price * 0.1))}</td>
                    <td className="text-green-500 font-medium">{formatPrice(b.price)}</td>
                    <td className="text-red-400">{b.costPrice ? formatPrice(b.costPrice) : '-'}</td>
                    <td className={profit > 0 ? 'text-emerald-500 font-medium' : 'text-gray-400'}>{profit > 0 ? formatPrice(profit) : '-'}</td>
                    <td><span className={b.stock > 10 ? 'text-green-500' : b.stock > 0 ? 'text-yellow-500' : 'text-red-500'}>{b.stock}</span></td>
                    <td>{b.salesCount}</td>
                    <td><div className="flex gap-2"><button onClick={() => openEdit(b)} className="text-blue-500 hover:underline text-xs"><Edit2 className="w-3 h-3 inline" /></button><button onClick={() => handleDelete(b._id)} className="text-red-500 hover:underline text-xs"><Trash2 className="w-3 h-3 inline" /></button></div></td>
                  </tr>
                );
              })}
              {books.length === 0 && <tr><td colSpan={10} className="text-center text-gray-400 py-8">لا توجد كتب</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DeliveryPanel() {
  const [prices, setPrices] = useState<any[]>([]);
  const [governorate, setGovernorate] = useState('');
  const [price, setPrice] = useState(30);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(0);

  const fetchPrices = () => { deliveryAPI.getAll().then((res) => setPrices(res.data)).catch(() => {}); };
  useEffect(() => { fetchPrices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!governorate) return; try { await deliveryAPI.setPrice({ governorate, price }); toast.success('تم'); fetchPrices(); setGovernorate(''); } catch { toast.error('خطأ'); } };

  const handleEdit = async (id: string) => { try { await deliveryAPI.setPrice({ governorate: prices.find((p) => p._id === id)?.governorate, price: editPrice }); toast.success('تم التحديث'); setEditId(null); fetchPrices(); } catch { toast.error('خطأ'); } };

  const handleDelete = async (id: string) => { try { await deliveryAPI.delete(id); fetchPrices(); } catch { toast.error('خطأ'); } };

  const minPrice = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices.map((p) => p.price)) : 0;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl md:text-3xl font-bold">أسعار التوصيل</h1><p className="text-gray-400 text-sm">إدارة أسعار التوصيل حسب المحافظة</p></div>

      <div className="card p-4 bg-gradient-to-l from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/10 border-primary-200 dark:border-primary-800">
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
          <Truck className="w-5 h-5" />
          <span className="font-medium">توصيل أسرع داخل بني سويف</span>
        </div>
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span>أقل سعر: {formatPrice(minPrice)}</span>
          <span>أعلى سعر: {formatPrice(maxPrice)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">
        <select value={governorate} onChange={(e) => setGovernorate(e.target.value)} className="input-field text-sm flex-1 min-w-[200px]">
          <option value="">اختر المحافظة</option>
          {EGYPTIAN_GOVERNORATES.filter((g) => !prices.find((p) => p.governorate === g)).map((g) => (<option key={g} value={g}>{g}</option>))}
        </select>
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input-field text-sm w-24" min="0" />
        <button type="submit" className="btn-primary text-sm"><Plus className="w-4 h-4 inline ml-1" />إضافة</button>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>المحافظة</th><th>السعر</th><th>إجراءات</th></tr></thead>
            <tbody>
              {prices.map((p: any) => (
                <tr key={p._id}>
                  <td className="font-medium">{p.governorate}</td>
                  <td>
                    {editId === p._id ? (
                      <div className="flex gap-2 items-center">
                        <input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="input-field text-sm w-20 !py-1" />
                        <button onClick={() => handleEdit(p._id)} className="text-green-500 text-xs hover:underline">حفظ</button>
                        <button onClick={() => setEditId(null)} className="text-gray-400 text-xs hover:underline">إلغاء</button>
                      </div>
                    ) : (
                      <span>{formatPrice(p.price)}</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditId(p._id); setEditPrice(p.price); }} className="text-blue-500 hover:underline text-xs"><Edit2 className="w-3 h-3 inline" /></button>
                      <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline text-xs"><Trash2 className="w-3 h-3 inline" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {prices.length === 0 && <tr><td colSpan={3} className="text-center text-gray-400 py-8">لا توجد أسعار توصيل</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PickupPanel() {
  const [pickups, setPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPickups = async () => {
    try {
      const res = await deliveryAPI.getPickups();
      setPickups(res.data);
    } catch { toast.error('خطأ في جلب الحجوزات'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPickups(); }, []);

  const handleStatus = async (id: string, status: string) => {
    try {
      await deliveryAPI.updatePickupStatus(id, status);
      toast.success('تم تحديث حالة الحجز');
      fetchPickups();
    } catch { toast.error('خطأ في التحديث'); }
  };

  const filtered = pickups.filter((o: any) => {
    if (statusFilter !== 'all' && o.deliveryStatus !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const user = o.user || {};
      const book = o.book || {};
      if ((user.name || '').toLowerCase().includes(q)) return true;
      if ((user.phone || '').includes(q)) return true;
      if ((book.titleAr || '').includes(q)) return true;
    }
    return true;
  });

  const statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'not_started', label: 'قيد المراجعة' },
    { value: 'preparing', label: 'قيد التجهيز' },
    { value: 'out_for_delivery', label: 'جاهز للاستلام' },
    { value: 'delivered', label: 'تم الاستلام' },
  ];

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">حجوزات المنفذ</h1>
          <p className="text-gray-400 text-sm">إدارة حجوزات الاستلام من المنفذ — بني سويف، الاباصيري الجديد، خلف كازيون</p>
        </div>
      </div>

      <div className="card p-4 bg-gradient-to-l from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <Store className="w-5 h-5" />
          <span className="font-medium">منفذ الاستلام: بني سويف — الاباصيري الجديد — خلف كازيون</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">ساعات العمل: ٩ ص — ١٠ م يومياً</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم العميل، رقم الهاتف، أو الكتاب..."
            className="input-field pr-10 text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field text-sm w-auto">
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>العميل</th>
                <th>الهاتف</th>
                <th>الكتاب</th>
                <th>المبلغ</th>
                <th>المتبقي</th>
                <th>إثبات الدفع</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order: any) => {
                const deposit = Math.round(order.totalPrice * 0.1);
                const remaining = order.totalPrice - deposit;
                return (
                  <tr key={order._id}>
                    <td className="font-medium">{order.user?.name || '—'}</td>
                    <td className="text-xs" dir="ltr">{order.user?.phone || '—'}</td>
                    <td>{order.book?.titleAr || order.book?.title || '—'}</td>
                    <td>{order.totalPrice} ج.م</td>
                    <td className="text-amber-600 font-medium">{remaining} ج.م</td>
                    <td>
                      {order.paymentProof?.imageUrl ? (
                        <a href={order.paymentProof.imageUrl} target="_blank" rel="noopener noreferrer"
                          className="text-primary-500 hover:underline text-xs flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> عرض الإثبات
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        order.deliveryStatus === 'out_for_delivery' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        order.deliveryStatus === 'preparing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {order.deliveryStatus === 'not_started' ? 'قيد المراجعة' :
                         order.deliveryStatus === 'preparing' ? 'قيد التجهيز' :
                         order.deliveryStatus === 'out_for_delivery' ? 'جاهز للاستلام' :
                         order.deliveryStatus === 'delivered' ? 'تم الاستلام' : order.deliveryStatus}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1.5 flex-wrap">
                        {order.deliveryStatus === 'not_started' && (
                          <button onClick={() => handleStatus(order._id, 'preparing')}
                            className="text-xs px-2 py-1 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-400 transition-colors">
                            بدء التجهيز
                          </button>
                        )}
                        {order.deliveryStatus === 'preparing' && (
                          <button onClick={() => handleStatus(order._id, 'out_for_delivery')}
                            className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 transition-colors">
                            جاهز للاستلام
                          </button>
                        )}
                        {order.deliveryStatus === 'out_for_delivery' && (
                          <button onClick={() => handleStatus(order._id, 'delivered')}
                            className="text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 transition-colors">
                            تأكيد الاستلام
                          </button>
                        )}
                        {order.deliveryStatus === 'delivered' && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" /> تم
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center text-gray-400 py-12">لا توجد حجوزات</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-2">إجراءات الاستلام</h3>
        <ol className="text-sm text-gray-500 space-y-1 list-decimal list-inside">
          <li>العميل يحضر إلى المنفذ: بني سويف — الاباصيري الجديد — خلف كازيون</li>
          <li>تأكد من إثبات الدفع (الصورة ورقم الهاتف)</li>
          <li>استلام المبلغ المتبقي نقداً</li>
          <li>اضغط "تأكيد الاستلام" لإكمال العملية</li>
        </ol>
      </div>
    </div>
  );
}

function AccountingPanel() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [txForm, setTxForm] = useState({ type: 'income', amount: 0, category: '', description: '' });
  const [calcDisplay, setCalcDisplay] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [calcOp, setCalcOp] = useState('');
  const [calcPrev, setCalcPrev] = useState('');

  const handleCalcBtn = (btn: string) => {
    if (btn === '=') {
      try {
        const expr = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        const result = Function(`"use strict"; return (${expr})`)();
        setCalcResult(result.toString());
        setCalcDisplay(result.toString());
      } catch { setCalcResult('خطأ'); }
    } else if (['+', '-', '×', '÷'].includes(btn)) {
      setCalcDisplay(prev => prev + ' ' + btn + ' ');
    } else {
      setCalcDisplay(prev => prev + btn);
    }
  };

  const fetchData = () => { setLoading(true); accountingAPI.getOverview().then((res) => { setOverview(res.data); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const handleAddTx = async (e: React.FormEvent) => { e.preventDefault(); try { await accountingAPI.createTransaction(txForm); toast.success('تم'); setShowForm(false); fetchData(); } catch { toast.error('خطأ'); } };

  if (loading) return <LoadingPanel />;

  const profitData = overview?.dailyProfit?.map((d: any) => ({ name: d._id, profit: d.income - d.expense })) || [];
  const margin = overview?.totalRevenue > 0 ? ((overview.netProfit / overview.totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl md:text-3xl font-bold">المحاسبة</h1><p className="text-gray-400 text-sm">تتبع الإيرادات والمصروفات والأرباح</p></div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><Plus className="w-4 h-4 inline ml-1" />إضافة حركة</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border-emerald-500/30"><p className="text-sm text-gray-400 mb-1">الإيرادات</p><p className="text-2xl font-bold text-emerald-500">{formatPrice(overview?.totalRevenue || 0)}</p></div>
        <div className="card p-5 border-red-500/30"><p className="text-sm text-gray-400 mb-1">المصروفات</p><p className="text-2xl font-bold text-red-400">{formatPrice(overview?.totalExpenses || 0)}</p></div>
        <div className="card p-5 border-primary-500/30"><p className="text-sm text-gray-400 mb-1">صافي الربح</p><p className={`text-2xl font-bold ${(overview?.netProfit || 0) >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>{formatPrice(overview?.netProfit || 0)}</p></div>
        <div className="card p-5 border-purple-500/30"><p className="text-sm text-gray-400 mb-1">هامش الربح</p><p className="text-2xl font-bold text-purple-400">{margin}%</p></div>
      </div>

      {/* Accounting Calculator */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Calculator className="w-5 h-5 text-primary-500" /> الآلة الحاسبة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-50 dark:bg-dark-800/50 rounded-2xl p-4">
              <div className="bg-white dark:bg-dark-700 rounded-xl p-3 mb-3 text-left font-mono text-2xl font-bold min-h-[48px]" dir="ltr">{calcDisplay || '0'}</div>
              <div className="grid grid-cols-4 gap-2">
                {['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','=','+'].map((btn) => (
                  <button key={btn} onClick={() => handleCalcBtn(btn)}
                    className={`p-3 rounded-xl text-lg font-bold transition-all ${
                      ['÷','×','-','+','='].includes(btn)
                        ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
                        : btn === '0' ? 'col-span-2 bg-gray-200 dark:bg-dark-600 hover:bg-gray-300 dark:hover:bg-dark-500'
                        : 'bg-gray-200 dark:bg-dark-600 hover:bg-gray-300 dark:hover:bg-dark-500'
                    }`}
                  >{btn}</button>
                ))}
                <button onClick={() => { setCalcDisplay(''); setCalcResult(''); setCalcOp(''); setCalcPrev(''); }} className="col-span-4 p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">مسح</button>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">حسابات سريعة</h4>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl flex items-center justify-between">
                <span className="text-sm">متوسط سعر الكتاب</span>
                <span className="font-bold text-primary-500">{overview?.totalBooks > 0 ? formatPrice(Math.round((overview?.totalRevenue || 0) / overview?.totalBooks)) : '-'}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl flex items-center justify-between">
                <span className="text-sm">متوسط الربح لكل طلب</span>
                <span className="font-bold text-emerald-500">{overview?.totalOrders > 0 ? formatPrice(Math.round((overview?.netProfit || 0) / overview?.totalOrders)) : '-'}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl flex items-center justify-between">
                <span className="text-sm">نسبة المصروفات</span>
                <span className="font-bold text-amber-500">{overview?.totalRevenue > 0 ? `${((overview?.totalExpenses || 0) / overview?.totalRevenue * 100).toFixed(1)}%` : '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">الربح على الوقت</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={profitData}>
              <defs><linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} fill="url(#profitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">المصروفات حسب الفئة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={(overview?.profitByCategory || []).filter((c: any) => c._id !== null && c.total > 0)} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label={({ _id, total }) => `${_id} (${total})`}>
                {(overview?.profitByCategory || []).map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">آخر الحركات المالية</h3>
        <div className="space-y-2">
          {overview?.recentTransactions?.slice(0, 10).map((tx: any) => (
            <div key={tx._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
              <div><p className="text-sm font-medium">{tx.description || tx.category}</p><p className="text-xs text-gray-400">{tx.category} • {new Date(tx.createdAt).toLocaleDateString('ar-EG')}</p></div>
              <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>{tx.type === 'income' ? '+' : '-'}{tx.amount} جنيه</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">إضافة حركة مالية</h3>
              <form onSubmit={handleAddTx} className="space-y-3">
                <select value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value })} className="input-field text-sm"><option value="income">إيراد</option><option value="expense">مصروف</option></select>
                <input type="number" placeholder="المبلغ" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: Number(e.target.value) })} className="input-field text-sm" required />
                <input type="text" placeholder="الفئة" value={txForm.category} onChange={(e) => setTxForm({ ...txForm, category: e.target.value })} className="input-field text-sm" required />
                <input type="text" placeholder="الوصف" value={txForm.description} onChange={(e) => setTxForm({ ...txForm, description: e.target.value })} className="input-field text-sm" />
                <button type="submit" className="btn-primary w-full text-sm">إضافة</button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AIPanel() {
  const [insights, setInsights] = useState<any>(null);
  const [accInsights, setAccInsights] = useState<any>(null);
  const [fraudData, setFraudData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'مرحباً! أنا مساعدك الذكي. اسألني عن الكتب، المبيعات، الأرباح، المخزون، أو أي شيء يتعلق بمتجرك.' }
  ]);
  const [queryLoading, setQueryLoading] = useState(false);

  useEffect(() => {
    Promise.all([aiAPI.getSalesInsights(), aiAPI.getAccountingInsights(), aiAPI.detectFraud()])
      .then(([sales, acc, fraud]) => { setInsights(sales.data); setAccInsights(acc.data); setFraudData(fraud.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setQueryLoading(true);
    try {
      const res = await aiAPI.adminQuery(question);
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، حدث خطأ في معالجة السؤال' }]);
    }
    setQueryLoading(false);
    setQuestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); }
  };

  const suggestedQuestions = [
    'ما هي أفضل الكتب مبيعاً؟',
    'كم عدد الطلبات المعلقة؟',
    'ما هو صافي الربح؟',
    'ما الكتب الأقل مبيعاً؟',
    'عاوز اعرف ربح كتاب معين',
    'كم كتاب عندي في المخزون؟',
    'عاوز تقرير كامل عن المتجر',
    'ايه الكتب اللي مخزونها قليل؟',
  ];

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">الذكاء الاصطناعي</h1>

      {/* AI Chat Box */}
      <div className="card p-4 md:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-primary-500" /> اسأل المساعد الذكي</h3>
        <div className="h-[400px] overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 dark:bg-dark-800/50 rounded-2xl">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white rounded-tr-sm'
                  : 'bg-white dark:bg-dark-700 shadow-sm rounded-tl-sm border border-gray-100 dark:border-dark-600'
              }`}>
                {msg.text.split('\n').map((line, j) => (
                  <p key={j} className={j > 0 ? 'mt-1.5' : ''}>{line || '\u00A0'}</p>
                ))}
              </div>
            </div>
          ))}
          {queryLoading && (
            <div className="flex justify-end">
              <div className="bg-white dark:bg-dark-700 shadow-sm rounded-2xl rounded-tl-sm p-4 border border-gray-100 dark:border-dark-600">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedQuestions.map((sq, i) => (
            <button key={i} onClick={() => { setQuestion(sq); }} className="text-xs px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-500 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-all border border-gray-200 dark:border-dark-600">
              {sq}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="اسأل عن الكتب، المبيعات، الأرباح، المخزون..."
            className="input-field flex-1 rounded-2xl"
            disabled={queryLoading}
          />
          <button onClick={handleAsk} disabled={queryLoading || !question.trim()} className="btn-primary rounded-2xl px-5">
            {queryLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Dashboard Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary-500" /> تحليلات المبيعات</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">إجمالي الكتب</p><p className="font-bold">{insights?.totalBooks}</p></div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">إجمالي الطلبات</p><p className="font-bold">{insights?.totalOrders}</p></div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">مقبولة</p><p className="font-bold text-green-500">{insights?.approvedOrders}</p></div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">معلقة</p><p className="font-bold text-yellow-500">{insights?.pendingOrders}</p></div>
          </div>
          <h4 className="font-medium text-sm mb-2">أفضل الكتب مبيعاً</h4>
          {insights?.bestSellers?.map((b: any, i: number) => (
            <div key={i} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-dark-700/50 rounded-lg mb-1"><span>{i + 1}. {b.titleAr}</span><span className="text-gray-400">{b.salesCount} مبيعات</span></div>
          ))}
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary-500" /> تحليلات المحاسبة</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-center"><p className="text-xs text-gray-400">الإيرادات</p><p className="font-bold text-green-500 text-sm">{formatPrice(accInsights?.totalRevenue || 0)}</p></div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-center"><p className="text-xs text-gray-400">المصروفات</p><p className="font-bold text-red-400 text-sm">{formatPrice(accInsights?.totalExpenses || 0)}</p></div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-center"><p className="text-xs text-gray-400">الهامش</p><p className="font-bold text-sm">{accInsights?.profitMargin || 0}%</p></div>
          </div>
          {accInsights?.expenseCategories?.map((c: any, i: number) => (
            <div key={i} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-dark-700/50 rounded-lg mb-1"><span>{c._id}</span><span className="text-gray-400">{c.total} جنيه</span></div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary-500" /> كشف الاحتيال</h3>
        {fraudData?.fraudAlerts?.length > 0 ? (
          <div className="space-y-2">{fraudData.fraudAlerts.map((alert: any, i: number) => (
            <div key={i} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center gap-2 text-sm"><AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />{alert.reason}<span className={`text-xs ${alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`}>{alert.severity === 'high' ? 'عالي' : 'متوسط'}</span></div>
          ))}</div>
        ) : <p className="text-sm text-gray-400">لا توجد تنبيهات احتيال حالياً ✓</p>}
        <p className="text-xs text-gray-400 mt-2">آخر فحص: {fraudData?.totalChecked || 0} طلب</p>
      </div>
    </div>
  );
}

function ReviewsPanel() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchReviews = () => { setLoading(true); reviewsAPI.getAll().then((res) => { setReviews(res.data); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchReviews(); }, []);
  const handleApprove = async (id: string) => { try { await reviewsAPI.approve(id); toast.success('تم'); fetchReviews(); } catch { toast.error('خطأ'); } };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">التقييمات</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>المستخدم</th><th>الكتاب</th><th>التقييم</th><th>التعليق</th><th>الحالة</th><th>إجراءات</th></tr></thead>
            <tbody>
              {reviews.map((r: any) => (
                <tr key={r._id}>
                  <td className="font-medium">{r.user?.name}</td>
                  <td>{r.book?.titleAr}</td>
                  <td>{'⭐'.repeat(r.rating)}</td>
                  <td className="text-xs text-gray-400 max-w-xs truncate">{r.comment}</td>
                  <td>{r.isApproved ? <span className="badge-success text-xs">مقبول</span> : <span className="badge-warning text-xs">في انتظار</span>}</td>
                  <td><button onClick={() => handleApprove(r._id)} className="text-xs text-primary-500 hover:underline">{r.isApproved ? 'إلغاء' : 'موافقة'}</button></td>
                </tr>
              ))}
              {reviews.length === 0 && <tr><td colSpan={6} className="text-center text-gray-400 py-8">لا توجد تقييمات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LoadingPanel() {
  return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>;
}
