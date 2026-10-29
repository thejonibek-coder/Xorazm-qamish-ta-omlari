import { useState, useRef, useCallback } from 'react';
import { CartProvider, MenuProvider, LogProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryPills from '@/components/CategoryPills';
import MenuGrid from '@/components/MenuGrid';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import AdminDashboard from '@/components/AdminDashboard';
import Footer from '@/components/Footer';
import type { MenuItem, CategoryId, Order } from '@/types';

function AppContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);

  const scrollToMenu = useCallback(() => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToOrder = useCallback(() => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleCheckoutClose = useCallback(() => {
    setCheckoutOpen(false);
  }, []);

  const handleOrderSuccess = useCallback((_order: Order) => {
    // Order created successfully — could show a toast etc.
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onCategorySelect={setActiveCategory}
        onOpenAdmin={() => setAdminOpen(true)}
        onSearch={setSearchQuery}
        onMenuScroll={scrollToMenu}
        onOrderScroll={scrollToOrder}
      />

      <Hero onMenuScroll={scrollToMenu} onOrderScroll={scrollToOrder} />

      {/* Menu section */}
      <main ref={menuRef} className="max-w-7xl mx-auto px-4 py-8 lg:py-12 scroll-mt-32">
        <div className="mb-6">
          <div className="flex items-end justify-between gap-4 mb-1">
            <div>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-slate-900">Bizning menyu</h2>
              <p className="text-slate-400 text-sm mt-0.5">Haqiqiy Xorazm taomlarini tanlang</p>
            </div>
          </div>
        </div>

        <CategoryPills active={activeCategory} onSelect={setActiveCategory} />

        <div ref={orderRef} className="mt-6 scroll-mt-32">
          <MenuGrid
            category={activeCategory}
            search={searchQuery}
            onDetails={setSelectedItem}
          />
        </div>
      </main>

      <Footer />

      {/* Overlays */}
      <ProductDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={handleCheckoutClose}
        onSuccess={handleOrderSuccess}
      />
      <AdminDashboard isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <LogProvider>
      <MenuProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </MenuProvider>
    </LogProvider>
  );
}
