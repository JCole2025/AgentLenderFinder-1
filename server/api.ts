import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(client);
const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

router.use(limiter);
router.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'Accept'],
  credentials: true
}));

// Serve the widget.js file
router.get('/widget.js', (req, res) => {
  const widgetPath = path.resolve(__dirname, '../dist/public/widget.js');
  if (fs.existsSync(widgetPath)) {
    res.type('application/javascript');
    res.sendFile(widgetPath);
  } else {
    res.status(404).send('Widget file not found');
  }
});


router.get('/api/leads', async (req, res) => {
  try {
    const leads = await db.query.finderSubmissions.findMany();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

export default router;