// Vercel serverless function for templates API
const fs = require('fs').promises;
const path = require('path');

// Hardcoded templates data until we can get file reading working properly
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

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Force content type to JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Return success response
  return res.status(200).json({
    success: true,
    data: templates
  });
};
