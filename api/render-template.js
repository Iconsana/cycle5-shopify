// api/render-template.js - Debug Version
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
        <text x="20" y="50" font-family="Arial" font-size="16" fill="red">Template not found: ${templateId}</text>
        <text x="20" y="80" font-family="Arial" font-size="12" fill="red">Path: ${svgPath}</text>
        <text x="20" y="100" font-family="Arial" font-size="12" fill="red">Templates dir: ${templatesDir}</text>
      </svg>`);
    }
    
    // Read SVG content
    let svgContent = fs.readFileSync(svgPath, 'utf8');
    console.log('Original SVG length:', svgContent.length);
    
    // Handle Solar Kit Social template specifically
    if (templateId === 'solar-kit-social') {
      console.log('Processing solar-kit-social template');
      
      // Header fields with defaults
      svgContent = svgContent.replace(/\{\{RATING_TEXT\}\}/g, ratingText || 'Hellopeter 4.67');
      svgContent = svgContent.replace(/\{\{BRAND_TEXT\}\}/g, brandText || 'B SHOCKED');
      svgContent = svgContent.replace(/\{\{CATEGORY_TEXT\}\}/g, categoryText || 'ELECTRICAL | SOLAR');
      svgContent = svgContent.replace(/\{\{MAIN_TITLE\}\}/g, mainTitle || 'SOLAR KIT PACKAGE');
      svgContent = svgContent.replace(/\{\{PRODUCT_SKU\}\}/g, sku || 'RIIGDEYE-5KW-PACK');
      
      // Image section
      if (imageUrl && imageUrl.startsWith('data:')) {
        svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, imageUrl);
        console.log('Using provided image (data URL)');
      } else {
        svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        console.log('Using placeholder image');
      }
      svgContent = svgContent.replace(/\{\{IMAGE_TITLE\}\}/g, imageTitle || '5 Dyness BX 51100 Units');
      svgContent = svgContent.replace(/\{\{SECONDARY_DESCRIPTION\}\}/g, secondaryDescription || 'Complete Solar Kit');
      
      // Product details sections
      svgContent = svgContent.replace(/\{\{POWER_DETAIL_1\}\}/g, powerDetail1 || '• 5kW Deye Hybrid Inverter');
      svgContent = svgContent.replace(/\{\{POWER_DETAIL_2\}\}/g, powerDetail2 || '• 5.12kWh Dyness Lithium Battery');
      svgContent = svgContent.replace(/\{\{PANEL_DETAIL_1\}\}/g, panelDetail1 || '• 8x 565W JA Solar Mono Panels');
      svgContent = svgContent.replace(/\{\{PANEL_DETAIL_2\}\}/g, panelDetail2 || '• 4.52kW Total Panel Capacity');
      svgContent = svgContent.replace(/\{\{MOUNT_DETAIL_1\}\}/g, mountDetail1 || '• PV Rails, Roof Hooks, Clamps');
      svgContent = svgContent.replace(/\{\{MOUNT_DETAIL_2\}\}/g, mountDetail2 || '• Complete Mounting System');
      svgContent = svgContent.replace(/\{\{ELEC_DETAIL_1\}\}/g, elecDetail1 || '• DC/AC Combiners, Surge Protection');
      svgContent = svgContent.replace(/\{\{ELEC_DETAIL_2\}\}/g, elecDetail2 || '• Fuses, Switches, Safety Equipment');
      
      // Cables & Installation
      svgContent = svgContent.replace(/\{\{CABLE_DETAIL_1\}\}/g, cableDetail1 || '• Solar Cables, Battery Cables, MC4');
      svgContent = svgContent.replace(/\{\{CABLE_DETAIL_2\}\}/g, cableDetail2 || '• Conduits, Trunking, Earth Spike');
      
      // Warranty & Specs
      svgContent = svgContent.replace(/\{\{WARRANTY_DETAIL_1\}\}/g, warrantyDetail1 || '• 25yr Panels, 10yr Inverter and Battery');
      svgContent = svgContent.replace(/\{\{WARRANTY_DETAIL_2\}\}/g, warrantyDetail2 || '• Grid-Tie Hybrid, Professional Install');
      
      // Expected Performance
      svgContent = svgContent.replace(/\{\{PERFORMANCE_DETAIL_1\}\}/g, performanceDetail1 || '• ~1,800kWh/month Generation');
      svgContent = svgContent.replace(/\{\{PERFORMANCE_DETAIL_2\}\}/g, performanceDetail2 || '• 85% Energy Independence');
      
      // Description section
      svgContent = svgContent.replace(/\{\{DESCRIPTION_TITLE\}\}/g, descriptionTitle || 'COMPLETE SOLAR KIT');
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_1\}\}/g, descriptionLine1 || 'Everything you need for a');
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_2\}\}/g, descriptionLine2 || 'professional solar installation.');
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_3\}\}/g, descriptionLine3 || 'Hybrid system with battery');
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_4\}\}/g, descriptionLine4 || 'backup for load-shedding');
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_5\}\}/g, descriptionLine5 || 'protection and energy');
      svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_6\}\}/g, descriptionLine6 || 'independence.');
      
      // Benefits
      svgContent = svgContent.replace(/\{\{BENEFIT_1\}\}/g, benefit1 || '✓ Load Shedding Protection');
      svgContent = svgContent.replace(/\{\{BENEFIT_2\}\}/g, benefit2 || '✓ Reduce Electricity Bills');
      svgContent = svgContent.replace(/\{\{BENEFIT_3\}\}/g, benefit3 || '✓ Eco-Friendly Power');
      svgContent = svgContent.replace(/\{\{BENEFIT_4\}\}/g, benefit4 || '✓ Professional Support');
      svgContent = svgContent.replace(/\{\{BENEFIT_5\}\}/g, benefit5 || '✓ Complete Installation Kit');
      
      // Price section
      svgContent = svgContent.replace(/\{\{PRICE_HEADER\}\}/g, priceHeader || 'Incl. VAT');
      svgContent = svgContent.replace(/\{\{PRICE_AMOUNT\}\}/g, priceAmount || 'R51,779.35');
      svgContent = svgContent.replace(/\{\{PRICE_NOTE\}\}/g, priceNote || 'Professional Installation Available');
      
      // Delivery section
      svgContent = svgContent.replace(/\{\{DELIVERY_1\}\}/g, delivery1 || 'Delivery JHB free up to 20 km');
      svgContent = svgContent.replace(/\{\{DELIVERY_2\}\}/g, delivery2 || 'Delivery 60-100 km JHB R440 fee');
      svgContent = svgContent.replace(/\{\{DELIVERY_3\}\}/g, delivery3 || 'Fee for other regions calculated');
      
      // Contact section
      svgContent = svgContent.replace(/\{\{CONTACT_PHONE_1\}\}/g, contactPhone1 || '011 568 7166');
      svgContent = svgContent.replace(/\{\{CONTACT_PHONE_2\}\}/g, contactPhone2 || '067 923 8166');
      svgContent = svgContent.replace(/\{\{CONTACT_EMAIL\}\}/g, contactEmail || 'sales@bshockedelectrical.co.za');
      svgContent = svgContent.replace(/\{\{CONTACT_WEBSITE\}\}/g, contactWebsite || 'https://bshockedelectrical.co.za');
      
      console.log('Completed solar-kit-social replacements');
    }
    
    // Handle other templates (existing logic)
    if (title) svgContent = svgContent.replace(/\{\{PRODUCT_TITLE\}\}/g, title);
    if (price) svgContent = svgContent.replace(/\{\{PRODUCT_PRICE\}\}/g, price);
    if (sku) svgContent = svgContent.replace(/\{\{PRODUCT_SKU\}\}/g, sku);
    if (description) svgContent = svgContent.replace(/\{\{PRODUCT_DESCRIPTION\}\}/g, description);
    if (company) svgContent = svgContent.replace(/\{\{COMPANY_NAME\}\}/g, company);
    if (phone) svgContent = svgContent.replace(/\{\{PHONE_NUMBER\}\}/g, phone);
    if (email) svgContent = svgContent.replace(/\{\{EMAIL\}\}/g, email);
    if (website) svgContent = svgContent.replace(/\{\{WEBSITE\}\}/g, website);
    
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
      <text x="20" y="80" font-family="Arial" font-size="12" fill="red">${error.message}</text>
      <text x="20" y="100" font-family="Arial" font-size="12" fill="red">${error.stack ? error.stack.split('\n')[0] : 'No stack trace'}</text>
    </svg>`);
  }
};
