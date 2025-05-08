// For /api/templates.js
module.exports = (req, res) => {
  // Set proper headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Simple CORS handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Hard-coded templates for now
  const templates = [
    { id: 'battery-style', name: 'Battery Style' },
    { id: 'circuit-promo', name: 'Circuit Promo' },
    { id: 'gradient-seasonal', name: 'Gradient Seasonal' },
    { id: 'tech-enhanced', name: 'Tech Enhanced' }
  ];
  
  return res.status(200).json({
    success: true,
    data: templates
  });
};
