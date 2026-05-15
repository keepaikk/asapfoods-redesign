import { Router } from 'express';
import { JsonDb } from '../db.js';
import type { SiteSettings } from '../types.js';

const router = Router();
const settingsDb = new JsonDb<SiteSettings>('settings');

const DEFAULTS: SiteSettings = {
  id: 'site',
  heroImage: '/images/hero.jpg',
  logoImage: '/images/logo.jpg',
  eventBanner: '/images/event-banner.jpg',
  phone: '233554984950',
  whatsappMessage: "Hi Joviva Foods! I'd like to place an order.",
  restaurantLat: 5.6891,
  restaurantLng: -0.1869,
  restaurantAddress: 'Kwabenya, Accra, Ghana',
};

function getSettings(): SiteSettings {
  const existing = settingsDb.findById('site');
  if (existing) return existing;
  settingsDb.create(DEFAULTS);
  return DEFAULTS;
}

router.get('/', (_req, res) => {
  res.json(getSettings());
});

router.patch('/', (req, res) => {
  const existing = settingsDb.findById('site');
  if (existing) {
    const updated = settingsDb.update('site', req.body);
    return res.json(updated);
  }
  const created = settingsDb.create({ ...DEFAULTS, ...req.body, id: 'site' });
  res.json(created);
});

export default router;
