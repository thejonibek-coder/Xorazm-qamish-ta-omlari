import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { MenuItem, CartItem, ApiLogEntry } from '@/types';
import { api } from '@/services/api';

interface CartContextValue {
  items: CartItem[];
  addItem: (item: MenuItem, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  itemCount: number;
  promoCode: string;
  promoApplied: boolean;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const FREE_DELIVERY_THRESHOLD = 100000;
const DELIVERY_FEE = 15000;
const PROMO_DISCOUNT = 0.10;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const addItem = useCallback((item: MenuItem, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { item, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.item.id === id ? { ...i, quantity: qty } : i)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoApplied(false);
    setPromoCode('');
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const applyPromo = useCallback((code: string) => {
    if (code.toUpperCase() === api.getPromoInfo().code) {
      setPromoApplied(true);
      setPromoCode(code.toUpperCase());
      return true;
    }
    return false;
  }, []);

  const removePromo = useCallback(() => {
    setPromoApplied(false);
    setPromoCode('');
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = promoApplied ? Math.round(subtotal * PROMO_DISCOUNT) : 0;
  const total = subtotal + deliveryFee - discount;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, clearCart,
        isOpen, openCart, closeCart,
        subtotal, deliveryFee, discount, total, itemCount,
        promoCode, promoApplied, applyPromo, removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// ---- Menu context ----
interface MenuContextValue {
  menu: MenuItem[];
  loading: boolean;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = api.onMenuChange((m) => {
      setMenu(m);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <MenuContext.Provider value={{ menu, loading }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}

// ---- API Log context ----
interface LogContextValue {
  logs: ApiLogEntry[];
}

const LogContext = createContext<LogContextValue | null>(null);

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);

  useEffect(() => {
    const unsub = api.onLog((entry) => {
      setLogs((prev) => [entry, ...prev].slice(0, 50));
    });
    return unsub;
  }, []);

  return (
    <LogContext.Provider value={{ logs }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLogs must be used within LogProvider');
  return ctx;
}
