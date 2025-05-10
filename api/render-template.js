// api/render-template.js
module.exports = async (req, res) => {
  try {
    const { templateId } = req.query;
    
    if (!templateId) {
      return res.status(400).json({ error: 'Missing templateId parameter' });
    }
    
    // Get all parameters from query string
    const {
      title,
      price,
      sku,
      description,
      company,
      phone,
      email,
      website
    } = req.query;
    
    // Read template SVG
    const path = require('path');
    const fs = require('fs');
    
    const templatesDir = path.join(process.cwd(), 'client/public/templates');
    const svgPath = path.join(templatesDir, `${templateId}.svg`);
    
    if (!fs.existsSync(svgPath)) {
      return res.status(404).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <text x="20" y="150" font-family="Arial" font-size="20" fill="red">Template not found: ${templateId}</text>
      </svg>`);
    }
    
    // Read SVG content
    let svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Replace placeholders with actual values
    if (title) svgContent = svgContent.replace(/{{PRODUCT_TITLE}}/g, title);
    if (price) svgContent = svgContent.replace(/{{PRODUCT_PRICE}}/g, price);
    if (sku) svgContent = svgContent.replace(/{{PRODUCT_SKU}}/g, sku);
    if (description) svgContent = svgContent.replace(/{{PRODUCT_DESCRIPTION}}/g, description);
    if (company) svgContent = svgContent.replace(/{{COMPANY_NAME}}/g, company);
    if (phone) svgContent = svgContent.replace(/{{PHONE_NUMBER}}/g, phone);
    if (email) svgContent = svgContent.replace(/{{EMAIL}}/g, email);
    if (website) svgContent = svgContent.replace(/{{WEBSITE}}/g, website);
    
    // Replace any remaining placeholders with empty strings
    svgContent = svgContent.replace(/{{[^}]+}}/g, '');
    
    // Set SVG content type header
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svgContent);
    
  } catch (error) {
    console.error('Error rendering template:', error);
    res.status(500).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <text x="20" y="150" font-family="Arial" font-size="20" fill="red">Error: ${error.message}</text>
    </svg>`);
  }
};
