// api/export-template.js - Fixed Version with XML Escaping
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
      // Header fields - ALL VALUES ARE ESCAPED
      svgContent = svgContent.replace(/{{RATING_TEXT}}/g, escapeXML(productData.ratingText || 'Hellopeter 4.67'));
      svgContent = svgContent.replace(/{{BRAND_TEXT}}/g, escapeXML(productData.brandText || 'B SHOCKED'));
      svgContent = svgContent.replace(/{{CATEGORY_TEXT}}/g, escapeXML(productData.categoryText || 'ELECTRICAL | SOLAR'));
      
      // Main title and SKU
      svgContent = svgContent.replace(/{{MAIN_TITLE}}/g, escapeXML(productData.mainTitle || 'SOLAR KIT PACKAGE'));
      svgContent = svgContent.replace(/{{PRODUCT_SKU}}/g, escapeXML(productData.sku || 'RIIGDEYE-5KW-PACK'));
      
      // Image section
      if (productData.image) {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, productData.image);
      } else {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      }
      svgContent = svgContent.replace(/{{IMAGE_TITLE}}/g, escapeXML(productData.imageTitle || '5 Dyness BX 51100 Units'));
      svgContent = svgContent.replace(/{{SECONDARY_DESCRIPTION}}/g, escapeXML(productData.secondaryDescription || 'Complete Solar Kit'));
      
      // Product details sections - ALL VALUES ARE ESCAPED
      svgContent = svgContent.replace(/{{POWER_DETAIL_1}}/g, escapeXML(productData.powerDetail1 || '• 5kW Deye Hybrid Inverter'));
      svgContent = svgContent.replace(/{{POWER_DETAIL_2}}/g, escapeXML(productData.powerDetail2 || '• 5.12kWh Dyness Lithium Battery'));
      
      svgContent = svgContent.replace(/{{PANEL_DETAIL_1}}/g, escapeXML(productData.panelDetail1 || '• 8x 565W JA Solar Mono Panels'));
      svgContent = svgContent.replace(/{{PANEL_DETAIL_2}}/g, escapeXML(productData.panelDetail2 || '• 4.52kW Total Panel Capacity'));
      
      svgContent = svgContent.replace(/{{MOUNT_DETAIL_1}}/g, escapeXML(productData.mountDetail1 || '• PV Rails, Roof Hooks, Clamps'));
      svgContent = svgContent.replace(/{{MOUNT_DETAIL_2}}/g, escapeXML(productData.mountDetail2 || '• Complete Mounting System'));
      
      svgContent = svgContent.replace(/{{ELEC_DETAIL_1}}/g, escapeXML(productData.elecDetail1 || '• DC/AC Combiners, Surge Protection'));
      svgContent = svgContent.replace(/{{ELEC_DETAIL_2}}/g, escapeXML(productData.elecDetail2 || '• Fuses, Switches, Safety Equipment'));
      
      // Cables & Installation - ESCAPED
      svgContent = svgContent.replace(/{{CABLE_DETAIL_1}}/g, escapeXML(productData.cableDetail1 || '• Solar Cables, Battery Cables, MC4'));
      svgContent = svgContent.replace(/{{CABLE_DETAIL_2}}/g, escapeXML(productData.cableDetail2 || '• Conduits, Trunking, Earth Spike'));
      
      // Warranty & Specs - ESCAPED
      svgContent = svgContent.replace(/{{WARRANTY_DETAIL_1}}/g, escapeXML(productData.warrantyDetail1 || '• 25yr Panels, 10yr Inverter & Battery'));
      svgContent = svgContent.replace(/{{WARRANTY_DETAIL_2}}/g, escapeXML(productData.warrantyDetail2 || '• Grid-Tie Hybrid, Professional Install'));
      
      // Expected Performance - ESCAPED
      svgContent = svgContent.replace(/{{PERFORMANCE_DETAIL_1}}/g, escapeXML(productData.performanceDetail1 || '• ~1,800kWh/month Generation'));
      svgContent = svgContent.replace(/{{PERFORMANCE_DETAIL_2}}/g, escapeXML(productData.performanceDetail2 || '• 85% Energy Independence'));
      
      // Description section - ESCAPED
      svgContent = svgContent.replace(/{{DESCRIPTION_TITLE}}/g, escapeXML(productData.descriptionTitle || 'COMPLETE SOLAR KIT'));
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_1}}/g, escapeXML(productData.descriptionLine1 || 'Everything you need for a'));
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_2}}/g, escapeXML(productData.descriptionLine2 || 'professional solar installation.'));
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_3}}/g, escapeXML(productData.descriptionLine3 || 'Hybrid system with battery'));
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_4}}/g, escapeXML(productData.descriptionLine4 || 'backup for load-shedding'));
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_5}}/g, escapeXML(productData.descriptionLine5 || 'protection and energy'));
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_6}}/g, escapeXML(productData.descriptionLine6 || 'independence.'));
      
      // Benefits - ESCAPED
      svgContent = svgContent.replace(/{{BENEFIT_1}}/g, escapeXML(productData.benefit1 || '✓ Load Shedding Protection'));
      svgContent = svgContent.replace(/{{BENEFIT_2}}/g, escapeXML(productData.benefit2 || '✓ Reduce Electricity Bills'));
      svgContent = svgContent.replace(/{{BENEFIT_3}}/g, escapeXML(productData.benefit3 || '✓ Eco-Friendly Power'));
      svgContent = svgContent.replace(/{{BENEFIT_4}}/g, escapeXML(productData.benefit4 || '✓ Professional Support'));
      svgContent = svgContent.replace(/{{BENEFIT_5}}/g, escapeXML(productData.benefit5 || '✓ Complete Installation Kit'));
      
      // Price section - ESCAPED
      svgContent = svgContent.replace(/{{PRICE_HEADER}}/g, escapeXML(productData.priceHeader || 'Incl. VAT'));
      svgContent = svgContent.replace(/{{PRICE_AMOUNT}}/g, escapeXML(productData.priceAmount || 'R51,779.35'));
      svgContent = svgContent.replace(/{{PRICE_NOTE}}/g, escapeXML(productData.priceNote || 'Professional Installation Available'));
      
      // Delivery section - ESCAPED
      svgContent = svgContent.replace(/{{DELIVERY_1}}/g, escapeXML(productData.delivery1 || 'Delivery JHB free up to 20 km'));
      svgContent = svgContent.replace(/{{DELIVERY_2}}/g, escapeXML(productData.delivery2 || 'Delivery 60-100 km JHB R440 fee'));
      svgContent = svgContent.replace(/{{DELIVERY_3}}/g, escapeXML(productData.delivery3 || 'Fee for other regions calculated'));
      
      // Contact section - ESCAPED
      svgContent = svgContent.replace(/{{CONTACT_PHONE_1}}/g, escapeXML(productData.contactPhone1 || '011 568 7166'));
      svgContent = svgContent.replace(/{{CONTACT_PHONE_2}}/g, escapeXML(productData.contactPhone2 || '067 923 8166'));
      svgContent = svgContent.replace(/{{CONTACT_EMAIL}}/g, escapeXML(productData.contactEmail || 'sales@bshockedelectrical.co.za'));
      svgContent = svgContent.replace(/{{CONTACT_WEBSITE}}/g, escapeXML(productData.contactWebsite || 'https://bshockedelectrical.co.za'));
    }
    
    // Handle other templates (existing logic) - ALL VALUES ARE ESCAPED
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
      
      // Solar Bulk Deal specific fields (existing) - ESCAPED
      if (productData.promotionTitle) {
        svgContent = svgContent.replace(/{{PROMOTION_TITLE}}/g, escapeXML(productData.promotionTitle));
      }
      if (productData.imageTitle) {
        svgContent = svgContent.replace(/{{IMAGE_TITLE}}/g, escapeXML(productData.imageTitle));
      }
      if (productData.secondaryDescription) {
        svgContent = svgContent.replace(/{{SECONDARY_DESCRIPTION}}/g, escapeXML(productData.secondaryDescription));
      }
      
      // Bullet points for other templates - ESCAPED
      if (productData.bulletPoint1) svgContent = svgContent.replace(/{{BULLET_POINT_1}}/g, escapeXML(productData.bulletPoint1));
      if (productData.bulletPoint2) svgContent = svgContent.replace(/{{BULLET_POINT_2}}/g, escapeXML(productData.bulletPoint2));
      if (productData.bulletPoint3) svgContent = svgContent.replace(/{{BULLET_POINT_3}}/g, escapeXML(productData.bulletPoint3));
      if (productData.bulletPoint4) svgContent = svgContent.replace(/{{BULLET_POINT_4}}/g, escapeXML(productData.bulletPoint4));
      if (productData.bulletPoint5) svgContent = svgContent.replace(/{{BULLET_POINT_5}}/g, escapeXML(productData.bulletPoint5));
    }
    
    // Handle company data - ESCAPED
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
    
    // Replace any remaining placeholders with empty strings
    svgContent = svgContent.replace(/{{[^}]+}}/g, '');
    
    console.log('Processed SVG length:', svgContent.length);
    
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
