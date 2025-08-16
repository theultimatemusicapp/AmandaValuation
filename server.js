import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const COUPON_CODE = process.env.COUPON_CODE || '';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/validate-coupon', (req, res) => {
  const { coupon } = req.body || {};
  if (coupon && coupon === COUPON_CODE) {
    const token = jwt.sign({ coupon }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ success: true, token });
  }
  return res.status(400).json({ success: false, message: 'Invalid coupon code' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
