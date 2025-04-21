import express from 'express';
import { registerRoutes } from './routes';

// Create Express server
const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes
(async () => {
  await registerRoutes(app);
})();

// Export for Vercel serverless function
export default app;