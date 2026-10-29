import type { MenuItem, Order, OrderStatus, ApiLogEntry } from '@/types';
import { initialMenu } from '@/data/menu';

type LogSubscriber = (log: ApiLogEntry) => void;
type MenuSubscriber = (menu: MenuItem[]) => void;
type OrderSubscriber = (orders: Order[]) => void;

const PROMO_CODE = 'QAMISH2026';
const PROMO_DISCOUNT = 0.10;

let menuItems: MenuItem[] = [...initialMenu];
let orders: Order[] = [];
let logEntries: ApiLogEntry[] = [];
let logSubscribers: LogSubscriber[] = [];
let menuSubscribers: MenuSubscriber[] = [];
let orderSubscribers: OrderSubscriber[] = [];

let logIdCounter = 0;

function generateId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function emitLog(method: string, path: string, status: number) {
  const entry: ApiLogEntry = {
    id: `log${++logIdCounter}`,
    timestamp: new Date().toLocaleTimeString('uz-UZ', { hour12: false }),
    method,
    path,
    status,
  };
  logEntries = [entry, ...logEntries].slice(0, 50);
  logSubscribers.forEach((fn) => fn(entry));
}

function emitMenu() {
  menuSubscribers.forEach((fn) => fn([...menuItems]));
}

function emitOrders() {
  orderSubscribers.forEach((fn) => fn([...orders]));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T>(
  method: string,
  path: string,
  handler: () => T,
  status = 200,
): Promise<{ data: T; status: number }> {
  emitLog(method, path, status);
  await delay(150 + Math.random() * 200);
  return { data: handler(), status };
}

export const api = {
  // ---- Menu ----
  getMenu(): Promise<{ data: MenuItem[]; status: number }> {
    return request('GET', '/api/menu', () => [...menuItems]);
  },

  addMenuItem(
    dish: Omit<MenuItem, 'id' | 'rating' | 'reviewsCount'>,
  ): Promise<{ data: MenuItem; status: number }> {
    const newItem: MenuItem = {
      ...dish,
      id: generateId('m'),
      rating: 5.0,
      reviewsCount: 0,
    };
    return request('POST', '/api/menu', () => {
      menuItems = [newItem, ...menuItems];
      emitMenu();
      return newItem;
    }, 201);
  },

  deleteMenuItem(id: string): Promise<{ data: { success: boolean }; status: number }> {
    return request('DELETE', `/api/menu/${id}`, () => {
      menuItems = menuItems.filter((m) => m.id !== id);
      emitMenu();
      return { success: true };
    });
  },

  // ---- Orders ----
  getOrders(): Promise<{ data: Order[]; status: number }> {
    return request('GET', '/api/orders', () => [...orders]);
  },

  createOrder(
    order: Omit<Order, 'id' | 'status' | 'createdAt'>,
  ): Promise<{ data: Order; status: number }> {
    const newOrder: Order = {
      ...order,
      id: generateId('ord'),
      status: 'Yangi',
      createdAt: new Date().toLocaleString('uz-UZ'),
    };
    return request('POST', '/api/orders', () => {
      orders = [newOrder, ...orders];
      emitOrders();
      return newOrder;
    }, 201);
  },

  updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): Promise<{ data: Order; status: number }> {
    return request('PATCH', `/api/orders/${id}/status`, () => {
      orders = orders.map((o) => (o.id === id ? { ...o, status } : o));
      emitOrders();
      return orders.find((o) => o.id === id)!;
    });
  },

  // ---- Subscriptions ----
  onLog(fn: LogSubscriber): () => void {
    logSubscribers.push(fn);
    logEntries.forEach(fn);
    return () => {
      logSubscribers = logSubscribers.filter((f) => f !== fn);
    };
  },

  onMenuChange(fn: MenuSubscriber): () => void {
    menuSubscribers.push(fn);
    fn([...menuItems]);
    return () => {
      menuSubscribers = menuSubscribers.filter((f) => f !== fn);
    };
  },

  onOrdersChange(fn: OrderSubscriber): () => void {
    orderSubscribers.push(fn);
    fn([...orders]);
    return () => {
      orderSubscribers = orderSubscribers.filter((f) => f !== fn);
    };
  },

  // ---- Helpers ----
  getPromoInfo() {
    return { code: PROMO_CODE, discount: PROMO_DISCOUNT };
  },

  getLogs(): ApiLogEntry[] {
    return [...logEntries];
  },

  getAllOrders(): Order[] {
    return [...orders];
  },
};

// ---- Telegram notification ----
export async function sendTelegramNotification(order: Order): Promise<boolean> {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  const itemsText = order.items
    .map((i, idx) => `${idx + 1}. ${i.name} — ${i.quantity}x × ${i.price.toLocaleString('uz-UZ')} = ${(i.quantity * i.price).toLocaleString('uz-UZ')} so'm`)
    .join('\n');

  const message = `🔔 *YANGI BUYURTMA — QAMISH*

👤 *Mijoz:* ${order.customerName}
📞 *Telefon:* ${order.phone}
🚚 *Yetkazib berish:* ${order.deliveryType}
💳 *To'lov:* ${order.paymentMethod}
${order.city ? `📍 *Manzil:* ${order.city}, ${order.street}, ${order.house}${order.landmark ? ', ' + order.landmark : ''}` : ''}
${order.notes ? `📝 *Izoh:* ${order.notes}` : ''}

━━━━━━━━━━━━━━━
*Buyurtmalar:*
${itemsText}
━━━━━━━━━━━━━━━
💵 *Jami:* ${order.subtotal.toLocaleString('uz-UZ')} so'm
🚚 *Yetkazib berish:* ${order.deliveryFee === 0 ? 'Bepul' : order.deliveryFee.toLocaleString("uz-UZ") + " so'm"}
${order.discount > 0 ? `🏷 *Chegirma:* -${order.discount.toLocaleString('uz-UZ')} so'm` : ''}
✅ *UMUMIY SUMMA:* ${order.total.toLocaleString('uz-UZ')} so'm

📋 *Buyurtma ID:* ${order.id}
🕐 *Vaqt:* ${order.createdAt}`;

  if (!token || !chatId) {
    console.log('[Telegram] .env o\'zgaruvchilari topilmadi. Buyurtma ma\'lumotlari:');
    console.log(message);
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      },
    );
    return res.ok;
  } catch (err) {
    console.error('[Telegram] Xatolik:', err);
    return false;
  }
}
