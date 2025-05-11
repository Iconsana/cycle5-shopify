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
      // Basic product data
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
      
      // Solar Bulk Deal specific fields
      if (productData.promotionTitle) {
        svgContent = svgContent.replace(/{{PROMOTION_TITLE}}/g, productData.promotionTitle);
      } else {
        svgContent = svgContent.replace(/{{PROMOTION_TITLE}}/g, 'SOLAR BULK DEAL');
      }
      
      if (productData.imageTitle) {
        svgContent = svgContent.replace(/{{IMAGE_TITLE}}/g, productData.imageTitle);
      } else {
        svgContent = svgContent.replace(/{{IMAGE_TITLE}}/g, '');
      }
      
      if (productData.secondaryDescription) {
        svgContent = svgContent.replace(/{{SECONDARY_DESCRIPTION}}/g, productData.secondaryDescription);
      } else {
        svgContent = svgContent.replace(/{{SECONDARY_DESCRIPTION}}/g, 'Bulk Deal');
      }
      
      // Bullet points
      if (productData.bulletPoint1) svgContent = svgContent.replace(/{{BULLET_POINT_1}}/g, productData.bulletPoint1);
      if (productData.bulletPoint2) svgContent = svgContent.replace(/{{BULLET_POINT_2}}/g, productData.bulletPoint2);
      if (productData.bulletPoint3) svgContent = svgContent.replace(/{{BULLET_POINT_3}}/g, productData.bulletPoint3);
      if (productData.bulletPoint4) svgContent = svgContent.replace(/{{BULLET_POINT_4}}/g, productData.bulletPoint4);
      if (productData.bulletPoint5) svgContent = svgContent.replace(/{{BULLET_POINT_5}}/g, productData.bulletPoint5);
      
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
    // First, clear any remaining bullet points
    svgContent = svgContent.replace(/{{BULLET_POINT_\d+}}/g, '');
    // Then clear any other remaining placeholders
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
