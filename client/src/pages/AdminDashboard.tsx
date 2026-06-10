import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../store/useStore';
import { authAPI, dashboardAPI, ordersAPI, usersAPI, booksAPI, deliveryAPI, accountingAPI, aiAPI, blogAPI, reviewsAPI, activityAPI, inventoryAPI } from '../lib/api';
import POSPage from './POSPage';
import { formatPrice, getStatusColor, getStatusText, getDeliveryMethodText, EGYPTIAN_GOVERNORATES, GRADES } from '../lib/utils';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, ShoppingBag, Users, BookOpen, Truck, BarChart3, Brain, Wallet, Star,
  Search, X, Check, Plus, Edit2, Trash2, Shield, TrendingUp, DollarSign, AlertTriangle,
  Package, Phone, MapPin, Hash, Upload, Image as ImageIcon, RefreshCw, Ban, Zap,
  ArrowUpDown, Filter, Clock, ChevronLeft, ChevronRight, Download, Eye, MessageSquare, Send, Calculator,
  Scan, Store, QrCode, Barcode, ClipboardList, UserCog, Settings, Key, Mail, Lock, Shield, UserPlus, UserX, EyeOff,
  Warehouse
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const COLORS = ['#0098A4', '#4EE7F3', '#007A83', '#10b981', '#f59e0b', '#8b5cf6', '#f97316'];

