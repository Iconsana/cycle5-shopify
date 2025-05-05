// This is a simple example of a serverless function that will handle API requests
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Templates endpoint
app.get('/api/templates', async (req, res) => {
  try {
    // In serverless functions, we can't access the file system directly
    // So we'll return sample data instead
    const templates = [
      {
        id: 'battery-style',
        name: 'Battery Style',
        file: 'battery-style.svg'
      },
      {
        id: 'circuit-promo',
        name: 'Circuit Promo',
        file: 'circuit-promo.svg'
      },
      {
        id: 'gradient-seasonal',
        name: 'Gradient Seasonal',
        file: 'gradient-seasonal.svg'
      },
      {
        id: 'tech-enhanced',
        name: 'Tech Enhanced',
        file: 'tech-enhanced.svg'
      }
    ];
    
    res.json({ success: true, data: templates });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get specific template
app.get('/api/templates/:id', async (req, res) => {
  // In a real implementation, you would fetch the template content
  res.json({
    success: true,
    data: {
      id: req.params.id,
      name: req.params.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      file: `${req.params.id}.svg`,
      content: '<svg>...</svg>' // Placeholder for actual content
    }
  });
});

// Handle all other routes
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Export for Vercel serverless functions
module.exports = app;
