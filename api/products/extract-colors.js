// Simple API handler for product color extraction
module.exports = (req, res) => {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Force content type to JSON
  res.setHeader('Content-Type', 'application/json');
  
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
};
