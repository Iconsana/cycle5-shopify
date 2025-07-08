// api/render-template.js
module.exports = async (req, res) => {
  try {
    const { templateId } = req.query;
    
    if (!templateId) {
      return res.status(400).json({ error: 'Missing templateId parameter' });
    }
    
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
    
    // Handle Solar Kit Social template specifically
    if (templateId === 'solar-kit-social') {
      // Header fields with defaults
      svgContent = svgContent.replace(/{{RATING_TEXT}}/g, ratingText || 'Hellopeter 4.67');
      svgContent = svgContent.replace(/{{BRAND_TEXT}}/g, brandText || 'B SHOCKED');
      svgContent = svgContent.replace(/{{CATEGORY_TEXT}}/g, categoryText || 'ELECTRICAL | SOLAR');
      svgContent = svgContent.replace(/{{MAIN_TITLE}}/g, mainTitle || 'SOLAR KIT PACKAGE');
      svgContent = svgContent.replace(/{{PRODUCT_SKU}}/g, sku || 'RIIGDEYE-5KW-PACK');
      
      // Image section
      if (imageUrl) {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, imageUrl);
      } else {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      }
      svgContent = svgContent.replace(/{{IMAGE_TITLE}}/g, imageTitle || '5 Dyness BX 51100 Units');
      svgContent = svgContent.replace(/{{SECONDARY_DESCRIPTION}}/g, secondaryDescription || 'Complete Solar Kit');
      
      // Product details sections
      svgContent = svgContent.replace(/{{POWER_DETAIL_1}}/g, powerDetail1 || '• 5kW Deye Hybrid Inverter');
      svgContent = svgContent.replace(/{{POWER_DETAIL_2}}/g, powerDetail2 || '• 5.12kWh Dyness Lithium Battery');
      svgContent = svgContent.replace(/{{PANEL_DETAIL_1}}/g, panelDetail1 || '• 8x 565W JA Solar Mono Panels');
      svgContent = svgContent.replace(/{{PANEL_DETAIL_2}}/g, panelDetail2 || '• 4.52kW Total Panel Capacity');
      svgContent = svgContent.replace(/{{MOUNT_DETAIL_1}}/g, mountDetail1 || '• PV Rails, Roof Hooks, Clamps');
      svgContent = svgContent.replace(/{{MOUNT_DETAIL_2}}/g, mountDetail2 || '• Complete Mounting System');
      svgContent = svgContent.replace(/{{ELEC_DETAIL_1}}/g, elecDetail1 || '• DC/AC Combiners, Surge Protection');
      svgContent = svgContent.replace(/{{ELEC_DETAIL_2}}/g, elecDetail2 || '• Fuses, Switches, Safety Equipment');
      
      // NEW: Cables & Installation
      svgContent = svgContent.replace(/{{CABLE_DETAIL_1}}/g, cableDetail1 || '• Solar Cables, Battery Cables, MC4');
      svgContent = svgContent.replace(/{{CABLE_DETAIL_2}}/g, cableDetail2 || '• Conduits, Trunking, Earth Spike');
      
      // NEW: Warranty & Specs
      svgContent = svgContent.replace(/{{WARRANTY_DETAIL_1}}/g, warrantyDetail1 || '• 25yr Panels, 10yr Inverter & Battery');
      svgContent = svgContent.replace(/{{WARRANTY_DETAIL_2}}/g, warrantyDetail2 || '• Grid-Tie Hybrid, Professional Install');
      
      // NEW: Expected Performance
      svgContent = svgContent.replace(/{{PERFORMANCE_DETAIL_1}}/g, performanceDetail1 || '• ~1,800kWh/month Generation');
      svgContent = svgContent.replace(/{{PERFORMANCE_DETAIL_2}}/g, performanceDetail2 || '• 85% Energy Independence');
      
      // Description section
      svgContent = svgContent.replace(/{{DESCRIPTION_TITLE}}/g, descriptionTitle || 'COMPLETE SOLAR KIT');
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_1}}/g, descriptionLine1 || 'Everything you need for a');
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_2}}/g, descriptionLine2 || 'professional solar installation.');
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_3}}/g, descriptionLine3 || 'Hybrid system with battery');
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_4}}/g, descriptionLine4 || 'backup for load-shedding');
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_5}}/g, descriptionLine5 || 'protection and energy');
      svgContent = svgContent.replace(/{{DESCRIPTION_LINE_6}}/g, descriptionLine6 || 'independence.');
      
      // Benefits
      svgContent = svgContent.replace(/{{BENEFIT_1}}/g, benefit1 || '✓ Load Shedding Protection');
      svgContent = svgContent.replace(/{{BENEFIT_2}}/g, benefit2 || '✓ Reduce Electricity Bills');
      svgContent = svgContent.replace(/{{BENEFIT_3}}/g, benefit3 || '✓ Eco-Friendly Power');
      svgContent = svgContent.replace(/{{BENEFIT_4}}/g, benefit4 || '✓ Professional Support');
      svgContent = svgContent.replace(/{{BENEFIT_5}}/g, benefit5 || '✓ Complete Installation Kit');
      
      // Price section
      svgContent = svgContent.replace(/{{PRICE_HEADER}}/g, priceHeader || 'Incl. VAT');
      svgContent = svgContent.replace(/{{PRICE_AMOUNT}}/g, priceAmount || 'R51,779.35');
      svgContent = svgContent.replace(/{{PRICE_NOTE}}/g, priceNote || 'Professional Installation Available');
      
      // NEW: Delivery section
      svgContent = svgContent.replace(/{{DELIVERY_1}}/g, delivery1 || 'Delivery JHB free up to 20 km');
      svgContent = svgContent.replace(/{{DELIVERY_2}}/g, delivery2 || 'Delivery 60-100 km JHB R440 fee');
      svgContent = svgContent.replace(/{{DELIVERY_3}}/g, delivery3 || 'Fee for other regions calculated');
      
      // Contact section
      svgContent = svgContent.replace(/{{CONTACT_PHONE_1}}/g, contactPhone1 || '011 568 7166');
      svgContent = svgContent.replace(/{{CONTACT_PHONE_2}}/g, contactPhone2 || '067 923 8166');
      svgContent = svgContent.replace(/{{CONTACT_EMAIL}}/g, contactEmail || 'sales@bshockedelectrical.co.za');
      svgContent = svgContent.replace(/{{CONTACT_WEBSITE}}/g, contactWebsite || 'https://bshockedelectrical.co.za');
    }
    
    // Handle other templates (existing logic)
    if (title) svgContent = svgContent.replace(/{{PRODUCT_TITLE}}/g, title);
    if (price) svgContent = svgContent.replace(/{{PRODUCT_PRICE}}/g, price);
    if (sku) svgContent = svgContent.replace(/{{PRODUCT_SKU}}/g, sku);
    if (description) svgContent = svgContent.replace(/{{PRODUCT_DESCRIPTION}}/g, description);
    if (company) svgContent = svgContent.replace(/{{COMPANY_NAME}}/g, company);
    if (phone) svgContent = svgContent.replace(/{{PHONE_NUMBER}}/g, phone);
    if (email) svgContent = svgContent.replace(/{{EMAIL}}/g, email);
    if (website) svgContent = svgContent.replace(/{{WEBSITE}}/g, website);
    
    // Handle Solar Bulk Deal specific placeholders (for other templates)
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
    
    // Handle bullet points for other templates
    if (bulletPoint1) svgContent = svgContent.replace(/{{BULLET_POINT_1}}/g, bulletPoint1);
    if (bulletPoint2) svgContent = svgContent.replace(/{{BULLET_POINT_2}}/g, bulletPoint2);
    if (bulletPoint3) svgContent = svgContent.replace(/{{BULLET_POINT_3}}/g, bulletPoint3);
    if (bulletPoint4) svgContent = svgContent.replace(/{{BULLET_POINT_4}}/g, bulletPoint4);
    if (bulletPoint5) svgContent = svgContent.replace(/{{BULLET_POINT_5}}/g, bulletPoint5);
    
    // Handle image embedding for all templates
    if (imageUrl && templateId !== 'solar-kit-social') {
      if (imageUrl.startsWith('data:')) {
        svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, imageUrl);
      } else {
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
          svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        }
      }
    } else if (templateId !== 'solar-kit-social') {
      svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    }
    
    // Replace any remaining placeholders with empty strings
    svgContent = svgContent.replace(/{{BULLET_POINT_\d+}}/g, '');
    svgContent = svgContent.replace(/{{[^}]+}}/g, '');
    
    // Set SVG content type header
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache'); // Disable caching for preview
    res.status(200).send(svgContent);
    
  } catch (error) {
    console.error('Error rendering template:', error);
    res.status(500).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <text x="20" y="150" font-family="Arial" font-size="20" fill="red">Error: ${error.message}</text>
    </svg>`);
  }
};
