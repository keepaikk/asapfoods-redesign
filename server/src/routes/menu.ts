import { Router } from 'express';
import { JsonDb } from '../db.js';
import type { MenuItem } from '../types.js';

const router = Router();
const menuDb = new JsonDb<MenuItem>('menu');

// Seed initial data if empty
const seedData = [
  {
    id: 'fried-rice-1',
    name: 'Fried Rice',
    description: 'Savory fried rice with vegetables and your choice of protein.',
    price: 40,
    category: 'Fried Rice',
    image: '/images/menu-fried-rice.jpg',
    featured: true,
    popular: true,
    available: true,
  },
  {
    id: 'jollof-1',
    name: 'Jollof Rice',
    description: 'Classic Ghanaian Jollof rice, spicy and flavorful.',
    price: 40,
    category: 'Jollof',
    image: 'https://images.pexels.com/photos/13915043/pexels-photo-13915043.jpeg?auto=compress&cs=tinysrgb&w=800',
    popular: true,
    available: true,
  },
  {
    id: 'wakye-1',
    name: 'Wakye',
    description: 'Traditional rice and beans dish served with shito and sides.',
    price: 40,
    category: 'Wakye',
    image: 'https://images.pexels.com/photos/32612769/pexels-photo-32612769.jpeg?auto=compress&cs=tinysrgb&w=800',
    popular: true,
    available: true,
  },
  {
    id: 'spaghetti-1',
    name: 'Spaghetti with Chicken',
    description: 'Delicious spaghetti served with well-seasoned chicken.',
    price: 40,
    category: 'Offers',
    image: 'https://images.pexels.com/photos/9814666/pexels-photo-9814666.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
  },
  {
    id: 'plain-rice-1',
    name: 'Plain Rice',
    description: 'Steamed plain rice served with stew or gravy.',
    price: 35,
    category: 'Plain Rice',
    image: 'https://images.pexels.com/photos/8994586/pexels-photo-8994586.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
  },
  {
    id: 'ampesi-1',
    name: 'Ampesi',
    description: 'Boiled yam or plantain served with garden egg stew or palava sauce.',
    price: 45,
    category: 'Ampesi',
    image: 'https://images.pexels.com/photos/27556971/pexels-photo-27556971.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
  },
];

if (menuDb.findAll().length === 0) {
  seedData.forEach(item => menuDb.create(item));
}

// GET /api/menu
router.get('/', (_req, res) => {
  const items = menuDb.findAll().filter(item => item.available !== false);
  res.json(items);
});

// GET /api/menu/all (admin - includes unavailable)
router.get('/all', (_req, res) => {
  res.json(menuDb.findAll());
});

// GET /api/menu/categories
router.get('/categories', (_req, res) => {
  const items = menuDb.findAll();
  const categories = [...new Set(items.map(i => i.category))];
  res.json(categories);
});

// GET /api/menu/:id
router.get('/:id', (req, res) => {
  const item = menuDb.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// POST /api/menu
router.post('/', (req, res) => {
  const item = menuDb.create(req.body);
  res.status(201).json(item);
});

// PATCH /api/menu/:id
router.patch('/:id', (req, res) => {
  const item = menuDb.update(req.params.id, req.body);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// DELETE /api/menu/:id
router.delete('/:id', (req, res) => {
  const ok = menuDb.delete(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

export default router;
