import { Star, Plus, Clock, Flame } from 'lucide-react';
import type { MenuItem } from '@/types';
import { useCart } from '@/context/AppContext';
import { formatPrice } from '@/utils/format';

interface MenuCardProps {
  item: MenuItem;
  onDetails: (item: MenuItem) => void;
}

const badgeStyles: Record<string, string> = {
  'Hit': 'bg-red-500 text-white',
  'Xorazm Brendi': 'bg-gradient-to-r from-amber-500 to-terracotta-500 text-slate-950',
  'Tavsiya etiladi': 'bg-emerald-500 text-white',
  'An\'anaviy': 'bg-slate-800 text-amber-400',
};

export default function MenuCard({ item, onDetails }: MenuCardProps) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
  };

  return (
    <article
      onClick={() => onDetails(item)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 cursor-pointer border border-slate-100 hover:border-amber-200 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badge */}
        {item.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${badgeStyles[item.badge] || 'bg-slate-800 text-white'}`}>
            {item.badge}
          </span>
        )}

        {/* Old price */}
        {item.oldPrice && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-red-500 line-through shadow-sm">
            {item.oldPrice.toLocaleString('uz-UZ')}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display font-bold text-lg text-slate-900 leading-tight line-clamp-1 group-hover:text-amber-600 transition-colors">
            {item.name}
          </h3>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed min-h-[2.5rem]">
          {item.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-600">{item.rating}</span>
            <span>({item.reviewsCount})</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {item.prepTime}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-terracotta-400" />
            {item.calories} kkal
          </span>
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">{item.price.toLocaleString('uz-UZ')}</span>
            <span className="text-xs text-slate-400 -mt-0.5">so'm</span>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-terracotta-500 hover:text-slate-950 text-white font-semibold px-3 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="text-sm">Qo'shish</span>
          </button>
        </div>
      </div>
    </article>
  );
}
