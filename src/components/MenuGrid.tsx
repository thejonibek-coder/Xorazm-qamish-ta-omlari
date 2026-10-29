import MenuCard from '@/components/MenuCard';
import { useMenu } from '@/context/AppContext';
import type { MenuItem, CategoryId } from '@/types';
import { UtensilsCrossed } from 'lucide-react';

interface MenuGridProps {
  category: CategoryId;
  search: string;
  onDetails: (item: MenuItem) => void;
}

export default function MenuGrid({ category, search, onDetails }: MenuGridProps) {
  const { menu, loading } = useMenu();

  let filtered = menu;
  if (category !== 'all') {
    filtered = filtered.filter((m) => m.category === category);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.ingredients.some((i) => i.toLowerCase().includes(q)),
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
            <div className="aspect-[4/3] bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-slate-200 rounded w-20" />
                <div className="h-9 bg-slate-200 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <UtensilsCrossed className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="font-display font-bold text-xl text-slate-700 mb-1">Taom topilmadi</h3>
        <p className="text-slate-400 text-sm">Boshqa kategoriya yoki qidiruv so'zini sinab ko'ring.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {filtered.map((item) => (
        <MenuCard key={item.id} item={item} onDetails={onDetails} />
      ))}
    </div>
  );
}
