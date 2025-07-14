// api/export-template.js - Cleaned version with removed fields
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
  
  try {
    const { templateId, format, productData, companyData } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ error: 'Missing templateId parameter' });
    }
    
    console.log('Export request:', { templateId, productData: !!productData, companyData: !!companyData });
    console.log('Product data keys:', productData ? Object.keys(productData) : []);
    
    // XML Escaping function to handle special characters
    const escapeXML = (str) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
    
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
    
    // Replace placeholders with actual values for solar-kit-social template
    if (templateId === 'solar-kit-social' && productData) {
      console.log('Processing solar-kit-social export with data:', Object.keys(productData));
      
      // Header fields - ONLY replace if data exists, NO DEFAULT VALUES
      if (productData.ratingText) svgContent = svgContent.replace(/{{RATING_TEXT}}/g, escapeXML(productData.ratingText));
      if (productData.brandText) svgContent = svgContent.replace(/{{BRAND_TEXT}}/g, escapeXML(productData.brandText));
      if (productData.categoryText) svgContent = svgContent.replace(/{{CATEGORY_TEXT}}/g, escapeXML(productData.categoryText));
      
      // Main title and SKU
      if (productData.mainTitle) svgContent = svgContent.replace(/{{MAIN_TITLE}}/g, escapeXML(productData.mainTitle));
      if (productData.sku) svgContent = svgContent.replace(/{{PRODUCT_SKU}}/g, escapeXML(productData.sku));
      
      // Image section
      if (productData.image) {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, productData.image);
      } else {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      }
      if (productData.imageTitle) svgContent = svgContent.replace(/{{IMAGE_TITLE}}/g, escapeXML(productData.imageTitle));
      if (productData.secondaryDescription) svgContent = svgContent.replace(/{{SECONDARY_DESCRIPTION}}/g, escapeXML(productData.secondaryDescription));
      
      // Product details sections - ONLY replace if data exists
      if (productData.powerDetail1) svgContent = svgContent.replace(/{{POWER_DETAIL_1}}/g, escapeXML(productData.powerDetail1));
      if (productData.powerDetail2) svgContent = svgContent.replace(/{{POWER_DETAIL_2}}/g, escapeXML(productData.powerDetail2));
      
      if (productData.panelDetail1) svgContent = svgContent.replace(/{{PANEL_DETAIL_1}}/g, escapeXML(productData.panelDetail1));
      // REMOVED: panelDetail2 - no longer exists in template
      
      if (productData.mountDetail1) svgContent = svgContent.replace(/{{MOUNT_DETAIL_1}}/g, escapeXML(productData.mountDetail1));
      if (productData.mountDetail2) svgContent = svgContent.replace(/{{MOUNT_DETAIL_2}}/g, escapeXML(productData.mountDetail2));
      
      if (productData.elecDetail1) svgContent = svgContent.replace(/{{ELEC_DETAIL_1}}/g, escapeXML(productData.elecDetail1));
      if (productData.elecDetail2) svgContent = svgContent.replace(/{{ELEC_DETAIL_2}}/g, escapeXML(productData.elecDetail2));
      
      // Cables & Installation - ONLY if exists
      if (productData.cableDetail1) svgContent = svgContent.replace(/{{CABLE_DETAIL_1}}/g, escapeXML(productData.cableDetail1));
      if (productData.cableDetail2) svgContent = svgContent.replace(/{{CABLE_DETAIL_2}}/g, escapeXML(productData.cableDetail2));
      
      // REMOVED: Warranty & Specs - these placeholders no longer exist in template
      // REMOVED: Expected Performance - these placeholders no longer exist in template
      
      // Description section - ONLY if exists
      if (productData.descriptionTitle) svgContent = svgContent.replace(/{{DESCRIPTION_TITLE}}/g, escapeXML(productData.descriptionTitle));
      if (productData.descriptionLine1) svgContent = svgContent.replace(/{{DESCRIPTION_LINE_1}}/g, escapeXML(productData.descriptionLine1));
      if (productData.descriptionLine2) svgContent = svgContent.replace(/{{DESCRIPTION_LINE_2}}/g, escapeXML(productData.descriptionLine2));
      if (productData.descriptionLine3) svgContent = svgContent.replace(/{{DESCRIPTION_LINE_3}}/g, escapeXML(productData.descriptionLine3));
      if (productData.descriptionLine4) svgContent = svgContent.replace(/{{DESCRIPTION_LINE_4}}/g, escapeXML(productData.descriptionLine4));
      if (productData.descriptionLine5) svgContent = svgContent.replace(/{{DESCRIPTION_LINE_5}}/g, escapeXML(productData.descriptionLine5));
      if (productData.descriptionLine6) svgContent = svgContent.replace(/{{DESCRIPTION_LINE_6}}/g, escapeXML(productData.descriptionLine6));
      
      // Benefits - ONLY if exists
      if (productData.benefit1) svgContent = svgContent.replace(/{{BENEFIT_1}}/g, escapeXML(productData.benefit1));
      if (productData.benefit2) svgContent = svgContent.replace(/{{BENEFIT_2}}/g, escapeXML(productData.benefit2));
      if (productData.benefit3) svgContent = svgContent.replace(/{{BENEFIT_3}}/g, escapeXML(productData.benefit3));
      if (productData.benefit4) svgContent = svgContent.replace(/{{BENEFIT_4}}/g, escapeXML(productData.benefit4));
      if (productData.benefit5) svgContent = svgContent.replace(/{{BENEFIT_5}}/g, escapeXML(productData.benefit5));
      
      // Price section - ONLY if exists
      if (productData.priceHeader) svgContent = svgContent.replace(/{{PRICE_HEADER}}/g, escapeXML(productData.priceHeader));
      if (productData.priceAmount) svgContent = svgContent.replace(/{{PRICE_AMOUNT}}/g, escapeXML(productData.priceAmount));
      if (productData.priceNote) svgContent = svgContent.replace(/{{PRICE_NOTE}}/g, escapeXML(productData.priceNote));
      
      // Delivery section - ONLY if exists
      if (productData.delivery1) svgContent = svgContent.replace(/{{DELIVERY_1}}/g, escapeXML(productData.delivery1));
      if (productData.delivery2) svgContent = svgContent.replace(/{{DELIVERY_2}}/g, escapeXML(productData.delivery2));
      if (productData.delivery3) svgContent = svgContent.replace(/{{DELIVERY_3}}/g, escapeXML(productData.delivery3));
      
      // Contact section - ONLY if exists
      if (productData.contactPhone1) svgContent = svgContent.replace(/{{CONTACT_PHONE_1}}/g, escapeXML(productData.contactPhone1));
      if (productData.contactPhone2) svgContent = svgContent.replace(/{{CONTACT_PHONE_2}}/g, escapeXML(productData.contactPhone2));
      if (productData.contactEmail) svgContent = svgContent.replace(/{{CONTACT_EMAIL}}/g, escapeXML(productData.contactEmail));
      if (productData.contactWebsite) svgContent = svgContent.replace(/{{CONTACT_WEBSITE}}/g, escapeXML(productData.contactWebsite));
    }
    
    // Handle other templates (existing logic) - ONLY replace if data exists
    if (productData) {
      // Basic product data for all templates
      if (productData.title) {
        svgContent = svgContent.replace(/{{PRODUCT_TITLE}}/g, escapeXML(productData.title));
      }
      if (productData.price) {
        svgContent = svgContent.replace(/{{PRODUCT_PRICE}}/g, escapeXML(productData.price));
      }
      if (productData.sku) {
        svgContent = svgContent.replace(/{{PRODUCT_SKU}}/g, escapeXML(productData.sku));
      }
      if (productData.description) {
        svgContent = svgContent.replace(/{{PRODUCT_DESCRIPTION}}/g, escapeXML(productData.description));
      }
      
      // Handle product image for all templates
      if (productData.image) {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, productData.image);
      } else {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      }
      
      // Solar Bulk Deal specific fields (existing) - ONLY if exists
      if (productData.promotionTitle) {
        svgContent = svgContent.replace(/{{PROMOTION_TITLE}}/g, escapeXML(productData.promotionTitle));
      }
      if (productData.imageTitle) {
        svgContent = svgContent.replace(/{{IMAGE_TITLE}}/g, escapeXML(productData.imageTitle));
      }
      if (productData.secondaryDescription) {
        svgContent = svgContent.replace(/{{SECONDARY_DESCRIPTION}}/g, escapeXML(productData.secondaryDescription));
      }
      
      // Bullet points for other templates - ONLY if exists
      if (productData.bulletPoint1) svgContent = svgContent.replace(/{{BULLET_POINT_1}}/g, escapeXML(productData.bulletPoint1));
      if (productData.bulletPoint2) svgContent = svgContent.replace(/{{BULLET_POINT_2}}/g, escapeXML(productData.bulletPoint2));
      if (productData.bulletPoint3) svgContent = svgContent.replace(/{{BULLET_POINT_3}}/g, escapeXML(productData.bulletPoint3));
      if (productData.bulletPoint4) svgContent = svgContent.replace(/{{BULLET_POINT_4}}/g, escapeXML(productData.bulletPoint4));
      if (productData.bulletPoint5) svgContent = svgContent.replace(/{{BULLET_POINT_5}}/g, escapeXML(productData.bulletPoint5));
    }
    
    // Handle company data - ONLY if exists
    if (companyData) {
      if (companyData.name) {
        svgContent = svgContent.replace(/{{COMPANY_NAME}}/g, escapeXML(companyData.name));
      }
      if (companyData.phone) {
        svgContent = svgContent.replace(/{{PHONE_NUMBER}}/g, escapeXML(companyData.phone));
      }
      if (companyData.email) {
        svgContent = svgContent.replace(/{{EMAIL}}/g, escapeXML(companyData.email));
      }
      if (companyData.website) {
        svgContent = svgContent.replace(/{{WEBSITE}}/g, escapeXML(companyData.website));
      }
    }
    
    // Replace any remaining placeholders with empty strings (this removes any unused placeholders)
    const beforeCleanup = svgContent.length;
    svgContent = svgContent.replace(/{{[^}]+}}/g, '');
    const afterCleanup = svgContent.length;
    
    console.log('SVG length before cleanup:', beforeCleanup);
    console.log('SVG length after cleanup:', afterCleanup);
    console.log('Placeholders removed for unused fields:', beforeCleanup - afterCleanup);
    
    // For now, always return SVG (PNG conversion causes issues on Vercel)
    // You can convert SVG to PNG client-side if needed
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', `attachment; filename="${templateId}.svg"`);
    res.status(200).send(svgContent);
    
  } catch (error) {
    console.error('Error exporting template:', error);
    res.status(500).json({ error: error.message });
  }
};
