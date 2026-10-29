export type CategoryId =
  | 'all'
  | 'burgers'
  | 'gumma-somsa'
  | 'milliy'
  | 'baliqlar'
  | 'salatlar-ichimliklar';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: Exclude<CategoryId, 'all'>;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  prepTime: string;
  calories: number;
  ingredients: string[];
  image: string;
  badge?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type OrderStatus = 'Yangi' | "Tayyorlanmoqda" | "Yo'lda" | 'Yetkazildi';

export type DeliveryType = 'Yetkazib berish' | 'Olib ketish';
export type PaymentMethod = 'Payme' | 'Click' | 'Naqd' | 'Karta orqali kuryerga';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  street: string;
  house: string;
  landmark: string;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  notes: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  status: number;
}
