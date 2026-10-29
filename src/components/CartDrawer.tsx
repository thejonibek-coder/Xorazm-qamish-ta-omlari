import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, Truck, Check } from 'lucide-react';
import { useCart } from '@/context/AppContext';
import { formatPrice } from '@/utils/format';
import { api } from '@/services/api';

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const {
    items, isOpen, closeCart, updateQuantity, removeItem,
    subtotal, deliveryFee, discount, total, itemCount,
    promoCode, promoApplied, applyPromo, removePromo,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handlePromo = () => {
    if (!promoInput.trim()) return;
    if (applyPromo(promoInput)) {
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Noto\'g\'ri promokod');
    }
  };

  const freeDeliveryLeft = Math.max(0, 100000 - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / 100000) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={closeCart} />

      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-terracotta-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">Savat</h2>
              <p className="text-xs text-slate-500">{itemCount} ta taom</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-700 mb-1">Savat bo'sh</h3>
            <p className="text-slate-400 text-sm mb-6">Mazali taomlarni tanlab savatga qo'shing</p>
            <button
              onClick={closeCart}
              className="bg-gradient-to-r from-amber-500 to-terracotta-500 text-slate-950 font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
            >
              Menyuga qaytish
            </button>
          </div>
        ) : (
          <>
            {/* Free delivery progress */}
            <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
              {freeDeliveryLeft > 0 ? (
                <p className="text-xs text-amber-700 mb-1.5">
                  Bepul yetkazib berish uchun <span className="font-bold">{freeDeliveryLeft.toLocaleString('uz-UZ')} so'm</span> qoldi
                </p>
              ) : (
                <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mb-1.5">
                  <Check className="w-3.5 h-3.5" /> Bepul yetkazib berish faollashtirildi!
                </p>
              )}
              <div className="h-2 bg-amber-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-terracotta-500 rounded-full transition-all duration-500"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map(({ item, quantity }) => (
                <div key={item.id} className="flex gap-3 bg-white border border-slate-100 rounded-2xl p-3 hover:shadow-md transition-shadow">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-slate-400 mb-2">{item.price.toLocaleString('uz-UZ')} so'm</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                        <span className="font-semibold text-sm text-slate-900 w-7 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{(item.price * quantity).toLocaleString('uz-UZ')}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors group"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer — Promo + Summary + Checkout */}
            <div className="border-t border-slate-100 p-5 space-y-3 bg-slate-50">
              {/* Promo code */}
              {promoApplied ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                  <span className="flex items-center gap-2 text-sm text-emerald-700 font-semibold">
                    <Tag className="w-4 h-4" />
                    {promoCode} — 10% chegirma
                  </span>
                  <button onClick={removePromo} className="text-emerald-600 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handlePromo()}
                    placeholder="Promokod (masalan: QAMISH2026)"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-colors"
                  />
                  <button
                    onClick={handlePromo}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Qo'llash
                  </button>
                </div>
              )}
              {promoError && <p className="text-xs text-red-500">{promoError}</p>}

              {/* Summary */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Buyurtma summasi</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    Yetkazib berish
                  </span>
                  <span className="font-medium">{deliveryFee === 0 ? 'Bepul' : formatPrice(deliveryFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Chegirma (10%)</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Jami</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-amber-500 to-terracotta-500 hover:from-amber-400 hover:to-terracotta-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Buyurtma berish
                <span className="font-semibold">·</span>
                {formatPrice(total)}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
