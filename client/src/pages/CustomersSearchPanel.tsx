import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usersAPI } from '../lib/api';
import { formatPrice, getStatusColor, getStatusText } from '../lib/utils';
import toast from 'react-hot-toast';
import {
  Search, X, Users, Phone, Mail, ShoppingBag, DollarSign, Star,
  ChevronLeft, ChevronRight, RefreshCw, Eye, Package, BookOpen,
  Hash, User, AlertTriangle, TrendingUp, SlidersHorizontal
} from 'lucide-react';

export default function CustomersSearchPanel() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const limit = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersAPI.getAll({});
      setAllUsers(res.data.users || []);
    } catch {
      toast.error('خطأ في جلب العملاء');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...allUsers];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((u: any) =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'most_orders':
        result.sort((a: any, b: any) => (b.totalOrders || 0) - (a.totalOrders || 0));
        break;
      case 'highest_spent':
        result.sort((a: any, b: any) => (b.totalSpent || 0) - (a.totalSpent || 0));
        break;
      default:
        result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [allUsers, debouncedSearch, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / limit));
  const paginatedUsers = filteredAndSorted.slice((page - 1) * limit, page * limit);

  const handleViewOrders = async (user: any) => {
    setSelectedUser(user);
    setOrdersLoading(true);
    try {
      const res = await usersAPI.getOrders(user._id);
      setUserOrders(res.data.orders || res.data || []);
    } catch {
      toast.error('خطأ في جلب الطلبات');
      setUserOrders([]);
    }
    setOrdersLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">بحث العملاء</h1>
        <p className="text-gray-400 text-sm">البحث المتقدم في العملاء وطلباتهم</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم، الهاتف، أو البريد الإلكتروني..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pr-10 py-2 text-sm"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="input-field py-2 text-sm w-auto"
          >
            <option value="newest">الأحدث</option>
            <option value="most_orders">الأكثر طلباً</option>
            <option value="highest_spent">الأعلى إنفاقاً</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : paginatedUsers.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">لا يوجد عملاء</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedUsers.map((user: any, i: number) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-500 shrink-0">
                      {(user.name || '?').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate" dir="ltr">
                        <Phone className="w-3 h-3 inline ml-1" />
                        {user.phone || '—'}
                      </p>
                      {user.email && (
                        <p className="text-xs text-gray-400 truncate">
                          <Mail className="w-3 h-3 inline ml-1" />
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.isBlocked
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {user.isBlocked ? 'محظور' : 'نشط'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-2 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-center">
                    <ShoppingBag className="w-3.5 h-3.5 text-gray-400 mx-auto mb-0.5" />
                    <p className="text-xs text-gray-400">الطلبات</p>
                    <p className="text-sm font-bold">{user.totalOrders || 0}</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-center">
                    <DollarSign className="w-3.5 h-3.5 text-primary-400 mx-auto mb-0.5" />
                    <p className="text-xs text-gray-400">الإنفاق</p>
                    <p className="text-sm font-bold text-primary-500">{formatPrice(user.totalSpent || 0)}</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-dark-700/50 rounded-xl text-center">
                    <Star className="w-3.5 h-3.5 text-amber-400 mx-auto mb-0.5" />
                    <p className="text-xs text-gray-400">النقاط</p>
                    <p className="text-sm font-bold">{user.loyaltyPoints || 0}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewOrders(user)}
                  className="w-full text-sm py-2 rounded-xl bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> عرض الطلبات
                </button>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" /> السابق
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 7) {
                    p = i + 1;
                  } else if (page <= 4) {
                    p = i + 1;
                  } else if (page >= totalPages - 3) {
                    p = totalPages - 6 + i;
                  } else {
                    p = page - 3 + i;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        p === page
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                التالي <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
                  طلبات {selectedUser.name}
                </h3>
                <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span dir="ltr">{selectedUser.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{selectedUser.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingBag className="w-4 h-4 text-gray-400" />
                  <span>{selectedUser.totalOrders || 0} طلب</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>{formatPrice(selectedUser.totalSpent || 0)}</span>
                </div>
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-6 h-6 text-primary-500 animate-spin" />
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">لا توجد طلبات لهذا العميل</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {userOrders.map((order: any) => (
                    <div key={order._id} className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Hash className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs font-medium">{order.orderId || `#${order._id.slice(-6)}`}</span>
                          <span className={`text-xs ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                          <span>{order.book?.titleAr || 'N/A'}</span>
                          <span className="text-xs text-gray-400">×{order.quantity}</span>
                        </div>
                        <span className="text-sm font-medium text-primary-500">{formatPrice(order.totalPrice)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
