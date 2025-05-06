// This is a serverless API handler for Vercel
const express = require('express');
const cors = require('cors');
const templatesRouter = require('./templates');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Use the templates router for /api/templates
app.use('/api/templates', templatesRouter);

// Products endpoint (basic implementation)
app.post('/api/products/extract-colors', (req, res) => {
  // Simple mock implementation since we can't process images in a serverless function
  res.json({
    success: true,
    data: {
      dominant: 'rgb(45,56,128)',
      palette: [
        'rgb(45,56,128)', 
        'rgb(67,89,156)', 
        'rgb(120,145,190)', 
        'rgb(200,210,230)', 
        'rgb(245,245,250)'
      ]
    }
  });
});

// Handle all other routes
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Export for Vercel serverless functions
module.exports = app;
