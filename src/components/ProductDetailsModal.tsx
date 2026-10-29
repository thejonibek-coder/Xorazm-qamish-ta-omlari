import { useState, useEffect } from 'react';
import { X, Star, Clock, Flame, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import type { MenuItem } from '@/types';
import { useCart } from '@/context/AppContext';
import { formatPrice } from '@/utils/format';

interface ProductDetailsModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function ProductDetailsModal({ item, onClose }: ProductDetailsModalProps) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (item) {
      setQty(1);
      setAdded(false);
    }
  }, [item]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const handleAdd = () => {
    addItem(item, qty);
    setAdded(true);
    setTimeout(() => {
      onClose();
      openCart();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
        >
          <X className="w-5 h-5 text-slate-700" />
        </button>

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {item.badge && (
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-terracotta-500 text-slate-950 shadow-lg">
              {item.badge}
            </span>
          )}
          <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{item.rating}</span>
              <span className="text-white/70">({item.reviewsCount})</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">{item.name}</h2>
          <p className="text-slate-500 leading-relaxed mb-4">{item.description}</p>

          {/* Meta tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm">
              <Clock className="w-4 h-4" />
              {item.prepTime}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm">
              <Flame className="w-4 h-4 text-terracotta-500" />
              {item.calories} kkal
            </span>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Tarkibi:</h4>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ing, i) => (
                <span key={i} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-sm font-medium">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity + Price + Add */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4 text-slate-600" />
              </button>
              <span className="font-bold text-lg text-slate-900 w-8 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg flex-1 justify-center ${
                added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-terracotta-500 hover:from-amber-400 hover:to-terracotta-400 text-slate-950 shadow-amber-500/20 active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Qo'shildi!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {formatPrice(item.price * qty)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
