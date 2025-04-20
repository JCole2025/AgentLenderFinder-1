
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

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

router.get('/widget.js', cors(), (req, res) => {
  res.header('Content-Type', 'application/javascript');
  const widgetCode = `
    (function() {
      const container = document.getElementById('agent-finder-widget');
      if (!container) return;

      // Add styles
      const style = document.createElement('style');
      style.textContent = ${JSON.stringify(widgetCss)};
      document.head.appendChild(style);

      // Create and append form
      container.innerHTML = ${JSON.stringify(widgetHtml)};

      // Add event listener
      const form = document.getElementById('agent-finder-form');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());
          
          try {
            const response = await fetch('https://agent-lender-finder-joseph274.replit.app/api/submit-finder', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                finderType: 'agent',
                formData: {
                  transaction_type: 'buy',
                  property_type: data.property_type,
                  location: data.location,
                  price_min: data.price_min,
                  price_max: data.price_max
                }
              })
            });
            
            if (!response.ok) throw new Error('Submission failed');
            alert('Form submitted successfully!');
            form.reset();
          } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting the form. Please try again.');
          }
        });
      }
    })();
  `;
  res.send(widgetCode);
});

// Keep existing /api/widget endpoint for compatibility
router.get('/api/widget', cors(), (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  const widgetHtml = `
    <div id="agent-finder-widget" class="bp-widget">
      <form id="agent-finder-form">
        <div class="form-group">
          <label for="property-type">Property Type</label>
          <select id="property-type" name="property_type" required>
            <option value="">Select Property Type</option>
            <option value="single_family">Single Family</option>
            <option value="multi_family">Multi Family</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div class="form-group">
          <label for="location">Location</label>
          <input type="text" id="location" name="location" placeholder="City, State" required>
        </div>
        <div class="form-group">
          <label for="price-range">Price Range</label>
          <div class="price-inputs">
            <input type="number" id="price-min" name="price_min" placeholder="Min Price" required>
            <input type="number" id="price-max" name="price_max" placeholder="Max Price" required>
          </div>
        </div>
        <button type="submit" class="submit-button">Find Agents</button>
      </form>
    </div>
  `;

  const widgetCss = `
    .bp-widget {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .bp-widget form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .bp-widget .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .bp-widget label {
      font-weight: 600;
      color: #333;
    }
    
    .bp-widget input,
    .bp-widget select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .bp-widget .price-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    .bp-widget .submit-button {
      background-color: #0052CC;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .bp-widget .submit-button:hover {
      background-color: #0747A6;
    }
  `;

  res.json({
    html: widgetHtml,
    css: widgetCss,
    script: widgetScript
  });
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
