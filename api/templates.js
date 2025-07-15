// api/templates.js
module.exports = (req, res) => {
  try {
    // Set proper headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    // Simple CORS handling
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    console.log('Templates API called');
    
    // List of available templates - ADDED debug template
    const templates = [
      { id: 'debug-simple', name: 'Debug Simple' },
      { id: 'battery-style', name: 'Battery Style' },
      { id: 'circuit-promo', name: 'Circuit Promo' },
      { id: 'gradient-seasonal', name: 'Gradient Seasonal' },
      { id: 'tech-enhanced', name: 'Tech Enhanced' },
      { id: 'solar-bulk-deal', name: 'Solar Bulk Deal' },
      { id: 'solar-kit-social', name: 'Solar Kit Social' }
    ];
    
    console.log('Templates API returning:', templates.length, 'templates');
    
    return res.status(200).json({
      success: true,
      data: templates,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Templates API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
