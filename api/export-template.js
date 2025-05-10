// api/export-template.js
module.exports = async (req, res) => {
  // This endpoint must handle both GET and POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
  
  try {
    const { templateId, format } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ error: 'Missing templateId parameter' });
    }
    
    // Get data from request body
    const {
      productData,
      companyData
    } = req.body;
    
    // Read template SVG
    const path = require('path');
    const fs = require('fs');
    
    const templatesDir = path.join(process.cwd(), 'client/public/templates');
    const svgPath = path.join(templatesDir, `${templateId}.svg`);
    
    if (!fs.existsSync(svgPath)) {
      return res.status(404).json({ error: `Template not found: ${templateId}` });
    }
    
    // Read SVG content
    let svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Replace placeholders with actual values
    if (productData) {
      if (productData.title) {
        svgContent = svgContent.replace(/{{PRODUCT_TITLE}}/g, productData.title);
      }
      if (productData.price) {
        svgContent = svgContent.replace(/{{PRODUCT_PRICE}}/g, productData.price);
      }
      if (productData.sku) {
        svgContent = svgContent.replace(/{{PRODUCT_SKU}}/g, productData.sku);
      }
      if (productData.description) {
        svgContent = svgContent.replace(/{{PRODUCT_DESCRIPTION}}/g, productData.description);
      }
      
      // Handle image embedding
      if (productData.image) {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, productData.image);
      } else {
        // Use a transparent placeholder
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      }
    }
    
    if (companyData) {
      if (companyData.name) {
        svgContent = svgContent.replace(/{{COMPANY_NAME}}/g, companyData.name);
      }
      if (companyData.phone) {
        svgContent = svgContent.replace(/{{PHONE_NUMBER}}/g, companyData.phone);
      }
      if (companyData.email) {
        svgContent = svgContent.replace(/{{EMAIL}}/g, companyData.email);
      }
      if (companyData.website) {
        svgContent = svgContent.replace(/{{WEBSITE}}/g, companyData.website);
      }
    }
    
    // Replace any remaining placeholders with empty strings
    svgContent = svgContent.replace(/{{[^}]+}}/g, '');
    
    // If format is PNG, convert SVG to PNG
    if (format === 'png') {
      // For Vercel serverless functions, we can use an external library like sharp
      try {
        const sharp = require('sharp');
        const pngBuffer = await sharp(Buffer.from(svgContent))
          .toFormat('png')
          .toBuffer();
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${templateId}.png"`);
        return res.status(200).send(pngBuffer);
      } catch (sharpError) {
        console.error('Error converting to PNG:', sharpError);
        // Fall back to SVG if PNG conversion fails
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', `attachment; filename="${templateId}.svg"`);
        return res.status(200).send(svgContent);
      }
    }
    
    // Otherwise, return as SVG
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', `attachment; filename="${templateId}.svg"`);
    res.status(200).send(svgContent);
    
  } catch (error) {
    console.error('Error exporting template:', error);
    res.status(500).json({ error: error.message });
  }
};
