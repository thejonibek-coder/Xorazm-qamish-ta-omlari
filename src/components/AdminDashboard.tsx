import { useState, useEffect } from 'react';
import { X, Lock, User, Shield, LogOut, Plus, Trash2, Package, Activity, UtensilsCrossed, TrendingUp, Clock } from 'lucide-react';
import { useMenu, useLogs } from '@/context/AppContext';
import { api } from '@/services/api';
import { formatPrice } from '@/utils/format';
import type { MenuItem, Order, OrderStatus, CategoryId } from '@/types';
import NetworkConsole from '@/components/NetworkConsole';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'qamish2026';

const orderStatuses: OrderStatus[] = ['Yangi', "Tayyorlanmoqda", "Yo'lda", 'Yetkazildi'];

const statusColors: Record<OrderStatus, string> = {
  'Yangi': 'bg-blue-100 text-blue-700 border-blue-200',
  "Tayyorlanmoqda": 'bg-amber-100 text-amber-700 border-amber-200',
  "Yo'lda": 'bg-purple-100 text-purple-700 border-purple-200',
  'Yetkazildi': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const { menu } = useMenu();
  const { logs } = useLogs();
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<'orders' | 'menu' | 'logs'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);

  // New dish form
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    category: 'burgers' as Exclude<CategoryId, 'all'>,
    ingredients: '',
    image: '',
  });
  const [addingDish, setAddingDish] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (authed) {
      const unsub = api.onOrdersChange((o) => setOrders(o));
      return unsub;
    }
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAuthed(true);
      setLoginError('');
    } else {
      setLoginError('Login yoki parol noto\'g\'ri');
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    setUsername('');
    setPassword('');
    setTab('orders');
  };

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name.trim() || !newDish.price) return;
    setAddingDish(true);
    await api.addMenuItem({
      name: newDish.name,
      description: newDish.description || 'Mazali taom',
      price: parseInt(newDish.price),
      category: newDish.category,
      ingredients: newDish.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      image: newDish.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      prepTime: '20-25 min',
      calories: 500,
    });
    setNewDish({ name: '', description: '', price: '', category: 'burgers', ingredients: '', image: '' });
    setAddingDish(false);
  };

  const handleDeleteDish = async (id: string) => {
    await api.deleteMenuItem(id);
  };

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    await api.updateOrderStatus(id, status);
  };

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

      <div
        className="relative bg-slate-50 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-terracotta-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">Admin Panel</h2>
              <p className="text-xs text-slate-400">Qamish boshqaruv tizimi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {authed && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            )}
            <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        {!authed ? (
          /* Login screen */
          <div className="flex-1 flex items-center justify-center p-8">
            <form onSubmit={handleLogin} className="w-full max-w-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 mb-1">Admin kirishi</h3>
                <p className="text-sm text-slate-400">Boshqaruv uchun tizimga kiring</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Login</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Parol</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5">
                    {loginError}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-terracotta-500 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.01]"
                >
                  Kirish
                </button>
                <p className="text-center text-xs text-slate-400">
                  Demo: <span className="font-mono font-semibold text-slate-500">admin / qamish2026</span>
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5 bg-white border-b border-slate-100 shrink-0">
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-slate-500 font-medium">Buyurtmalar</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-slate-500 font-medium">Daromad</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{totalRevenue > 0 ? `${(totalRevenue / 1000).toFixed(0)}K` : '0'}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <UtensilsCrossed className="w-4 h-4 text-terracotta-500" />
                  <span className="text-xs text-slate-500 font-medium">Taomlar</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{menu.length}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-slate-500 font-medium">API so'rovlar</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{logs.length}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 pt-3 bg-white border-b border-slate-100 shrink-0">
              {[
                { id: 'orders' as const, label: 'Buyurtmalar', icon: Package },
                { id: 'menu' as const, label: 'Menyu boshqaruvi', icon: UtensilsCrossed },
                { id: 'logs' as const, label: 'API jurnali', icon: Activity },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                    tab === t.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {tab === 'orders' && (
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">Hozircha buyurtmalar yo'q</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-slate-400">{order.id}</span>
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusColors[order.status]}`}>
                                {order.status}
                              </span>
                            </div>
                            <h4 className="font-semibold text-slate-900">{order.customerName}</h4>
                            <p className="text-sm text-slate-500">{order.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">{formatPrice(order.total)}</p>
                            <p className="text-xs text-slate-400">{order.createdAt}</p>
                          </div>
                        </div>

                        <div className="text-sm text-slate-500 mb-3">
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-slate-100 px-2 py-1 rounded-lg">{order.deliveryType}</span>
                            <span className="bg-slate-100 px-2 py-1 rounded-lg">{order.paymentMethod}</span>
                            {order.city && <span className="bg-slate-100 px-2 py-1 rounded-lg">{order.city}, {order.street}, {order.house}</span>}
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-1 mb-3 text-sm">
                          {order.items.map((it, i) => (
                            <div key={i} className="flex justify-between text-slate-600">
                              <span>{it.quantity}x {it.name}</span>
                              <span>{formatPrice(it.price * it.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Status changer */}
                        <div className="flex gap-1.5 pt-3 border-t border-slate-100">
                          {orderStatuses.map((st) => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(order.id, st)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                order.status === st
                                  ? statusColors[st]
                                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {tab === 'menu' && (
                <div className="space-y-4">
                  {/* Add dish form */}
                  <form onSubmit={handleAddDish} className="bg-white rounded-2xl border border-slate-100 p-4">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-500" />
                      Yangi taom qo'shish
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newDish.name}
                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                        placeholder="Taom nomi"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                        required
                      />
                      <input
                        type="number"
                        value={newDish.price}
                        onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                        placeholder="Narxi (so'm)"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                        required
                      />
                      <select
                        value={newDish.category}
                        onChange={(e) => setNewDish({ ...newDish, category: e.target.value as Exclude<CategoryId, 'all'> })}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                      >
                        <option value="burgers">Qamish Burgerlar</option>
                        <option value="gumma-somsa">Gumma & Somsa</option>
                        <option value="milliy">Milliy Taomlar</option>
                        <option value="baliqlar">Amudaryo Baliqlari</option>
                        <option value="salatlar-ichimliklar">Salatlar & Ichimliklar</option>
                      </select>
                      <input
                        type="text"
                        value={newDish.image}
                        onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                        placeholder="Rasm URL (ixtiyoriy)"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                      />
                      <input
                        type="text"
                        value={newDish.ingredients}
                        onChange={(e) => setNewDish({ ...newDish, ingredients: e.target.value })}
                        placeholder="Tarkibi (vergul bilan)"
                        className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                      />
                      <input
                        type="text"
                        value={newDish.description}
                        onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                        placeholder="Tavsif"
                        className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={addingDish}
                      className="mt-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {addingDish ? 'Qo\'shilmoqda...' : 'Taom qo\'shish'}
                    </button>
                  </form>

                  {/* Menu list */}
                  <div className="space-y-2">
                    {menu.map((item: MenuItem) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-slate-400">{item.category} · {formatPrice(item.price)}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteDish(item.id)}
                          className="w-9 h-9 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-slate-300 group-hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'logs' && <NetworkConsole logs={logs} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
