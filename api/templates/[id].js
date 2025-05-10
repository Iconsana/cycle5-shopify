// api/templates/[id].js
module.exports = (req, res) => {
  const { id } = req.query;
  
  try {
    const path = require('path');
    const fs = require('fs');
    const templatesDir = path.join(process.cwd(), 'client/public/templates');
    const filePath = path.join(templatesDir, `${id}.svg`);
    
    if (fs.existsSync(filePath)) {
      const svgContent = fs.readFileSync(filePath, 'utf8');
      
      // Critical: Set correct content-type header
      res.setHeader('Content-Type', 'image/svg+xml');
      res.status(200).send(svgContent);
    } else {
      // Return error as SVG
      const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150">
        <text x="10" y="50" fill="red">Template not found: ${id}</text>
      </svg>`;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.status(404).send(errorSvg);
    }
  } catch (error) {
    console.error(`Error serving template ${id}:`, error);
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150">
      <text x="10" y="50" fill="red">Error: ${error.message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(errorSvg);
  }
};
