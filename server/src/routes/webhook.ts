import { Router } from 'express';
import { JsonDb } from '../db.js';
import type { Order, MenuItem } from '../types.js';

const router = Router();
const orderDb = new JsonDb<Order>('orders');
const menuDb = new JsonDb<MenuItem>('menu');

// Simple fuzzy match
function findMenuItem(text: string, items: MenuItem[]): MenuItem | null {
  const lower = text.toLowerCase();
  for (const item of items) {
    if (lower.includes(item.name.toLowerCase())) return item;
  }
  return null;
}

// POST /api/webhook/whatsapp
// Receives messages from n8n / WhatsApp Business API
router.post('/whatsapp', (req, res) => {
  const { from, body, timestamp } = req.body;

  if (!from || !body) {
    return res.status(400).json({ error: 'Missing from or body' });
  }

  const menuItems = menuDb.findAll();
  const matched = findMenuItem(body, menuItems);

  if (matched) {
    const order = orderDb.create({
      items: [
        {
          menuItemId: matched.id,
          name: matched.name,
          price: matched.price,
          quantity: 1,
        },
      ],
      customerName: 'WhatsApp Customer',
      customerPhone: from,
      customerAddress: 'To be confirmed',
      total: matched.price,
      status: 'pending',
      source: 'whatsapp',
      notes: body,
      createdAt: timestamp || new Date().toISOString(),
    });

    return res.json({
      success: true,
      orderId: order.id,
      message: `Thanks! We received your order for ${matched.name} (GH₵${matched.price}). We'll confirm shortly.`,
    });
  }

  res.json({
    success: false,
    message:
      "Hi! Welcome to Joviva Foods.\n\nTo order, just tell us what you'd like:\n- Fried Rice\n- Jollof Rice\n- Wakye\n- Spaghetti\n- Plain Rice\n- Ampesi\n\nOr visit: http://localhost:3001/",
  });
});

export default router;
