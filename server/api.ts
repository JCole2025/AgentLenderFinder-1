import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(client);
const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter); // Apply rate limiting middleware

router.get('/api/leads', async (req, res) => {
  try {
    const leads = await db.query.finderSubmissions.findMany();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

export default router;