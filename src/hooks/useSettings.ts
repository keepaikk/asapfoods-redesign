import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface SiteSettings {
  heroImage: string;
  logoImage: string;
  eventBanner: string;
  galleryImage1: string;
  galleryImage2: string;
  galleryImage3: string;
  phone: string;
  whatsappMessage: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  restaurantLat?: number;
  restaurantLng?: number;
  restaurantAddress?: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  return { settings };
}
