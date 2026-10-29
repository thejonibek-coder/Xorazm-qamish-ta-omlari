import { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, CreditCard, Truck, Store, Check, Loader2, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/AppContext';
import { formatPrice } from '@/utils/format';
import { api, sendTelegramNotification } from '@/services/api';
import type { DeliveryType, PaymentMethod, Order } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

const cities = ['Toshkent', 'Samarqand', 'Buxoro', 'Urganch', 'Xiva', 'Nukus'];

const paymentMethods: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'Payme', label: 'Payme', icon: '💳' },
  { id: 'Click', label: 'Click', icon: '📱' },
  { id: 'Naqd', label: 'Naqd pul', icon: '💵' },
  { id: 'Karta orqali kuryerga', label: 'Karta — kuryerga', icon: '🏦' },
];

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { items, subtotal, deliveryFee, discount, total, clearCart, promoCode, promoApplied } = useCart();
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Toshkent');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('Yetkazib berish');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Naqd');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('form');
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('998')) digits = digits.slice(3);
    if (digits.length > 9) digits = digits.slice(0, 9);
    let formatted = '+998';
    if (digits.length > 0) formatted += ` ${digits.slice(0, 2)}`;
    if (digits.length > 2) formatted += ` ${digits.slice(2, 5)}`;
    if (digits.length > 5) formatted += ` ${digits.slice(5, 7)}`;
    if (digits.length > 7) formatted += ` ${digits.slice(7, 9)}`;
    return formatted;
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Ismingizni kiriting';
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 12) e.phone = 'Telefon raqamni to\'liq kiriting';
    if (deliveryType === 'Yetkazib berish') {
      if (!street.trim()) e.street = 'Ko\'chani kiriting';
      if (!house.trim()) e.house = 'Uy/kvartirani kiriting';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setStep('loading');

    const orderItems = items.map(({ item, quantity }) => ({
      name: item.name,
      quantity,
      price: item.price,
    }));

    const orderData = {
      customerName: name,
      phone,
      city: deliveryType === 'Yetkazib berish' ? city : '',
      street: deliveryType === 'Yetkazib berish' ? street : '',
      house: deliveryType === 'Yetkazib berish' ? house : '',
      landmark,
      deliveryType,
      paymentMethod,
      notes,
      items: orderItems,
      subtotal,
      deliveryFee,
      discount,
      total,
    };

    const { data: order } = await api.createOrder(orderData);
    await sendTelegramNotification(order);

    setCompletedOrder(order);
    setStep('success');
    clearCart();
  };

  const handleClose = () => {
    if (step === 'success' && completedOrder) {
      onSuccess(completedOrder);
    }
    onClose();
    // Reset form after animation
    setTimeout(() => {
      setName(''); setPhone(''); setStreet(''); setHouse('');
      setLandmark(''); setNotes(''); setErrors({});
      setCompletedOrder(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={handleClose}>
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'form' && (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="font-display font-bold text-xl text-slate-900">Buyurtma berish</h2>
              <button onClick={handleClose} className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">To'liq ism</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ism Familiya"
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors ${errors.name ? 'border-red-300' : 'border-slate-200 focus:border-amber-400'}`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefon raqam</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="+998 90 123 45 67"
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors ${errors.phone ? 'border-red-300' : 'border-slate-200 focus:border-amber-400'}`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Delivery type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Yetkazib berish turi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('Yetkazib berish')}
                    className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all ${deliveryType === 'Yetkazib berish' ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <Truck className={`w-5 h-5 ${deliveryType === 'Yetkazib berish' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-slate-900">Yetkazib berish</div>
                      <div className="text-xs text-slate-400">Kuryer orqali</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('Olib ketish')}
                    className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all ${deliveryType === 'Olib ketish' ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <Store className={`w-5 h-5 ${deliveryType === 'Olib ketish' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-slate-900">Olib ketish</div>
                      <div className="text-xs text-slate-400">Filialdan</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Address — only for delivery */}
              {deliveryType === 'Yetkazib berish' && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors appearance-none"
                    >
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ko'cha nomi"
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${errors.street ? 'border-red-300' : 'border-slate-200 focus:border-amber-400'}`}
                  />
                  {errors.street && <p className="text-xs text-red-500 -mt-1">{errors.street}</p>}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={house}
                      onChange={(e) => setHouse(e.target.value)}
                      placeholder="Uy / Kvartira"
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${errors.house ? 'border-red-300' : 'border-slate-200 focus:border-amber-400'}`}
                    />
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Orientir (ixtiyoriy)"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  {errors.house && <p className="text-xs text-red-500 -mt-1">{errors.house}</p>}
                </div>
              )}

              {/* Payment */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">To'lov usuli</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm ${paymentMethod === pm.id ? 'border-amber-400 bg-amber-50 font-semibold text-slate-900' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                    >
                      <span className="text-lg">{pm.icon}</span>
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Izoh (ixtiyoriy)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Qo'shimcha izohlar, pichoq-vilka kerakligi haqida..."
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-2">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Taomlar ({items.length})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Yetkazib berish</span>
                  <span>{deliveryFee === 0 ? 'Bepul' : formatPrice(deliveryFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Chegirma</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                  <span>Jami</span>
                  <span className="text-amber-400">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-terracotta-500 hover:from-amber-400 hover:to-terracotta-400 text-slate-950 font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Buyurtmani tasdiqlash
              </button>
            </form>
          </>
        )}

        {step === 'loading' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Buyurtma yuborilmoqda...</h3>
            <p className="text-slate-400 text-sm">Iltimos, kuting</p>
          </div>
        )}

        {step === 'success' && completedOrder && (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5 animate-scale-in">
              <Check className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">Buyurtma qabul qilindi!</h3>
            <p className="text-slate-500 text-sm mb-1">Buyurtma raqami:</p>
            <p className="font-mono font-bold text-amber-600 text-lg mb-6">{completedOrder.id}</p>

            <div className="bg-slate-50 rounded-2xl p-4 w-full space-y-2 text-sm mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Yetkazib berish turi</span>
                <span className="font-medium text-slate-900">{completedOrder.deliveryType}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>To'lov usuli</span>
                <span className="font-medium text-slate-900">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Buyurtma summasi</span>
                <span className="font-bold text-slate-900">{formatPrice(completedOrder.total)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 max-w-xs">
              Tez orada operator siz bilan bog'lanadi. Buyurtmangiz 30-45 daqiqa ichida tayyor bo'ladi.
            </p>

            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-amber-500 to-terracotta-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
            >
              Davom etish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
