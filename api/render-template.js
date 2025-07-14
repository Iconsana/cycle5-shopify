// api/render-template.js - Cleaned version with removed fields
module.exports = async (req, res) => {
  try {
    console.log('=== RENDER TEMPLATE DEBUG ===');
    console.log('Method:', req.method);
    console.log('Query params:', Object.keys(req.query));
    
    const { templateId } = req.query;
    
    if (!templateId) {
      console.log('ERROR: Missing templateId');
      return res.status(400).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <text x="20" y="150" font-family="Arial" font-size="20" fill="red">Error: Missing templateId</text>
      </svg>`);
    }
    
    console.log('Template ID:', templateId);
    
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
    
    // Get all parameters from query
    const {
      title, price, sku, description, company, phone, email, website, imageUrl,
      // Solar Bulk Deal fields
      promotionTitle, imageTitle, secondaryDescription,
      bulletPoint1, bulletPoint2, bulletPoint3, bulletPoint4, bulletPoint5,
      // Solar Kit Social fields (REMOVED warranty, performance, panelDetail2)
      ratingText, brandText, categoryText, mainTitle,
      powerDetail1, powerDetail2, panelDetail1, // panelDetail2 REMOVED
      mountDetail1, mountDetail2, elecDetail1, elecDetail2,
      cableDetail1, cableDetail2,
      // REMOVED: warrantyDetail1, warrantyDetail2, performanceDetail1, performanceDetail2
      descriptionTitle, descriptionLine1, descriptionLine2, descriptionLine3,
      descriptionLine4, descriptionLine5, descriptionLine6,
      benefit1, benefit2, benefit3, benefit4, benefit5,
      priceHeader, priceAmount, priceNote,
      delivery1, delivery2, delivery3,
      contactPhone1, contactPhone2, contactEmail, contactWebsite
    } = req.query;
    
    // Debug log key parameters
    console.log('Key params received:', {
      ratingText: !!ratingText,
      brandText: !!brandText,
      mainTitle: !!mainTitle,
      sku: !!sku,
      powerDetail1: !!powerDetail1,
      panelDetail1: !!panelDetail1
      // Removed references to panelDetail2, warrantyDetail1, performanceDetail1
    });
    
    // Read template SVG
    const path = require('path');
    const fs = require('fs');
    
    const templatesDir = path.join(process.cwd(), 'client/public/templates');
    const svgPath = path.join(templatesDir, `${templateId}.svg`);
    
    console.log('Template path:', svgPath);
    console.log('Template exists:', fs.existsSync(svgPath));
    
    if (!fs.existsSync(svgPath)) {
      console.log('ERROR: Template file not found');
      return res.status(404).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <text x="20" y="50" font-family="Arial" font-size="16" fill="red">Template not found: ${escapeXML(templateId)}</text>
        <text x="20" y="80" font-family="Arial" font-size="12" fill="red">Path: ${escapeXML(svgPath)}</text>
        <text x="20" y="100" font-family="Arial" font-size="12" fill="red">Templates dir: ${escapeXML(templatesDir)}</text>
      </svg>`);
    }
    
    // Read SVG content
    let svgContent = fs.readFileSync(svgPath, 'utf8');
    console.log('Original SVG length:', svgContent.length);
    
    // Handle Solar Kit Social template specifically
    if (templateId === 'solar-kit-social') {
      console.log('Processing solar-kit-social template');
      
      // Header fields - ONLY replace if parameter exists, NO DEFAULT VALUES
      if (ratingText) svgContent = svgContent.replace(/\{\{RATING_TEXT\}\}/g, escapeXML(ratingText));
      if (brandText) svgContent = svgContent.replace(/\{\{BRAND_TEXT\}\}/g, escapeXML(brandText));
      if (categoryText) svgContent = svgContent.replace(/\{\{CATEGORY_TEXT\}\}/g, escapeXML(categoryText));
      if (mainTitle) svgContent = svgContent.replace(/\{\{MAIN_TITLE\}\}/g, escapeXML(mainTitle));
      if (sku) svgContent = svgContent.replace(/\{\{PRODUCT_SKU\}\}/g, escapeXML(sku));
      
      // Image section
      if (imageUrl && imageUrl.startsWith('data:')) {
        svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, imageUrl);
        console.log('Using provided image (data URL)');
      } else {
        svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        console.log('Using placeholder image');
      }
      if (imageTitle) svgContent = svgContent.replace(/\{\{IMAGE_TITLE\}\}/g, escapeXML(imageTitle));
      if (secondaryDescription) svgContent = svgContent.replace(/\{\{SECONDARY_DESCRIPTION\}\}/g, escapeXML(secondaryDescription));
      
      // Product details sections - ONLY replace if parameter exists
      if (powerDetail1) svgContent = svgContent.replace(/\{\{POWER_DETAIL_1\}\}/g, escapeXML(powerDetail1));
      if (powerDetail2) svgContent = svgContent.replace(/\{\{POWER_DETAIL_2\}\}/g, escapeXML(powerDetail2));
      if (panelDetail1) svgContent = svgContent.replace(/\{\{PANEL_DETAIL_1\}\}/g, escapeXML(panelDetail1));
      // REMOVED: panelDetail2 - no longer exists in template
      if (mountDetail1) svgContent = svgContent.replace(/\{\{MOUNT_DETAIL_1\}\}/g, escapeXML(mountDetail1));
      if (mountDetail2) svgContent = svgContent.replace(/\{\{MOUNT_DETAIL_2\}\}/g, escapeXML(mountDetail2));
      if (elecDetail1) svgContent = svgContent.replace(/\{\{ELEC_DETAIL_1\}\}/g, escapeXML(elecDetail1));
      if (elecDetail2) svgContent = svgContent.replace(/\{\{ELEC_DETAIL_2\}\}/g, escapeXML(elecDetail2));
      
      // Cables & Installation - ONLY if exists
      if (cableDetail1) svgContent = svgContent.replace(/\{\{CABLE_DETAIL_1\}\}/g, escapeXML(cableDetail1));
      if (cableDetail2) svgContent = svgContent.replace(/\{\{CABLE_DETAIL_2\}\}/g, escapeXML(cableDetail2));
      
      // REMOVED: Warranty & Specs - these placeholders no longer exist in template
      // REMOVED: Expected Performance - these placeholders no longer exist in template
      
      // Description section - ONLY if exists
      if (descriptionTitle) svgContent = svgContent.replace(/\{\{DESCRIPTION_TITLE\}\}/g, escapeXML(descriptionTitle));
      if (descriptionLine1) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_1\}\}/g, escapeXML(descriptionLine1));
      if (descriptionLine2) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_2\}\}/g, escapeXML(descriptionLine2));
      if (descriptionLine3) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_3\}\}/g, escapeXML(descriptionLine3));
      if (descriptionLine4) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_4\}\}/g, escapeXML(descriptionLine4));
      if (descriptionLine5) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_5\}\}/g, escapeXML(descriptionLine5));
      if (descriptionLine6) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_6\}\}/g, escapeXML(descriptionLine6));
      
      // Benefits - ONLY if exists
      if (benefit1) svgContent = svgContent.replace(/\{\{BENEFIT_1\}\}/g, escapeXML(benefit1));
      if (benefit2) svgContent = svgContent.replace(/\{\{BENEFIT_2\}\}/g, escapeXML(benefit2));
      if (benefit3) svgContent = svgContent.replace(/\{\{BENEFIT_3\}\}/g, escapeXML(benefit3));
      if (benefit4) svgContent = svgContent.replace(/\{\{BENEFIT_4\}\}/g, escapeXML(benefit4));
      if (benefit5) svgContent = svgContent.replace(/\{\{BENEFIT_5\}\}/g, escapeXML(benefit5));
      
      // Price section - ONLY if exists
      if (priceHeader) svgContent = svgContent.replace(/\{\{PRICE_HEADER\}\}/g, escapeXML(priceHeader));
      if (priceAmount) svgContent = svgContent.replace(/\{\{PRICE_AMOUNT\}\}/g, escapeXML(priceAmount));
      if (priceNote) svgContent = svgContent.replace(/\{\{PRICE_NOTE\}\}/g, escapeXML(priceNote));
      
      // Delivery section - ONLY if exists
      if (delivery1) svgContent = svgContent.replace(/\{\{DELIVERY_1\}\}/g, escapeXML(delivery1));
      if (delivery2) svgContent = svgContent.replace(/\{\{DELIVERY_2\}\}/g, escapeXML(delivery2));
      if (delivery3) svgContent = svgContent.replace(/\{\{DELIVERY_3\}\}/g, escapeXML(delivery3));
      
      // Contact section - ONLY if exists
      if (contactPhone1) svgContent = svgContent.replace(/\{\{CONTACT_PHONE_1\}\}/g, escapeXML(contactPhone1));
      if (contactPhone2) svgContent = svgContent.replace(/\{\{CONTACT_PHONE_2\}\}/g, escapeXML(contactPhone2));
      if (contactEmail) svgContent = svgContent.replace(/\{\{CONTACT_EMAIL\}\}/g, escapeXML(contactEmail));
      if (contactWebsite) svgContent = svgContent.replace(/\{\{CONTACT_WEBSITE\}\}/g, escapeXML(contactWebsite));
      
      console.log('Completed solar-kit-social replacements');
    }
    
    // Handle other templates (existing logic) - ONLY replace if parameter exists
    if (title) svgContent = svgContent.replace(/\{\{PRODUCT_TITLE\}\}/g, escapeXML(title));
    if (price) svgContent = svgContent.replace(/\{\{PRODUCT_PRICE\}\}/g, escapeXML(price));
    if (sku) svgContent = svgContent.replace(/\{\{PRODUCT_SKU\}\}/g, escapeXML(sku));
    if (description) svgContent = svgContent.replace(/\{\{PRODUCT_DESCRIPTION\}\}/g, escapeXML(description));
    if (company) svgContent = svgContent.replace(/\{\{COMPANY_NAME\}\}/g, escapeXML(company));
    if (phone) svgContent = svgContent.replace(/\{\{PHONE_NUMBER\}\}/g, escapeXML(phone));
    if (email) svgContent = svgContent.replace(/\{\{EMAIL\}\}/g, escapeXML(email));
    if (website) svgContent = svgContent.replace(/\{\{WEBSITE\}\}/g, escapeXML(website));
    
    // Handle other template-specific fields - ONLY if exists
    if (promotionTitle) svgContent = svgContent.replace(/\{\{PROMOTION_TITLE\}\}/g, escapeXML(promotionTitle));
    if (imageTitle) svgContent = svgContent.replace(/\{\{IMAGE_TITLE\}\}/g, escapeXML(imageTitle));
    if (secondaryDescription) svgContent = svgContent.replace(/\{\{SECONDARY_DESCRIPTION\}\}/g, escapeXML(secondaryDescription));
    if (bulletPoint1) svgContent = svgContent.replace(/\{\{BULLET_POINT_1\}\}/g, escapeXML(bulletPoint1));
    if (bulletPoint2) svgContent = svgContent.replace(/\{\{BULLET_POINT_2\}\}/g, escapeXML(bulletPoint2));
    if (bulletPoint3) svgContent = svgContent.replace(/\{\{BULLET_POINT_3\}\}/g, escapeXML(bulletPoint3));
    if (bulletPoint4) svgContent = svgContent.replace(/\{\{BULLET_POINT_4\}\}/g, escapeXML(bulletPoint4));
    if (bulletPoint5) svgContent = svgContent.replace(/\{\{BULLET_POINT_5\}\}/g, escapeXML(bulletPoint5));
    
    // Replace any remaining placeholders with empty strings (this removes any unused placeholders)
    const beforeCleanup = svgContent.length;
    svgContent = svgContent.replace(/\{\{[^}]+\}\}/g, '');
    const afterCleanup = svgContent.length;
    
    console.log('SVG length before cleanup:', beforeCleanup);
    console.log('SVG length after cleanup:', afterCleanup);
    console.log('Placeholders removed:', beforeCleanup - afterCleanup);
    
    // Set SVG content type header
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send(svgContent);
    
    console.log('=== RENDER COMPLETE ===');
    
  } catch (error) {
    console.error('=== RENDER ERROR ===');
    console.error('Error rendering template:', error);
    const escapeXML = (str) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
    res.status(500).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <text x="20" y="50" font-family="Arial" font-size="16" fill="red">Render Error</text>
      <text x="20" y="80" font-family="Arial" font-size="12" fill="red">${escapeXML(error.message)}</text>
      <text x="20" y="100" font-family="Arial" font-size="12" fill="red">${escapeXML(error.stack ? error.stack.split('\n')[0] : 'No stack trace')}</text>
    </svg>`);
  }
};
