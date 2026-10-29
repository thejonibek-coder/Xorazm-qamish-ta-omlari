import { Phone, Clock, MapPin, Mail, Instagram, MessageCircle, Facebook, Send } from 'lucide-react';

const branches = [
  { name: 'Chilonzor filiali', address: 'Chilonzor tumani, Bunyodkor shoh ko\'chasi, 12-uy', phone: '+998 71 234 56 78' },
  { name: 'Novza filiali', address: 'Yunusobod tumani, Amir Temur shoh ko\'chasi, 45-uy', phone: '+998 71 345 67 89' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-terracotta-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="font-display font-bold text-slate-950 text-lg">Q</span>
              </div>
              <div>
                <span className="font-display font-bold text-white text-xl block leading-none">Qamish</span>
                <span className="text-xs text-amber-400/80">Xorazm Taomlari</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              An'anaviy Xorazm taomlarini zamonaviy uslubda tayyorlab, tez va sifatli yetkazib beramiz. 100% halol, 100% mazali.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Instagram, label: 'Instagram' },
                { Icon: MessageCircle, label: 'Telegram' },
                { Icon: Facebook, label: 'Facebook' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 flex items-center justify-center transition-all group"
                >
                  <Icon className="w-4.5 h-4.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-4">Bog'lanish</h3>
            <div className="space-y-3">
              <a href="tel:+998712345678" className="flex items-center gap-3 text-sm hover:text-amber-400 transition-colors">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                +998 71 234 56 78
              </a>
              <a href="mailto:info@qamish.uz" className="flex items-center gap-3 text-sm hover:text-amber-400 transition-colors">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                info@qamish.uz
              </a>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                Har kuni: 09:00 — 23:00
              </div>
            </div>
          </div>

          {/* Branches */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="font-display font-bold text-white text-lg mb-4">Filiallar — Toshkent</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {branches.map((branch) => (
                <div key={branch.name} className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-amber-500/20 transition-colors">
                  <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    {branch.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">{branch.address}</p>
                  <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {branch.phone}
                  </a>
                </div>
              ))}
            </div>

            {/* Telegram subscribe */}
            <div className="mt-4 bg-gradient-to-r from-amber-500/10 to-terracotta-500/10 border border-amber-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Telegram orqali yangiliklar</p>
                  <p className="text-xs text-slate-400">Aksiyalar va yangi taomlar haqida xabardor bo'ling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2026 Qamish — Xorazm Taomlari. Barcha huquqlar himoyalangan.</p>
          <p className="text-xs text-slate-500">Made with care in Tashkent 🇺🇿</p>
        </div>
      </div>
    </footer>
  );
}
