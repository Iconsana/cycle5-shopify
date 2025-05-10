// api/preview/[templateId].js
module.exports = (req, res) => {
  const { templateId } = req.query;
  
  try {
    // Get SVG content (this is just an example, adjust to your implementation)
    const path = require('path');
    const fs = require('fs');
    const templatesDir = path.join(process.cwd(), 'client/public/templates');
    const filePath = path.join(templatesDir, `${templateId}.svg`);
    const svgContent = fs.readFileSync(filePath, 'utf8');
    
    // Critical: Set correct content-type header
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svgContent);
  } catch (error) {
    // Return error as SVG, not as JSON
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150">
      <text x="10" y="50" fill="red">Error: ${error.message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(errorSvg);
  }
};
