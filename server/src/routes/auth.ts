import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@jovivafoods.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('admin123', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'joviva-secret-key-2024';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, email });
});

router.get('/verify', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }

  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
