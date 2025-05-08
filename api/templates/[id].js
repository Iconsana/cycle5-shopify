module.exports = (req, res) => {
  // Set headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const id = req.query.id;
  
  // Simple template mapping
  const templates = {
    'battery-style': {
      id: 'battery-style', 
      name: 'Battery Style',
      content: '<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="1200" fill="#001428"/><polygon points="0,350 1200,500 1200,1200 0,1200" fill="white" opacity="0.97"/><text x="150" y="150" font-family="Arial" font-size="70" fill="white">{{COMPANY_NAME}}</text><text x="150" y="500" font-family="Arial" font-size="40" fill="#002651">{{PRODUCT_TITLE}}</text></svg>'
    },
    // Add other templates with simplified SVG code
  };
  
  if (!templates[id]) {
    return res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }
  
  return res.status(200).json({
    success: true,
    data: templates[id]
  });
};
