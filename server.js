import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const COUPON_CODE = process.env.COUPON_CODE || 'freeval05';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(express.json());

function getToken(req) {
  const cookie = req.headers.cookie || '';
  return cookie
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('token='))?.split('=')[1] || null;
}

function verifyToken(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.redirect('/payment.html');
  }
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.redirect('/payment.html');
  }
}

app.post('/api/validate-coupon', (req, res) => {
  const { coupon } = req.body || {};
  if (coupon && coupon === COUPON_CODE) {
    const token = jwt.sign({ coupon }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ success: true, token });
  }
  return res.status(400).json({ success: false, message: 'Invalid coupon code' });
});

app.post('/api/create-token', (req, res) => {
  const token = jwt.sign({ paid: true }, JWT_SECRET, { expiresIn: '1h' });
  return res.json({ success: true, token });
});

app.get('/pro-valuation.html', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pro-valuation.html'));
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
