
import express from 'express';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(client);
const router = express.Router();

router.get('/api/leads', async (req, res) => {
  try {
    const leads = await db.query.finderSubmissions.findMany();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

export default router;
