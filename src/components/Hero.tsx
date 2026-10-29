import { Clock, Beef, ScrollText, ChevronRight, UtensilsCrossed, ShoppingBag } from 'lucide-react';

interface HeroProps {
  onMenuScroll: () => void;
  onOrderScroll: () => void;
}

const uspBadges = [
  { icon: Clock, title: '30-45 min', subtitle: 'Yetkazib berish' },
  { icon: Beef, title: '100% Halol', subtitle: 'Mol va qo\'y go\'shti' },
  { icon: ScrollText, title: 'An\'anaviy', subtitle: 'Retseptlar' },
];

export default function Hero({ onMenuScroll, onOrderScroll }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background gradient + pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(201, 106, 67, 0.2) 0%, transparent 50%)',
      }} />

      {/* Decorative circles */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-terracotta-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Xorazmning haqiqiy ta'mi — hozir Toshkentda
            </div>

            {/* Heading */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
              Xorazm lazzati —
              <span className="block bg-gradient-to-r from-amber-400 via-amber-300 to-terracotta-400 bg-clip-text text-transparent">
                an'ana va zamonaviylik uyg'unligi
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-base lg:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Tandir gumma, Shivit oshi, Maxsus Qamish Burger va boshqa an'anaviy Xorazm taomlarini mazali va tez yetkazib beramiz.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <button
                onClick={onMenuScroll}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-terracotta-500 hover:from-amber-400 hover:to-terracotta-400 text-slate-950 font-semibold px-6 py-3.5 rounded-xl transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02]"
              >
                <UtensilsCrossed className="w-5 h-5" />
                Menyuni ko'rish
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOrderScroll}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 text-white font-semibold px-6 py-3.5 rounded-xl transition-all backdrop-blur-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                Buyurtma berish
              </button>
            </div>

            {/* USP badges */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
              {uspBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center lg:items-start gap-1.5 text-center lg:text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <badge.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-sm font-semibold text-white">{badge.title}</div>
                  <div className="text-xs text-slate-400">{badge.subtitle}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main image */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-amber-500/10 ring-1 ring-white/10">
                <img
                  src="https://images.pexels.com/photos/5374420/pexels-photo-5374420.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Qamish maxsus burger"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>

              {/* Floating card 1 — rating */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 animate-bounce-subtle">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">★ 4.9</span>
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Mijozlar bahosi</div>
                  <div className="text-slate-500">1200+ ta baho</div>
                </div>
              </div>

              {/* Floating card 2 — delivery */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">30-45 daqiqa</div>
                  <div className="text-slate-500">Tez yetkazib berish</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative">
        <svg className="w-full h-12 fill-slate-50" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path d="M0,48 L1440,48 L1440,24 Q720,0 0,24 Z" />
        </svg>
      </div>
    </section>
  );
}
