// api/render-template.js - Fixed Version with XML Escaping
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
      // Solar Kit Social fields
      ratingText, brandText, categoryText, mainTitle,
      powerDetail1, powerDetail2, panelDetail1, panelDetail2,
      mountDetail1, mountDetail2, elecDetail1, elecDetail2,
      cableDetail1, cableDetail2, warrantyDetail1, warrantyDetail2,
      performanceDetail1, performanceDetail2,
      descriptionTitle, descriptionLine1, descriptionLine2, descriptionLine3,
      descriptionLine4, descriptionLine5, descriptionLine6,
      benefit1, benefit2, benefit3, benefit4, benefit5,
      priceHeader, priceAmount, priceNote,
      delivery1, delivery2, delivery3,
      contactPhone1, contactPhone2, contactEmail, contactWebsite
    } = req.query;
    
    // Debug log key parameters
    console.log('Key params:', {
      ratingText, brandText, mainTitle, sku,
      powerDetail1, panelDetail1
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
      
      // Header fields with defaults - ALL VALUES ARE ESCAPED
      svgContent = svgContent.replace(/\{\{RATING_TEXT\}\}/g, escapeXML(ratingText || 'Hellopeter 4.67'));
      svgContent = svgContent.replace(/\{\{BRAND_TEXT\}\}/g, escapeXML(brandText || 'B SHOCKED'));
      svgContent = svgContent.replace(/\{\{CATEGORY_TEXT\}\}/g, escapeXML(categoryText || 'ELECTRICAL | SOLAR'));
      svgContent = svgContent.replace(/\{\{MAIN_TITLE\}\}/g, escapeXML(mainTitle || 'SOLAR KIT PACKAGE'));
      svgContent = svgContent.replace(/\{\{PRODUCT_SKU\}\}/g, escapeXML(sku || 'RIIGDEYE-5KW-PACK'));
      
      // Image section
      if (imageUrl && imageUrl.startsWith('data:')) {
        svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, imageUrl);
        console.log('Using provided image (data URL)');
      } else {
        svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        console.log('Using placeholder image');
      }
      svgContent = svgContent.replace(/\{\{IMAGE_TITLE\}\}/g, escapeXML(imageTitle || '5 Dyness BX 51100 Units'));
      svgContent = svgContent.replace(/\{\{SECONDARY_DESCRIPTION\}\}/g, escapeXML(secondaryDescription || 'Complete Solar Kit'));
      
      // Product details sections - ALL VALUES ARE ESCAPED
      svgContent = svgContent.replace(/\{\{POWER_DETAIL_1\}\}/g, escapeXML(powerDetail1 || '• 5kW Deye Hybrid Inverter'));
      svgContent = svgContent.replace(/\{\{POWER_DETAIL_2\}\}/g, escapeXML(powerDetail2 || '• 5.12kWh Dyness Lithium Battery'));
      svgContent = svgContent.replace(/\{\{PANEL_DETAIL_1\}\}/g, escapeXML(panelDetail1 || '• 8x 565W JA Solar Mono Panels'));
      svgContent = svgContent.replace(/\{\{PANEL_DETAIL_2\}\}/g, escapeXML(panelDetail2 || '• 4.52kW Total Panel Capacity'));
      svgContent = svgContent.replace(/\{\{MOUNT_DETAIL_1\}\}/g, escapeXML(mountDetail1 || '• PV Rails, Roof Hooks, Clamps'));
      svgContent = svgContent.replace(/\{\{MOUNT_DETAIL_2\}\}/g, escapeXML(mountDetail2 || '• Complete Mounting System'));
      svgContent = svgContent.replace(/\{\{ELEC_DETAIL_1\}\}/g, escapeXML(elecDetail1 || '• DC/AC Combiners, Surge Protection'));
      svgContent = svgContent.replace(/\{\{ELEC_DETAIL_2\}\}/g, escapeXML(elecDetail2 || '• Fuses, Switches, Safety Equipment'));
      
      // Cables & Installation - ESCAPED
      svgContent = svgContent.replace(/\{\{CABLE_DETAIL_1\}\}/g, escapeXML(cableDetail1 || '• Solar Cables, Battery Cables, MC4'));
      svgContent = svgContent.replace(/\{\{CABLE_DETAIL_2\}\}/g, escapeXML(cableDetail2 || '• Conduits, Trunking, Earth Spike'));
      
      // Warranty & Specs - ESCAPED
      svgContent = svgContent.replace(/\{\{WARRANTY_DETAIL_1\}\}/g, escapeXML(warrantyDetail1 || '• 25yr Panels, 10yr Inverter and Battery'));
      svgContent = svgContent.replace(/\{\{WARRANTY_DETAIL_2\}\}/g, escapeXML(warrantyDetail2 || '• Grid-Tie Hybrid, Professional Install'));
      
      // Expected Performance - ESCAPED
      svgContent = svgContent.replace(/\{\{PERFORMANCE_DETAIL_1\}\}/g, escapeXML(performanceDetail1 || '• ~1,800kWh/month Generation'));
      svgContent = svgContent.replace(/\{\{PERFORMANCE_DETAIL_2\}\}/g, escapeXML(performanceDetail2 || '• 85% Energy Independence'));
      
      // Description section - ESCAPED
      svgContent = svgContent.replace(/\{\{DESCRIPTION_TITLE\}\}/g, escapeXML(descriptionTitle || 'COMPLETE SOLAR KIT'));
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_1\}\}/g, escapeXML(descriptionLine1 || 'Everything you need for a'));
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_2\}\}/g, escapeXML(descriptionLine2 || 'professional solar installation.'));
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_3\}\}/g, escapeXML(descriptionLine3 || 'Hybrid system with battery'));
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_4\}\}/g, escapeXML(descriptionLine4 || 'backup for load-shedding'));
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_5\}\}/g, escapeXML(descriptionLine5 || 'protection and energy'));
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_6\}\}/g, escapeXML(descriptionLine6 || 'independence.'));
      
      // Benefits - ESCAPED
      svgContent = svgContent.replace(/\{\{BENEFIT_1\}\}/g, escapeXML(benefit1 || '✓ Load Shedding Protection'));
      svgContent = svgContent.replace(/\{\{BENEFIT_2\}\}/g, escapeXML(benefit2 || '✓ Reduce Electricity Bills'));
      svgContent = svgContent.replace(/\{\{BENEFIT_3\}\}/g, escapeXML(benefit3 || '✓ Eco-Friendly Power'));
      svgContent = svgContent.replace(/\{\{BENEFIT_4\}\}/g, escapeXML(benefit4 || '✓ Professional Support'));
      svgContent = svgContent.replace(/\{\{BENEFIT_5\}\}/g, escapeXML(benefit5 || '✓ Complete Installation Kit'));
      
      // Price section - ESCAPED
      svgContent = svgContent.replace(/\{\{PRICE_HEADER\}\}/g, escapeXML(priceHeader || 'Incl. VAT'));
      svgContent = svgContent.replace(/\{\{PRICE_AMOUNT\}\}/g, escapeXML(priceAmount || 'R51,779.35'));
      svgContent = svgContent.replace(/\{\{PRICE_NOTE\}\}/g, escapeXML(priceNote || 'Professional Installation Available'));
      
      // Delivery section - ESCAPED
      svgContent = svgContent.replace(/\{\{DELIVERY_1\}\}/g, escapeXML(delivery1 || 'Delivery JHB free up to 20 km'));
      svgContent = svgContent.replace(/\{\{DELIVERY_2\}\}/g, escapeXML(delivery2 || 'Delivery 60-100 km JHB R440 fee'));
      svgContent = svgContent.replace(/\{\{DELIVERY_3\}\}/g, escapeXML(delivery3 || 'Fee for other regions calculated'));
      
      // Contact section - ESCAPED
      svgContent = svgContent.replace(/\{\{CONTACT_PHONE_1\}\}/g, escapeXML(contactPhone1 || '011 568 7166'));
      svgContent = svgContent.replace(/\{\{CONTACT_PHONE_2\}\}/g, escapeXML(contactPhone2 || '067 923 8166'));
      svgContent = svgContent.replace(/\{\{CONTACT_EMAIL\}\}/g, escapeXML(contactEmail || 'sales@bshockedelectrical.co.za'));
      svgContent = svgContent.replace(/\{\{CONTACT_WEBSITE\}\}/g, escapeXML(contactWebsite || 'https://bshockedelectrical.co.za'));
      
      console.log('Completed solar-kit-social replacements');
    }
    
    // Handle other templates (existing logic) - ALL VALUES ARE ESCAPED
    if (title) svgContent = svgContent.replace(/\{\{PRODUCT_TITLE\}\}/g, escapeXML(title));
    if (price) svgContent = svgContent.replace(/\{\{PRODUCT_PRICE\}\}/g, escapeXML(price));
    if (sku) svgContent = svgContent.replace(/\{\{PRODUCT_SKU\}\}/g, escapeXML(sku));
    if (description) svgContent = svgContent.replace(/\{\{PRODUCT_DESCRIPTION\}\}/g, escapeXML(description));
    if (company) svgContent = svgContent.replace(/\{\{COMPANY_NAME\}\}/g, escapeXML(company));
    if (phone) svgContent = svgContent.replace(/\{\{PHONE_NUMBER\}\}/g, escapeXML(phone));
    if (email) svgContent = svgContent.replace(/\{\{EMAIL\}\}/g, escapeXML(email));
    if (website) svgContent = svgContent.replace(/\{\{WEBSITE\}\}/g, escapeXML(website));
    
    // Handle other template-specific fields - ESCAPED
    if (promotionTitle) svgContent = svgContent.replace(/\{\{PROMOTION_TITLE\}\}/g, escapeXML(promotionTitle));
    if (imageTitle) svgContent = svgContent.replace(/\{\{IMAGE_TITLE\}\}/g, escapeXML(imageTitle));
    if (secondaryDescription) svgContent = svgContent.replace(/\{\{SECONDARY_DESCRIPTION\}\}/g, escapeXML(secondaryDescription));
    if (bulletPoint1) svgContent = svgContent.replace(/\{\{BULLET_POINT_1\}\}/g, escapeXML(bulletPoint1));
    if (bulletPoint2) svgContent = svgContent.replace(/\{\{BULLET_POINT_2\}\}/g, escapeXML(bulletPoint2));
    if (bulletPoint3) svgContent = svgContent.replace(/\{\{BULLET_POINT_3\}\}/g, escapeXML(bulletPoint3));
    if (bulletPoint4) svgContent = svgContent.replace(/\{\{BULLET_POINT_4\}\}/g, escapeXML(bulletPoint4));
    if (bulletPoint5) svgContent = svgContent.replace(/\{\{BULLET_POINT_5\}\}/g, escapeXML(bulletPoint5));
    
    // Replace any remaining placeholders with empty strings
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
    res.status(500).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <text x="20" y="50" font-family="Arial" font-size="16" fill="red">Render Error</text>
      <text x="20" y="80" font-family="Arial" font-size="12" fill="red">${escapeXML(error.message)}</text>
      <text x="20" y="100" font-family="Arial" font-size="12" fill="red">${escapeXML(error.stack ? error.stack.split('\n')[0] : 'No stack trace')}</text>
    </svg>`);
  }
};
