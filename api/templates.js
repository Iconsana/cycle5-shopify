// api/templates.js
module.exports = (req, res) => {
  // Set proper headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Simple CORS handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Update this list to include the new template
  const templates = [
  { id: 'battery-style', name: 'Battery Style' },
  { id: 'circuit-promo', name: 'Circuit Promo' },
  { id: 'gradient-seasonal', name: 'Gradient Seasonal' },
  { id: 'tech-enhanced', name: 'Tech Enhanced' },
  { id: 'solar-bulk-deal', name: 'Solar Bulk Deal' },
  { id: 'solar-kit-social', name: 'Solar Kit Social' } // ADD THIS LINE
];
  
  return res.status(200).json({
    success: true,
    data: templates
  });
};