type Tab = 'dashboard' | 'orders' | 'customers' | 'books' | 'delivery' | 'pickup' | 'instant' | 'inventory' | 'accounting' | 'ai' | 'reviews' | 'staff' | 'settings' | 'activity';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useStore();

  const isCashier = user?.role === 'cashier';

  if (user?.role !== 'admin' && user?.role !== 'cashier') {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" /><p className="text-xl font-bold">غير مصرح به</p><p className="text-gray-400">هذه الصفحة للمشرفين والكاشير فقط</p></div></div>;
  }

  const allTabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة المعلومات' },
    { id: 'orders', icon: ShoppingBag, label: 'الطلبات' },
    { id: 'customers', icon: Users, label: 'العملاء' },
    { id: 'pickup', icon: Store, label: 'حجوزات المنفذ' },
    { id: 'instant', icon: Zap, label: 'الاستلام الفوري' },
    { id: 'books', icon: BookOpen, label: 'الكتب' },
    { id: 'delivery', icon: Truck, label: 'التوصيل' },
    { id: 'inventory', icon: Warehouse, label: 'المخزون' },
    { id: 'accounting', icon: Wallet, label: 'المحاسبة' },
    { id: 'ai', icon: Brain, label: 'الذكاء الاصطناعي' },
    { id: 'reviews', icon: Star, label: 'التقييمات' },
    { id: 'staff', icon: UserCog, label: 'الموظفين' },
    { id: 'activity', icon: Clock, label: 'النشاطات' },
    { id: 'settings', icon: Settings, label: 'الإعدادات' },
  ] as const;

  const cashierBlocked = ['dashboard', 'books', 'delivery', 'inventory', 'accounting', 'ai', 'reviews', 'staff', 'activity', 'settings'];
  const tabs = allTabs;

  const handleTabClick = (tabId: Tab) => {
    if (isCashier && cashierBlocked.includes(tabId)) {
      toast.error('هذه الصفحة للمشرفين فقط');
      return;
    }
    setActiveTab(tabId);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const keyToTab: Record<string, Tab> = {
          '1': 'dashboard', '2': 'orders', '3': 'customers', '4': 'pickup',
          '5': 'instant', '6': 'books', '7': 'inventory', '8': 'accounting',
          '9': 'ai', '0': 'activity',
        };
        const tabId = keyToTab[e.key];
        if (tabId) { e.preventDefault(); handleTabClick(tabId); }
        if (e.key === 'b') { e.preventDefault(); setSidebarOpen(p => !p); }
      }
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isCashier]);

  return (<>
    <Helmet><title>{isCashier ? 'الكاشير' : 'لوحة التحكم'} | Book Beacon</title></Helmet>
    {activeTab === 'instant' ? (
      <div className="pt-16">
        <POSPage onBack={() => setActiveTab('orders')} />
      </div>
    ) : (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-950">
      <div className="flex">
        <aside className={`fixed right-0 top-16 h-[calc(100vh-4rem)] z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-dark-900 border-l border-gray-100 dark:border-dark-800 overflow-hidden`}>
          <div className="p-3 overflow-y-auto h-full">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full p-2 mb-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all">
              <ChevronRight className={`w-5 h-5 text-gray-400 mx-auto transition-transform ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
            </button>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : isCashier && cashierBlocked.includes(tab.id)
                        ? 'text-gray-400 cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-800'
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700'
                  }`}
                  title={!sidebarOpen ? (isCashier && cashierBlocked.includes(tab.id) ? 'غير متاح' : tab.label) : undefined}>
                  <tab.icon className="w-5 h-5 shrink-0" />
                  <span className={`transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{tab.label}</span>
                  {isCashier && cashierBlocked.includes(tab.id) && sidebarOpen && (
                    <span className="mr-auto"><Lock className="w-3 h-3 text-gray-400" /></span>
                  )}
                  <span className={`mr-auto text-[10px] text-gray-400 ${sidebarOpen && !isCashier ? 'opacity-60' : 'opacity-0 w-0 overflow-hidden'}`}>Ctrl+{tabs.indexOf(tab)+1}</span>
                </button>
              ))}
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
            {activeTab === 'pickup' && <PickupPanel />}
            {!isCashier && activeTab === 'inventory' && <InventoryPanel />}
            {!isCashier && activeTab === 'accounting' && <AccountingPanel />}
            {!isCashier && activeTab === 'ai' && <AIPanel />}
            {!isCashier && activeTab === 'reviews' && <ReviewsPanel />}
            {!isCashier && activeTab === 'staff' && <StaffPanel />}
            {!isCashier && activeTab === 'activity' && <ActivityPanel />}
            {!isCashier && activeTab === 'settings' && <SettingsPanel />}
            {isCashier && cashierBlocked.includes(activeTab) && <UnauthorizedPanel />}
          </div>
        </main>
      </div>
    </div>
    )}
  </>);
}

// -----------------------------------------------------------------------
// DASHBOARD PANEL
// -----------------------------------------------------------------------
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
    { label: 'إجمالي الطلبات', value: stats.totalOrders, icon: Package, color: 'from-teal-500 to-teal-600' },
    { label: 'الإيرادات', value: formatPrice(stats.totalRevenue || 0), icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { label: 'صافي الربح', value: formatPrice(stats.netProfit || 0), icon: TrendingUp, color: 'from-emerald-500 to-emerald-600' },
    { label: 'طلبات معلقة', value: stats.pendingOrders, icon: AlertTriangle, color: 'from-amber-500 to-amber-600' },
    { label: 'تم التوصيل', value: stats.deliveredOrders || 0, icon: Truck, color: 'from-primary-500 to-primary-600' },
    { label: 'العملاء', value: stats.totalCustomers, icon: Users, color: 'from-purple-500 to-purple-600' },
    { label: 'المخزون', value: stats.inventorySummary?.totalStock || 0, icon: Warehouse, color: 'from-cyan-500 to-cyan-600' },
    { label: 'اليوم', value: `${stats.todayOrders || 0} طلبات`, icon: Clock, color: 'from-primary-400 to-primary-500' },
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

      {stats.lowStockBooks?.length > 0 && (
        <div className="card p-4 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold">تنبيه مخزون منخفض</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.lowStockBooks.map((b: any) => (
              <span key={b._id} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg">
                {b.titleAr}: {b.stock} (الحد: {b.lowStockThreshold})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`stat-card bg-gradient-to-br ${card.color}`}>
            <card.icon className="w-5 h-5 opacity-80 mb-1" />
            <p className="text-[10px] opacity-80">{card.label}</p>
            <p className="text-lg font-bold">{card.value}</p>
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
              <Bar dataKey="income" fill="#0098A4" name="الإيرادات" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f97316" name="المصروفات" radius={[4, 4, 0, 0]} />
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
              <div className="flex items-center gap-2">
                {order.orderId && <span className="text-xs text-gray-400">{order.orderId}</span>}
                <span className={`text-xs ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
              </div>
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
                  <button onClick={handleReset} disabled={resetInput !== 'RESET DATA'} className="btn-danger w-full">تأكيد المسح النهائي</button>
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

// -----------------------------------------------------------------------
// ORDERS PANEL
// -----------------------------------------------------------------------
function OrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [refundOrder, setRefundOrder] = useState<any>(null);
  const [refundQtys, setRefundQtys] = useState<Record<string, number>>({});
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    const params: any = { page, limit: 20 };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (deliveryFilter) params.deliveryStatus = deliveryFilter;
    if (sourceFilter) params.orderSource = sourceFilter;
    ordersAPI.getAll(params).then((res) => { setOrders(res.data.orders); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, deliveryFilter, sourceFilter, page]);

  const handleStatusUpdate = async (id: string, data: any) => {
    try { await ordersAPI.updateStatus(id, data); toast.success('تم تحديث الطلب'); fetchOrders(); setSelectedOrder(null); } catch { toast.error('حدث خطأ'); }
  };

  const handleInstantDelivery = async (id: string) => {
    try { await ordersAPI.instantDelivery(id); toast.success('تم التوصيل الفوري'); fetchOrders(); setSelectedOrder(null); } catch { toast.error('حدث خطأ'); }
  };

  const handleConfirmDelivery = async (id: string, receivedAmount?: number) => {
    try {
      const payload: any = {};
      if (receivedAmount) payload.receivedAmount = receivedAmount;
      await ordersAPI.confirmDelivery(id, payload);
      toast.success('تم تأكيد التوصيل مع التحصيل');
      fetchOrders(); setSelectedOrder(null);
    } catch { toast.error('حدث خطأ'); }
  };

  const openRefundModal = (order: any) => {
    setRefundOrder(order);
    setRefundQtys({ [order.book?._id]: order.quantity });
    setRefundReason('');
  };

  const handleRefund = async () => {
    if (!refundOrder) return;
    const items = Object.entries(refundQtys)
      .filter(([, qty]) => qty > 0)
      .map(([bookId, quantity]) => ({ bookId, quantity }));
    if (items.length === 0) { toast.error('اختر كمية للإرجاع'); return; }
    setRefunding(true);
    try {
      await ordersAPI.refundOrder({ orderId: refundOrder._id, items, reason: refundReason });
      toast.success('تم إرجاع الطلب');
      setRefundOrder(null);
      fetchOrders();
    } catch { toast.error('حدث خطأ'); }
    setRefunding(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">الطلبات</h1>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="بحث برقم الطلب أو اسم العميل..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pr-10 py-2 text-sm" onKeyDown={(e) => e.key === 'Enter' && fetchOrders()} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field py-2 text-sm w-auto">
          <option value="">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="payment_review">مراجعة الدفع</option>
          <option value="approved">تم الموافقة</option>
          <option value="ready_for_pickup">جاهز للاستلام</option>
          <option value="delivered">تم التوصيل</option>
          <option value="rejected">مرفوض</option>
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="input-field py-2 text-sm w-auto">
          <option value="">كل المصادر</option>
          <option value="online">اونلاين</option>
          <option value="store">المتجر</option>
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
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  <div><p className="text-xs text-gray-400 mb-1">{order.orderId || `#${order._id.slice(-6)}`}</p><p className="text-xs text-gray-500">{order.orderSource === 'store' ? 'متجر' : 'اونلاين'} • {order.deliveryType === 'pickup' ? 'استلام' : 'توصيل'}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1"><Users className="w-3 h-3 inline" /> العميل</p><p className="text-sm font-medium truncate">{order.customerName || order.user?.name || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1"><Phone className="w-3 h-3 inline" /> الهاتف</p><p className="text-sm" dir="ltr">{order.user?.phone || order.deliveryDetails?.phone || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1"><BookOpen className="w-3 h-3 inline" /> الكتاب</p><p className="text-sm font-medium truncate">{order.book?.titleAr || 'N/A'}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1">الكمية</p><p className="text-sm">{order.quantity}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1"><DollarSign className="w-3 h-3 inline" /> الإجمالي</p><p className="text-sm font-medium text-primary-500">{formatPrice(order.totalPrice)}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1">المدفوع / المتبقي</p><p className="text-xs text-green-500">{formatPrice(order.paidAmount)}</p><p className={`text-xs ${order.remainingAmount > 0 ? 'text-amber-500' : 'text-gray-400'}`}>{order.remainingAmount > 0 ? formatPrice(order.remainingAmount) : 'كامل'}</p></div>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                  <span className={`text-xs ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
                  {order.isFraudFlagged && <span className="badge-danger text-xs"><AlertTriangle className="w-3 h-3 inline" /> احتيال</span>}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-700 flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                {order.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatusUpdate(order._id, { status: 'payment_review' })} className="btn-primary text-xs !py-1.5 !px-3"><Eye className="w-3 h-3 inline ml-1" /> مراجعة الدفع</button>
                    <button onClick={() => handleStatusUpdate(order._id, { status: 'rejected' })} className="btn-danger text-xs !py-1.5 !px-3"><X className="w-3 h-3 inline ml-1" /> رفض</button>
                  </>
                )}
                {order.status === 'payment_review' && (
                  <>
                    <button onClick={() => handleStatusUpdate(order._id, { status: 'approved' })} className="btn-success text-xs !py-1.5 !px-3"><Check className="w-3 h-3 inline ml-1" /> موافقة وخصم المخزون</button>
                    <button onClick={() => handleStatusUpdate(order._id, { status: 'rejected' })} className="btn-danger text-xs !py-1.5 !px-3"><X className="w-3 h-3 inline ml-1" /> رفض</button>
                  </>
                )}
                {order.status === 'approved' && order.deliveryType === 'pickup' && (
                  <button onClick={() => handleStatusUpdate(order._id, { status: 'ready_for_pickup' })} className="btn-info text-xs !py-1.5 !px-3"><Store className="w-3 h-3 inline ml-1" /> جاهز للاستلام</button>
                )}
                {order.status === 'approved' && order.deliveryType !== 'pickup' && (
                  <button onClick={() => handleInstantDelivery(order._id)} className="btn-primary text-xs !py-1.5 !px-3 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> توصيل فوري
                  </button>
                )}
                {order.status === 'ready_for_pickup' && (
                  <>
                    <button onClick={() => handleConfirmDelivery(order._id)} className="btn-success text-xs !py-1.5 !px-3"><Check className="w-3 h-3 inline ml-1" /> تأكيد الاستلام</button>
                    {order.remainingAmount > 0 && (
                      <span className="text-xs text-amber-500 flex items-center"><AlertTriangle className="w-3 h-3 ml-1" /> باقي {formatPrice(order.remainingAmount)}</span>
                    )}
                  </>
                )}
                {['delivered', 'approved', 'ready_for_pickup'].includes(order.status) && (
                  <button onClick={() => openRefundModal(order)} className="text-xs !py-1.5 !px-3 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-400 transition-colors flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> ترجيع
                  </button>
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
                <h3 className="text-lg font-bold">تفاصيل الطلب {selectedOrder.orderId || `#${selectedOrder._id.slice(-6)}`}</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">العميل</p><p className="font-medium">{selectedOrder.customerName || selectedOrder.user?.name}</p><p className="text-xs text-gray-400">{selectedOrder.user?.email}</p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">الهاتف</p><p className="font-medium" dir="ltr">{selectedOrder.user?.phone || selectedOrder.deliveryDetails?.phone || 'N/A'}</p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">الكتاب</p><p className="font-medium">{selectedOrder.book?.titleAr}</p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">الإجمالي / المدفوع / المتبقي</p><p className="font-medium text-primary-500">{formatPrice(selectedOrder.totalPrice)}</p><p className="text-xs text-green-500">{formatPrice(selectedOrder.paidAmount)} / <span className={selectedOrder.remainingAmount > 0 ? 'text-amber-500' : 'text-gray-400'}>{formatPrice(selectedOrder.remainingAmount)}</span></p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">الكمية</p><p className="font-medium">{selectedOrder.quantity}</p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">الحالة</p><span className={`text-xs ${getStatusColor(selectedOrder.status)}`}>{getStatusText(selectedOrder.status)}</span></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">المصدر / التوصيل</p><p className="text-xs">{selectedOrder.orderSource === 'store' ? 'المتجر' : 'اونلاين'} • {selectedOrder.deliveryType === 'pickup' ? 'استلام' : 'توصيل'}</p></div>
                  {selectedOrder.orderSource === 'store' && selectedOrder.customerName && (
                    <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">اسم العميل (متجر)</p><p className="font-medium">{selectedOrder.customerName}</p></div>
                  )}
                </div>

                {selectedOrder.deliveryDetails?.governorate && (
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-2">بيانات التوصيل</p>
                    <p className="text-sm"><MapPin className="w-4 h-4 inline ml-1" />{selectedOrder.deliveryDetails.governorate} - {selectedOrder.deliveryDetails.center}</p>
                    <p className="text-sm">{selectedOrder.deliveryDetails.address}</p>
                  </div>
                )}

                {selectedOrder.paymentProof?.imageUrl && (
                  <div><p className="text-xs text-gray-400 mb-2">إيصال الدفع</p><img src={selectedOrder.paymentProof.imageUrl} alt="receipt" className="w-full rounded-xl border border-gray-100 dark:border-dark-700" /></div>
                )}

                {selectedOrder.paymentProof?.senderPhone && (
                  <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><p className="text-xs text-gray-400">رقم المحول</p><p className="font-medium">{selectedOrder.paymentProof.senderPhone}</p></div>
                )}

                {selectedOrder.isFraudFlagged && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center gap-2 text-sm text-red-600"><AlertTriangle className="w-4 h-4" />{selectedOrder.fraudReason}</div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatusUpdate(selectedOrder._id, { status: 'payment_review' })} className="flex-1 btn-primary text-sm"><Eye className="w-4 h-4 inline ml-1" />مراجعة الدفع</button>
                      <button onClick={() => handleStatusUpdate(selectedOrder._id, { status: 'rejected' })} className="flex-1 btn-danger text-sm"><X className="w-4 h-4 inline ml-1" />رفض</button>
                    </>
                  )}
                  {selectedOrder.status === 'payment_review' && (
                    <>
                      <button onClick={() => handleStatusUpdate(selectedOrder._id, { status: 'approved' })} className="flex-1 btn-success text-sm"><Check className="w-4 h-4 inline ml-1" />موافقة</button>
                      <button onClick={() => handleStatusUpdate(selectedOrder._id, { status: 'rejected' })} className="flex-1 btn-danger text-sm"><X className="w-4 h-4 inline ml-1" />رفض</button>
                    </>
                  )}
                  {selectedOrder.status === 'approved' && selectedOrder.deliveryType === 'pickup' && (
                    <button onClick={() => { handleStatusUpdate(selectedOrder._id, { status: 'ready_for_pickup' }); }} className="flex-1 btn-info text-sm"><Store className="w-4 h-4 inline ml-1" />جاهز للاستلام</button>
                  )}
                  {selectedOrder.status === 'ready_for_pickup' && (
                    <button onClick={() => handleConfirmDelivery(selectedOrder._id)} className="flex-1 btn-success text-sm"><Check className="w-4 h-4 inline ml-1" />تأكيد الاستلام</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {refundOrder && (
          <div className="modal-overlay" onClick={() => setRefundOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">ترجيع الطلب {refundOrder.orderId || `#${refundOrder._id.slice(-6)}`}</h3>
                <button onClick={() => setRefundOrder(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">الكتاب</p>
                  <p className="font-medium">{refundOrder.book?.titleAr}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الكمية المرتجعة</label>
                  <input type="number" min="0" max={refundOrder.quantity} value={refundQtys[refundOrder.book?._id] || 0} onChange={(e) => setRefundQtys({ ...refundQtys, [refundOrder.book?._id]: Math.min(Number(e.target.value), refundOrder.quantity) })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">سبب الإرجاع</label>
                  <input type="text" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="مثال: تالف، خطأ في الطلب..." className="input-field text-sm" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleRefund} disabled={refunding || (refundQtys[refundOrder.book?._id] || 0) <= 0} className="flex-1 btn-primary text-sm">
                    {refunding ? <RefreshCw className="w-4 h-4 animate-spin inline ml-1" /> : null}
                    تأكيد الإرجاع
                  </button>
                  <button onClick={() => setRefundOrder(null)} className="flex-1 btn-secondary text-sm">إلغاء</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------
// CUSTOMERS PANEL
// -----------------------------------------------------------------------
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

// -----------------------------------------------------------------------
// BOOKS PANEL (same as before)
// -----------------------------------------------------------------------
function BooksPanel() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', titleAr: '', grade: 'أولى ثانوي', subject: '', teacher: '', price: 250, costPrice: 0, stock: 50, description: '', descriptionAr: '', keywords: '' });
  const [bookSearch, setBookSearch] = useState('');
  const [bookGradeFilter, setBookGradeFilter] = useState('');

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
        <div className="flex gap-2">
          <button onClick={async () => { try { await booksAPI.generateBarcodes(); toast.success('تم إنشاء الباركودات'); fetchBooks(); } catch { toast.error('خطأ'); } }} className="btn-secondary text-sm"><Barcode className="w-4 h-4 inline ml-1" />باركود</button>
          <button onClick={() => { setEditBook(null); setForm({ title: '', titleAr: '', grade: 'أولى ثانوي', subject: '', teacher: '', price: 250, costPrice: 0, stock: 50, description: '', descriptionAr: '', keywords: '' }); setImagePreview(null); setSelectedFile(null); setShowForm(true); }} className="btn-primary text-sm"><Plus className="w-4 h-4 inline ml-1" />إضافة كتاب</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={bookSearch} onChange={(e) => setBookSearch(e.target.value)} placeholder="ابحث باسم الكتاب، المادة، أو المدرس..." className="input-field pr-10 text-sm" />
        </div>
        <select value={bookGradeFilter} onChange={(e) => setBookGradeFilter(e.target.value)} className="input-field text-sm w-auto">
          <option value="">كل الصفوف</option>
          {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>الكتاب</th><th>المدرس</th><th>الصف</th><th>سعر البيع</th><th>التكلفة</th><th>المخزون</th><th>محجوز</th><th>تم البيع</th><th>المبيعات</th><th>الباركود</th><th>إجراءات</th></tr></thead>
            <tbody>
              {books.filter((b) => {
                if (bookGradeFilter && b.grade !== bookGradeFilter) return false;
                if (bookSearch) {
                  const q = bookSearch.toLowerCase();
                  if (!(b.titleAr || '').includes(q) && !(b.subject || '').toLowerCase().includes(q) && !(b.teacher || '').toLowerCase().includes(q)) return false;
                }
                return true;
              }).map((b: any) => (
                <tr key={b._id}>
                  <td><p className="font-medium">{b.titleAr}</p><span className="text-xs text-gray-400">{b.subject}</span></td>
                  <td className="text-xs">{b.teacher || '-'}</td>
                  <td className="text-xs">{b.grade}</td>
                  <td className="text-green-500 font-medium text-xs">{formatPrice(b.price)}</td>
                  <td className="text-red-400 text-xs">{b.costPrice ? formatPrice(b.costPrice) : '-'}</td>
                  <td><span className={`text-xs font-medium ${(b.stock - (b.reservedQuantity || 0)) <= (b.lowStockThreshold || 5) ? 'text-red-500' : 'text-green-500'}`}>{b.stock}</span></td>
                  <td className="text-amber-500 text-xs">{b.reservedQuantity || 0}</td>
                  <td className="text-xs">{b.soldQuantity || 0}</td>
                  <td>{b.salesCount}</td>
                  <td className="text-xs font-mono" dir="ltr">{b.barcode || <span className="text-gray-300">—</span>}</td>
                  <td><div className="flex gap-2"><button onClick={() => openEdit(b)} className="text-blue-500 hover:underline text-xs"><Edit2 className="w-3 h-3 inline" /></button><button onClick={() => handleDelete(b._id)} className="text-red-500 hover:underline text-xs"><Trash2 className="w-3 h-3 inline" /></button></div></td>
                </tr>
              ))}
              {books.length === 0 && <tr><td colSpan={11} className="text-center text-gray-400 py-8">لا توجد كتب</td></tr>}
            </tbody>
          </table>
        </div>
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
                <input type="number" placeholder="سعر التكلفة" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })} className="input-field text-sm" />
                <input type="number" placeholder="المخزون" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input-field text-sm" />
                <div className="md:col-span-2"><textarea placeholder="الوصف" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} className="input-field text-sm" rows={2} /></div>
                <div className="md:col-span-2"><input type="text" placeholder="كلمات مفتاحية" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="input-field text-sm" /></div>
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" className="flex-1 btn-primary text-sm">{editBook ? 'تحديث' : 'إضافة'}</button>
                  <button type="button" onClick={() => { setShowForm(false); setSelectedFile(null); setImagePreview(null); }} className="flex-1 btn-secondary text-sm">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------
// DELIVERY PANEL
// -----------------------------------------------------------------------
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
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400"><Truck className="w-5 h-5" /><span className="font-medium">توصيل أسرع داخل بني سويف</span></div>
        <div className="flex gap-4 mt-2 text-sm text-gray-500"><span>أقل سعر: {formatPrice(minPrice)}</span><span>أعلى سعر: {formatPrice(maxPrice)}</span></div>
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
                  <td>{editId === p._id ? (
                    <div className="flex gap-2 items-center">
                      <input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="input-field text-sm w-20 !py-1" />
                      <button onClick={() => handleEdit(p._id)} className="text-green-500 text-xs hover:underline">حفظ</button>
                      <button onClick={() => setEditId(null)} className="text-gray-400 text-xs hover:underline">إلغاء</button>
                    </div>
                  ) : <span>{formatPrice(p.price)}</span>}</td>
                  <td><div className="flex gap-2"><button onClick={() => { setEditId(p._id); setEditPrice(p.price); }} className="text-blue-500 hover:underline text-xs"><Edit2 className="w-3 h-3 inline" /></button><button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline text-xs"><Trash2 className="w-3 h-3 inline" /></button></div></td>
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

// -----------------------------------------------------------------------
// PICKUP PANEL (Unified: shows all pickup orders from orders)
// -----------------------------------------------------------------------
function PickupPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAll({ deliveryType: 'pickup', limit: 200 });
      setOrders(res.data.orders);
    } catch { toast.error('خطأ في جلب الحجوزات'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPickups(); }, []);

  const handleStatusUpdate = async (id: string, data: any) => {
    try { await ordersAPI.updateStatus(id, data); toast.success('تم التحديث'); fetchPickups(); }
    catch { toast.error('حدث خطأ'); }
  };

  const handleConfirmDelivery = async (id: string) => {
    try {
      await ordersAPI.confirmDelivery(id);
      toast.success('تم تأكيد الاستلام');
      fetchPickups();
    } catch { toast.error('حدث خطأ'); }
  };

  const filtered = orders.filter((o: any) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const name = (o.customerName || o.user?.name || '').toLowerCase();
      const phone = (o.user?.phone || '').toLowerCase();
      const book = (o.book?.titleAr || '').toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !book.includes(q)) return false;
    }
    return true;
  });

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">حجوزات المنفذ</h1>
          <p className="text-gray-400 text-sm">جميع طلبات الاستلام (اونلاين + المتجر)</p>
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
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="بحث..." className="input-field pr-10 text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field text-sm w-auto">
          <option value="all">الكل</option>
          <option value="pending">قيد الانتظار</option>
          <option value="approved">تمت الموافقة</option>
          <option value="ready_for_pickup">جاهز للاستلام</option>
          <option value="delivered">تم الاستلام</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>العميل</th>
                <th>الكتاب</th>
                <th>الكمية</th>
                <th>المدفوع</th>
                <th>المتبقي</th>
                <th>المصدر</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order: any) => (
                <tr key={order._id}>
                  <td className="text-xs font-medium">{order.orderId || `#${order._id.slice(-6)}`}</td>
                  <td className="font-medium text-sm">{order.customerName || order.user?.name || '—'}</td>
                  <td className="text-sm">{order.book?.titleAr || '—'}</td>
                  <td>{order.quantity}</td>
                  <td className="text-green-500 text-xs">{formatPrice(order.paidAmount)}</td>
                  <td className={`text-xs ${order.remainingAmount > 0 ? 'text-amber-500 font-medium' : 'text-gray-400'}`}>{order.remainingAmount > 0 ? formatPrice(order.remainingAmount) : '—'}</td>
                  <td><span className={`text-xs ${order.orderSource === 'store' ? 'text-purple-500' : 'text-blue-500'}`}>{order.orderSource === 'store' ? 'متجر' : 'اونلاين'}</span></td>
                  <td><span className={`text-xs ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span></td>
                  <td>
                    <div className="flex gap-1.5 flex-wrap">
                      {order.status === 'approved' && (
                        <button onClick={() => handleStatusUpdate(order._id, { status: 'ready_for_pickup' })}
                          className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 transition-colors">جاهز للاستلام</button>
                      )}
                      {order.status === 'ready_for_pickup' && (
                        <button onClick={() => handleConfirmDelivery(order._id)}
                          className="text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 transition-colors">تأكيد الاستلام</button>
                      )}
                      {order.status === 'delivered' && (
                        <span className="text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> تم</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="text-center text-gray-400 py-12">لا توجد حجوزات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// INVENTORY PANEL (NEW)
// -----------------------------------------------------------------------
function InventoryPanel() {
  const [books, setBooks] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStock, setShowAddStock] = useState<any>(null);
  const [addQty, setAddQty] = useState(1);
  const [addReason, setAddReason] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, logsRes] = await Promise.all([
        booksAPI.getAll({ limit: 200 }),
        inventoryAPI.getLogs({ limit: 50 }),
      ]);
      setBooks(booksRes.data.books);
      setLogs(logsRes.data.logs);
    } catch { toast.error('خطأ في جلب البيانات'); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddStock = async (bookId: string) => {
    if (addQty < 1) { toast.error('الكمية يجب أن تكون 1 على الأقل'); return; }
    try {
      await inventoryAPI.addStock(bookId, { quantity: addQty, reason: addReason });
      toast.success('تم إضافة المخزون');
      setShowAddStock(null); setAddQty(1); setAddReason('');
      fetchData();
    } catch { toast.error('خطأ'); }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl md:text-3xl font-bold">المخزون</h1><p className="text-gray-400 text-sm">إدارة المخزون وتتبع حركة الكتب</p></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 border-blue-300"><p className="text-xs text-gray-400">إجمالي المخزون</p><p className="text-2xl font-bold text-blue-500">{books.reduce((s, b) => s + (b.stock || 0), 0)}</p></div>
        <div className="card p-4 border-amber-300"><p className="text-xs text-gray-400">محجوز</p><p className="text-2xl font-bold text-amber-500">{books.reduce((s, b) => s + (b.reservedQuantity || 0), 0)}</p></div>
        <div className="card p-4 border-green-300"><p className="text-xs text-gray-400">تم البيع</p><p className="text-2xl font-bold text-green-500">{books.reduce((s, b) => s + (b.soldQuantity || 0), 0)}</p></div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-dark-700">
          <h3 className="font-semibold">حالة المخزون</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>الكتاب</th><th>المخزون</th><th>متاح</th><th>محجوز</th><th>تم البيع</th><th>الحد الأدنى</th><th>الحالة</th><th>إجراءات</th></tr></thead>
            <tbody>
              {books.map((b: any) => {
                const available = b.stock - (b.reservedQuantity || 0);
                const isLow = available <= (b.lowStockThreshold || 5);
                return (
                  <tr key={b._id}>
                    <td className="font-medium text-sm">{b.titleAr}</td>
                    <td>{b.stock}</td>
                    <td className={available <= 0 ? 'text-red-500 font-bold' : isLow ? 'text-amber-500' : 'text-green-500'}>{available}</td>
                    <td className="text-amber-500">{b.reservedQuantity || 0}</td>
                    <td>{b.soldQuantity || 0}</td>
                    <td className="text-xs text-gray-400">{b.lowStockThreshold || 5}</td>
                    <td>
                      {available <= 0 ? <span className="badge-danger text-xs">نفد</span> :
                       isLow ? <span className="badge-warning text-xs">منخفض</span> :
                       <span className="badge-success text-xs">جيد</span>}
                    </td>
                    <td>
                      <button onClick={() => { setShowAddStock(b._id); setAddQty(1); setAddReason(''); }}
                        className="text-primary-500 hover:underline text-xs flex items-center gap-1">
                        <Plus className="w-3 h-3" /> إضافة مخزون
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">آخر حركات المخزون</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.map((log: any) => (
            <div key={log._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-sm">
              <div>
                <span className={`text-xs font-medium ${log.action === 'stock_added' ? 'text-green-500' : log.action === 'manual_adjustment' ? 'text-amber-500' : 'text-blue-500'}`}>
                  {log.action === 'stock_added' ? 'إضافة' : log.action === 'manual_adjustment' ? 'تعديل' : log.action === 'stock_sold' ? 'بيع' : log.action}
                </span>
                <span className="text-gray-400 mr-2">{log.book?.titleAr || ''}</span>
                <span className="text-xs text-gray-400">({log.quantity > 0 ? '+' : ''}{log.quantity})</span>
                {log.reason && <span className="text-xs text-gray-400 mr-2">— {log.reason}</span>}
              </div>
              <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleDateString('ar-EG')}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-sm text-gray-400 text-center py-4">لا توجد حركات</p>}
        </div>
      </div>

      <AnimatePresence>
        {showAddStock && (
          <div className="modal-overlay" onClick={() => setShowAddStock(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">إضافة مخزون</h3>
              <div className="space-y-3">
                <div><label className="block text-sm font-medium mb-1">الكمية</label><input type="number" min="1" value={addQty} onChange={(e) => setAddQty(Number(e.target.value))} className="input-field text-sm" /></div>
                <div><label className="block text-sm font-medium mb-1">السبب (اختياري)</label><input type="text" value={addReason} onChange={(e) => setAddReason(e.target.value)} placeholder="مثال: شحنة جديدة" className="input-field text-sm" /></div>
                <div className="flex gap-2">
                  <button onClick={() => handleAddStock(showAddStock)} className="flex-1 btn-primary text-sm">إضافة</button>
                  <button onClick={() => setShowAddStock(null)} className="flex-1 btn-secondary text-sm">إلغاء</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------
// STAFF PANEL (NEW)
// -----------------------------------------------------------------------
function StaffPanel() {
  const [cashiers, setCashiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const fetchCashiers = () => {
    setLoading(true);
    usersAPI.getCashiers().then((res) => { setCashiers(res.data.cashiers); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCashiers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await usersAPI.createCashier(form); toast.success('تم إضافة الكاشير'); setShowForm(false); setForm({ name: '', email: '', phone: '', password: '' }); fetchCashiers(); }
    catch { toast.error('حدث خطأ'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكاشير؟')) return;
    try { await usersAPI.deleteCashier(id); toast.success('تم الحذف'); fetchCashiers(); }
    catch { toast.error('حدث خطأ'); }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl md:text-3xl font-bold">الموظفين</h1><p className="text-gray-400 text-sm">إدارة الكاشير والموظفين</p></div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><UserPlus className="w-4 h-4 inline ml-1" />إضافة كاشير</button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>الاسم</th><th>البريد</th><th>الهاتف</th><th>الدور</th><th>تاريخ الإضافة</th><th>إجراءات</th></tr></thead>
            <tbody>
              {cashiers.map((c: any) => (
                <tr key={c._id}>
                  <td className="font-medium">{c.name}</td>
                  <td className="text-xs text-gray-400">{c.email}</td>
                  <td className="text-xs" dir="ltr">{c.phone}</td>
                  <td><span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">كاشير</span></td>
                  <td className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td><button onClick={() => handleDelete(c._id)} className="text-red-500 hover:underline text-xs"><Trash2 className="w-3 h-3 inline" /> حذف</button></td>
                </tr>
              ))}
              {cashiers.length === 0 && <tr><td colSpan={6} className="text-center text-gray-400 py-8">لا يوجد كاشير</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">إضافة كاشير جديد</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <input type="text" placeholder="الاسم" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" required />
                <input type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field text-sm" required />
                <input type="tel" placeholder="رقم الهاتف" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field text-sm" required />
                <input type="password" placeholder="كلمة المرور" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field text-sm" required />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 btn-primary text-sm">إضافة</button>
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-secondary text-sm">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------
// SETTINGS PANEL (NEW)
// -----------------------------------------------------------------------
function SettingsPanel() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authAPI.getProfile().then((res) => {
      setEmail(res.data.email || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: any = {};
      if (email) data.email = email;
      if (newPassword) { data.currentPassword = currentPassword; data.newPassword = newPassword; }
      await authAPI.updateProfile(data);
      toast.success('تم تحديث البيانات');
      setCurrentPassword(''); setNewPassword('');
    } catch { toast.error('حدث خطأ'); }
    setSaving(false);
  };

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl md:text-3xl font-bold">الإعدادات</h1><p className="text-gray-400 text-sm">تحديث بيانات المشرف</p></div>

      <div className="card max-w-lg mx-auto p-6">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1"><Mail className="w-4 h-4 inline ml-1" /> البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field text-sm" required />
          </div>
          <hr className="border-gray-100 dark:border-dark-700" />
          <div>
            <label className="block text-sm font-medium mb-1"><Lock className="w-4 h-4 inline ml-1" /> كلمة المرور الحالية</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field text-sm" placeholder="أدخل كلمة المرور الحالية" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1"><Key className="w-4 h-4 inline ml-1" /> كلمة المرور الجديدة</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field text-sm" placeholder="أدخل كلمة المرور الجديدة" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full text-sm">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin inline ml-1" /> : null}
            حفظ التغييرات
          </button>
        </form>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// ACCOUNTING PANEL
// -----------------------------------------------------------------------
function AccountingPanel() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [txForm, setTxForm] = useState({ type: 'income', amount: 0, category: '', description: '' });
  const [calcDisplay, setCalcDisplay] = useState('');
  const [calcResult, setCalcResult] = useState('');

  const handleCalcBtn = (btn: string) => {
    if (btn === '=') {
      try {
        const expr = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        const result = Function(`"use strict"; return (${expr})`)();
        setCalcResult(result.toString());
        setCalcDisplay(result.toString());
      } catch { setCalcResult('خطأ'); }
    } else if (['+', '-', '×', '÷'].includes(btn)) setCalcDisplay(prev => prev + ' ' + btn + ' ');
    else setCalcDisplay(prev => prev + btn);
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

      <div className="card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Calculator className="w-5 h-5 text-primary-500" /> الآلة الحاسبة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-50 dark:bg-dark-800/50 rounded-2xl p-4">
              <div className="bg-white dark:bg-dark-700 rounded-xl p-3 mb-3 text-left font-mono text-2xl font-bold min-h-[48px]" dir="ltr">{calcDisplay || '0'}</div>
              <div className="grid grid-cols-4 gap-2">
                {['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','=','+'].map((btn) => (
                  <button key={btn} onClick={() => handleCalcBtn(btn)}
                    className={`p-3 rounded-xl text-lg font-bold transition-all ${['÷','×','-','+','='].includes(btn) ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md' : btn === '0' ? 'col-span-2 bg-gray-200 dark:bg-dark-600 hover:bg-gray-300 dark:hover:bg-dark-500' : 'bg-gray-200 dark:bg-dark-600 hover:bg-gray-300 dark:hover:bg-dark-500'}`}>{btn}</button>
                ))}
                <button onClick={() => { setCalcDisplay(''); setCalcResult(''); }} className="col-span-4 p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">مسح</button>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">حسابات سريعة</h4>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl flex items-center justify-between"><span className="text-sm">متوسط سعر الكتاب</span><span className="font-bold text-primary-500">{overview?.totalBooks > 0 ? formatPrice(Math.round((overview?.totalRevenue || 0) / overview?.totalBooks)) : '-'}</span></div>
              <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl flex items-center justify-between"><span className="text-sm">متوسط الربح لكل طلب</span><span className="font-bold text-emerald-500">{overview?.totalOrders > 0 ? formatPrice(Math.round((overview?.netProfit || 0) / overview?.totalOrders)) : '-'}</span></div>
              <div className="p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl flex items-center justify-between"><span className="text-sm">نسبة المصروفات</span><span className="font-bold text-amber-500">{overview?.totalRevenue > 0 ? `${((overview?.totalExpenses || 0) / overview?.totalRevenue * 100).toFixed(1)}%` : '-'}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6"><h3 className="font-semibold mb-4">الربح على الوقت</h3><ResponsiveContainer width="100%" height={300}><AreaChart data={profitData}><defs><linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} /><XAxis dataKey="name" stroke="#9ca3af" fontSize={12} /><YAxis stroke="#9ca3af" fontSize={12} /><Tooltip /><Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} fill="url(#profitGrad)" /></AreaChart></ResponsiveContainer></div>
        <div className="card p-6"><h3 className="font-semibold mb-4">المصروفات حسب الفئة</h3><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={(overview?.profitByCategory || []).filter((c: any) => c._id !== null && c.total > 0)} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label={({ _id, total }) => `${_id} (${total})`}>{(overview?.profitByCategory || []).map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
      </div>

      <div className="card p-6"><h3 className="font-semibold mb-4">آخر الحركات المالية</h3><div className="space-y-2">{overview?.recentTransactions?.slice(0, 10).map((tx: any) => (<div key={tx._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl"><div><p className="text-sm font-medium">{tx.description || tx.category}</p><p className="text-xs text-gray-400">{tx.category} • {new Date(tx.createdAt).toLocaleDateString('ar-EG')}</p></div><span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>{tx.type === 'income' ? '+' : '-'}{tx.amount} جنيه</span></div>))}</div></div>

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

// -----------------------------------------------------------------------
// AI PANEL
// -----------------------------------------------------------------------
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
    } catch { setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، حدث خطأ في معالجة السؤال' }]); }
    setQueryLoading(false);
    setQuestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); } };

  const suggestedQuestions = [
    'ما هي أفضل الكتب مبيعاً؟', 'كم عدد الطلبات المعلقة؟', 'ما هو صافي الربح؟',
    'ما الكتب الأقل مبيعاً؟', 'عاوز اعرف ربح كتاب معين', 'كم كتاب عندي في المخزون؟',
    'عاوز تقرير كامل عن المتجر', 'ايه الكتب اللي مخزونها قليل؟',
  ];

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">الذكاء الاصطناعي</h1>

      <div className="card p-4 md:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-primary-500" /> اسأل المساعد الذكي</h3>
        <div className="h-[400px] overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 dark:bg-dark-800/50 rounded-2xl">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-tr-sm' : 'bg-white dark:bg-dark-700 shadow-sm rounded-tl-sm border border-gray-100 dark:border-dark-600'}`}>
                {msg.text.split('\n').map((line, j) => (<p key={j} className={j > 0 ? 'mt-1.5' : ''}>{line || '\u00A0'}</p>))}
              </div>
            </div>
          ))}
          {queryLoading && (
            <div className="flex justify-end">
              <div className="bg-white dark:bg-dark-700 shadow-sm rounded-2xl rounded-tl-sm p-4 border border-gray-100 dark:border-dark-600">
                <div className="flex gap-1.5"><div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /><div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedQuestions.map((sq, i) => (
            <button key={i} onClick={() => setQuestion(sq)} className="text-xs px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-500 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-all border border-gray-200 dark:border-dark-600">{sq}</button>
          ))}
        </div>

        <div className="flex gap-2">
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={handleKeyDown} placeholder="اسأل عن الكتب، المبيعات، الأرباح، المخزون..." className="input-field flex-1 rounded-2xl" disabled={queryLoading} />
          <button onClick={handleAsk} disabled={queryLoading || !question.trim()} className="btn-primary rounded-2xl px-5">{queryLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}</button>
        </div>
      </div>

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
          {insights?.bestSellers?.map((b: any, i: number) => (<div key={i} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-dark-700/50 rounded-lg mb-1"><span>{i + 1}. {b.titleAr}</span><span className="text-gray-400">{b.salesCount} مبيعات</span></div>))}
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary-500" /> تحليلات المحاسبة</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-center"><p className="text-xs text-gray-400">الإيرادات</p><p className="font-bold text-green-500 text-sm">{formatPrice(accInsights?.totalRevenue || 0)}</p></div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-center"><p className="text-xs text-gray-400">المصروفات</p><p className="font-bold text-red-400 text-sm">{formatPrice(accInsights?.totalExpenses || 0)}</p></div>
            <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-center"><p className="text-xs text-gray-400">الهامش</p><p className="font-bold text-sm">{accInsights?.profitMargin || 0}%</p></div>
          </div>
          {accInsights?.expenseCategories?.map((c: any, i: number) => (<div key={i} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-dark-700/50 rounded-lg mb-1"><span>{c._id}</span><span className="text-gray-400">{c.total} جنيه</span></div>))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary-500" /> كشف الاحتيال</h3>
        {fraudData?.fraudAlerts?.length > 0 ? (
          <div className="space-y-2">{fraudData.fraudAlerts.map((alert: any, i: number) => (<div key={i} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center gap-2 text-sm"><AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />{alert.reason}<span className={`text-xs ${alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`}>{alert.severity === 'high' ? 'عالي' : 'متوسط'}</span></div>))}</div>
        ) : <p className="text-sm text-gray-400">لا توجد تنبيهات احتيال حالياً ✓</p>}
        <p className="text-xs text-gray-400 mt-2">آخر فحص: {fraudData?.totalChecked || 0} طلب</p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// REVIEWS PANEL
// -----------------------------------------------------------------------
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

// -----------------------------------------------------------------------
// ACTIVITY PANEL
// -----------------------------------------------------------------------
function ActivityPanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [cashierFilter, setCashierFilter] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    const params: any = { page, limit: 30 };
    if (actionFilter) params.action = actionFilter;
    activityAPI.getAll(params).then(res => {
      setLogs(res.data.logs);
      setTotalPages(res.data.pages);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, [page, actionFilter]);

  const actionLabels: Record<string, string> = {
    order_created: 'إنشاء طلب', order_delivered: 'تسليم', instant_sale: 'بيع فوري',
    payment_verified: 'تأكيد دفع', stock_added: 'إضافة مخزون', stock_adjusted: 'تعديل مخزون',
    book_created: 'إضافة كتاب', book_updated: 'تعديل كتاب', user_banned: 'حظر مستخدم',
    payment_uploaded: 'رفع إيصال', order_approved: 'موافقة طلب',
  };

  const getCashierLogs = () => {
    const cashierMap: Record<string, { name: string; actions: number; totalRevenue: number }> = {};
    logs.forEach(log => {
      if (log.admin?._id) {
        const id = log.admin._id;
        if (!cashierMap[id]) cashierMap[id] = { name: log.admin.name || log.admin.email, actions: 0, totalRevenue: 0 };
        cashierMap[id].actions++;
        if (log.details?.totalPrice) cashierMap[id].totalRevenue += log.details.totalPrice;
      }
    });
    return Object.entries(cashierMap);
  };

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl md:text-3xl font-bold">سجل النشاطات</h1><p className="text-gray-400 text-sm">متابعة حركة الكاشير والمشرفين</p></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {getCashierLogs().map(([id, data]) => (
          <div key={id} className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                <span className="text-teal-500 font-bold">{data.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{data.name}</p>
                <p className="text-xs text-gray-400">{data.actions} عملية | {data.totalRevenue.toLocaleString()} ج.م</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }} className="input-field text-sm w-auto">
          <option value="">كل الأنشطة</option>
          {Object.entries(actionLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>الوقت</th><th>الكاشير</th><th>النشاط</th><th>الكتاب</th><th>الطلب</th><th>التفاصيل</th></tr></thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td className="text-xs text-gray-400 whitespace-nowrap">{new Date(log.createdAt).toLocaleString('ar-EG')}</td>
                  <td className="text-sm">{log.admin?.name || log.admin?.email || '-'}</td>
                  <td><span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">{actionLabels[log.action] || log.action}</span></td>
                  <td className="text-sm">{log.book?.titleAr || '-'}</td>
                  <td className="text-xs">{log.order?.orderId || '-'}</td>
                  <td className="text-xs text-gray-400">{log.details?.book || log.details?.reason || log.details?.customerName || '-'}</td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={6} className="text-center text-gray-400 py-8">لا توجد نشاطات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm">السابق</button>
          <span className="text-sm text-gray-400">صفحة {page} من {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm">التالي</button>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------
// UNAUTHORIZED PANEL
// -----------------------------------------------------------------------
function UnauthorizedPanel() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Shield className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">هذه الصلاحية غير متاحة لك</h2>
        <p className="text-gray-400 mb-6">هذا القسم مخصص للمشرفين فقط. إذا كنت بحاجة إلى هذه الصلاحية، يرجى التواصل مع المشرف العام.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          صلاحيتك الحالية: <span className="font-bold text-primary-500">كاشير</span>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// LOADING PANEL
// -----------------------------------------------------------------------
function LoadingPanel() {
  return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>;
}
