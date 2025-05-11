// api/render-template.js
module.exports = async (req, res) => {
  try {
    const { templateId } = req.query;
    
    if (!templateId) {
      return res.status(400).json({ error: 'Missing templateId parameter' });
    }
    
    // Get parameters from query - include all the new fields for Solar Bulk Deal
    const {
      title,
      price,
      sku,
      description,
      company,
      phone,
      email,
      website,
      imageUrl,
      // New fields for Solar Bulk Deal template
      promotionTitle,
      imageTitle,
      secondaryDescription,
      bulletPoint1,
      bulletPoint2,
      bulletPoint3,
      bulletPoint4,
      bulletPoint5
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
    
    // Replace standard placeholders with actual values
    if (title) svgContent = svgContent.replace(/{{PRODUCT_TITLE}}/g, title);
    if (price) svgContent = svgContent.replace(/{{PRODUCT_PRICE}}/g, price);
    if (sku) svgContent = svgContent.replace(/{{PRODUCT_SKU}}/g, sku);
    if (description) svgContent = svgContent.replace(/{{PRODUCT_DESCRIPTION}}/g, description);
    if (company) svgContent = svgContent.replace(/{{COMPANY_NAME}}/g, company);
    if (phone) svgContent = svgContent.replace(/{{PHONE_NUMBER}}/g, phone);
    if (email) svgContent = svgContent.replace(/{{EMAIL}}/g, email);
    if (website) svgContent = svgContent.replace(/{{WEBSITE}}/g, website);
    
    // Handle Solar Bulk Deal specific placeholders
    if (promotionTitle) {
      svgContent = svgContent.replace(/{{PROMOTION_TITLE}}/g, promotionTitle);
    } else {
      svgContent = svgContent.replace(/{{PROMOTION_TITLE}}/g, 'SOLAR BULK DEAL');
    }
    
    if (imageTitle) {
      svgContent = svgContent.replace(/{{IMAGE_TITLE}}/g, imageTitle);
    } else {
      svgContent = svgContent.replace(/{{IMAGE_TITLE}}/g, '');
    }
    
    if (secondaryDescription) {
      svgContent = svgContent.replace(/{{SECONDARY_DESCRIPTION}}/g, secondaryDescription);
    } else {
      svgContent = svgContent.replace(/{{SECONDARY_DESCRIPTION}}/g, 'Bulk Deal');
    }
    
    // Handle bullet points
    if (bulletPoint1) svgContent = svgContent.replace(/{{BULLET_POINT_1}}/g, bulletPoint1);
    if (bulletPoint2) svgContent = svgContent.replace(/{{BULLET_POINT_2}}/g, bulletPoint2);
    if (bulletPoint3) svgContent = svgContent.replace(/{{BULLET_POINT_3}}/g, bulletPoint3);
    if (bulletPoint4) svgContent = svgContent.replace(/{{BULLET_POINT_4}}/g, bulletPoint4);
    if (bulletPoint5) svgContent = svgContent.replace(/{{BULLET_POINT_5}}/g, bulletPoint5);
    
    // Handle image embedding - use a placeholder if no image is provided
    if (imageUrl) {
      // If it's already a data URI, use it directly
      if (imageUrl.startsWith('data:')) {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, imageUrl);
      } else {
        // For image URLs, try to fetch and convert to data URI
        try {
          const fetch = require('node-fetch');
          const response = await fetch(imageUrl);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = buffer.toString('base64');
          const mimeType = response.headers.get('content-type') || 'image/jpeg';
          const dataUri = `data:${mimeType};base64,${base64Image}`;
          svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, dataUri);
        } catch (error) {
          console.error('Error fetching image:', error);
          // Use a transparent placeholder
          svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        }
      }
    } else {
      // Use a transparent placeholder if no image
      svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    }
    
    // Replace any remaining placeholders with empty strings
    // This handles any bullet points that weren't provided
    svgContent = svgContent.replace(/{{BULLET_POINT_\d+}}/g, ''); // Clear any remaining bullet points
    svgContent = svgContent.replace(/{{[^}]+}}/g, ''); // Clear any other remaining placeholders
    
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
