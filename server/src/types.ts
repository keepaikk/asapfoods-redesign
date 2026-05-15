export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
  featured?: boolean;
  available?: boolean;
}

export interface Order {
  id: string;
  items: { menuItemId: string; name: string; price: number; quantity: number }[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  source: 'web' | 'whatsapp';
  notes?: string;
  createdAt: string;
}

export interface WebhookMessage {
  from: string;
  body: string;
  timestamp: string;
}

export interface SiteSettings {
  id: string;
  heroImage: string;
  logoImage: string;
  eventBanner: string;
  phone: string;
  whatsappMessage: string;
  restaurantLat?: number;
  restaurantLng?: number;
  restaurantAddress?: string;
}
