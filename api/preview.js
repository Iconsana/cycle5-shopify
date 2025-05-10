// api/preview.js
module.exports = async (req, res) => {
  const { templateId } = req.query;
  
  if (!templateId) {
    return res.status(400).json({ error: 'Missing templateId parameter' });
  }
  
  try {
    const path = require('path');
    const fs = require('fs');
    
    // Build path to template SVG file
    const templatesDir = path.join(process.cwd(), 'client/public/templates');
    const svgPath = path.join(templatesDir, `${templateId}.svg`);
    
    // Check if file exists
    if (!fs.existsSync(svgPath)) {
      return res.status(404).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <rect width="400" height="300" fill="#f8f9fa" />
        <text x="20" y="150" font-family="Arial" font-size="20" fill="red">Template not found: ${templateId}</text>
      </svg>`);
    }
    
    // Read SVG file
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Set SVG content type header - THIS IS CRITICAL
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svgContent);
    
  } catch (error) {
    console.error('Error serving template:', error);
    res.status(500).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <rect width="400" height="300" fill="#f8f9fa" />
      <text x="20" y="150" font-family="Arial" font-size="20" fill="red">Error: ${error.message}</text>
    </svg>`);
  }
};
