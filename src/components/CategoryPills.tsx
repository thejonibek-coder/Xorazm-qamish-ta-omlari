import { categories } from '@/data/menu';
import type { CategoryId } from '@/types';

interface CategoryPillsProps {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
}

export default function CategoryPills({ active, onSelect }: CategoryPillsProps) {
  return (
    <div className="sticky top-16 lg:top-20 z-30 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/60 py-3 -mx-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-terracotta-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-600 border border-slate-200'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
