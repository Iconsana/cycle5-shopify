// api/render-template.js
module.exports = async (req, res) => {
  try {
    const { templateId } = req.query;
    
    if (!templateId) {
      return res.status(400).json({ error: 'Missing templateId parameter' });
    }
    
    // Get parameters from query - include all the existing fields plus new solar-kit-social fields
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
      // Existing Solar Bulk Deal fields
      promotionTitle,
      imageTitle,
      secondaryDescription,
      bulletPoint1,
      bulletPoint2,
      bulletPoint3,
      bulletPoint4,
      bulletPoint5,
      // New Solar Kit Social fields
      ratingText,
      brandText,
      categoryText,
      mainTitle,
      descriptionTitle,
      descriptionLine1,
      descriptionLine2,
      descriptionLine3,
      descriptionLine4,
      descriptionLine5,
      descriptionLine6,
      powerDetail1,
      powerDetail2,
      panelDetail1,
      panelDetail2,
      mountDetail1,
      mountDetail2,
      elecDetail1,
      elecDetail2,
      cableDetail1,
      cableDetail2,
      warrantyDetail1,
      warrantyDetail2,
      performanceDetail1,
      performanceDetail2,
      benefit1,
      benefit2,
      benefit3,
      benefit4,
      benefit5,
      priceHeader,
      priceAmount,
      priceNote,
      delivery1,
      delivery2,
      delivery3,
      contactPhone1,
      contactPhone2,
      contactEmail,
      contactWebsite
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
    
    // Replace standard placeholders with actual values (existing logic)
    if (title) svgContent = svgContent.replace(/{{PRODUCT_TITLE}}/g, title);
    if (price) svgContent = svgContent.replace(/{{PRODUCT_PRICE}}/g, price);
    if (sku) svgContent = svgContent.replace(/{{PRODUCT_SKU}}/g, sku);
    if (description) svgContent = svgContent.replace(/{{PRODUCT_DESCRIPTION}}/g, description);
    if (company) svgContent = svgContent.replace(/{{COMPANY_NAME}}/g, company);
    if (phone) svgContent = svgContent.replace(/{{PHONE_NUMBER}}/g, phone);
    if (email) svgContent = svgContent.replace(/{{EMAIL}}/g, email);
    if (website) svgContent = svgContent.replace(/{{WEBSITE}}/g, website);
    
    // Handle Solar Bulk Deal specific placeholders (existing logic)
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
    
    // Handle existing bullet points
    if (bulletPoint1) svgContent = svgContent.replace(/{{BULLET_POINT_1}}/g, bulletPoint1);
    if (bulletPoint2) svgContent = svgContent.replace(/{{BULLET_POINT_2}}/g, bulletPoint2);
    if (bulletPoint3) svgContent = svgContent.replace(/{{BULLET_POINT_3}}/g, bulletPoint3);
    if (bulletPoint4) svgContent = svgContent.replace(/{{BULLET_POINT_4}}/g, bulletPoint4);
    if (bulletPoint5) svgContent = svgContent.replace(/{{BULLET_POINT_5}}/g, bulletPoint5);
    
    // NEW: Handle Solar Kit Social specific placeholders
    if (templateId === 'solar-kit-social') {
      // Header fields
      if (ratingText) svgContent = svgContent.replace(/Hellopeter 4\.99/g, ratingText);
      if (brandText) svgContent = svgContent.replace(/B SHOCKED/g, brandText);
      if (categoryText) svgContent = svgContent.replace(/ELECTRICAL \| SOLAR/g, categoryText);
      if (mainTitle) svgContent = svgContent.replace(/SOLAR KIT PACKAGE/g, mainTitle);
      
      // Product details
      if (powerDetail1) svgContent = svgContent.replace(/• 5kW Deye Hybrid Inverter/g, powerDetail1);
      if (powerDetail2) svgContent = svgContent.replace(/• 5\.12kWh Dyness Lithium Battery/g, powerDetail2);
      if (panelDetail1) svgContent = svgContent.replace(/• 8x 565W JA Solar Mono Panels/g, panelDetail1);
      if (panelDetail2) svgContent = svgContent.replace(/• 4\.52kW Total Panel Capacity/g, panelDetail2);
      if (mountDetail1) svgContent = svgContent.replace(/• PV Rails, Roof Hooks, Clamps/g, mountDetail1);
      if (mountDetail2) svgContent = svgContent.replace(/• Complete Mounting System/g, mountDetail2);
      if (elecDetail1) svgContent = svgContent.replace(/• DC\/AC Combiners, Surge Protection/g, elecDetail1);
      if (elecDetail2) svgContent = svgContent.replace(/• Fuses, Switches, Safety Equipment/g, elecDetail2);
      if (cableDetail1) svgContent = svgContent.replace(/• Solar Cables, Battery Cables, MC4/g, cableDetail1);
      if (cableDetail2) svgContent = svgContent.replace(/• Conduits, Trunking, Earth Spike/g, cableDetail2);
      if (warrantyDetail1) svgContent = svgContent.replace(/• 25yr Panels, 10yr Inverter & Battery/g, warrantyDetail1);
      if (warrantyDetail2) svgContent = svgContent.replace(/• Grid-Tie Hybrid, Professional Install/g, warrantyDetail2);
      if (performanceDetail1) svgContent = svgContent.replace(/• ~1,800kWh\/month Generation/g, performanceDetail1);
      if (performanceDetail2) svgContent = svgContent.replace(/• 85% Energy Independence/g, performanceDetail2);
      
      // Description section
      if (descriptionTitle) svgContent = svgContent.replace(/COMPLETE SOLAR KIT/g, descriptionTitle);
      if (descriptionLine1) svgContent = svgContent.replace(/Everything you need for a/g, descriptionLine1);
      if (descriptionLine2) svgContent = svgContent.replace(/professional solar installation\./g, descriptionLine2);
      if (descriptionLine3) svgContent = svgContent.replace(/Hybrid system with battery/g, descriptionLine3);
      if (descriptionLine4) svgContent = svgContent.replace(/backup for load-shedding/g, descriptionLine4);
      if (descriptionLine5) svgContent = svgContent.replace(/protection and energy/g, descriptionLine5);
      if (descriptionLine6) svgContent = svgContent.replace(/independence\./g, descriptionLine6);
      
      // Benefits
      if (benefit1) svgContent = svgContent.replace(/✓ Load Shedding Protection/g, benefit1);
      if (benefit2) svgContent = svgContent.replace(/✓ Reduce Electricity Bills/g, benefit2);
      if (benefit3) svgContent = svgContent.replace(/✓ Eco-Friendly Power/g, benefit3);
      if (benefit4) svgContent = svgContent.replace(/✓ Professional Support/g, benefit4);
      if (benefit5) svgContent = svgContent.replace(/✓ Complete Installation Kit/g, benefit5);
      
      // Price section
      if (priceHeader) svgContent = svgContent.replace(/Incl\. VAT/g, priceHeader);
      if (priceAmount) svgContent = svgContent.replace(/R51,779\.35/g, priceAmount);
      if (priceNote) svgContent = svgContent.replace(/Professional Installation Available/g, priceNote);
      
      // Delivery section
      if (delivery1) svgContent = svgContent.replace(/Delivery JHB free up to 20 km/g, delivery1);
      if (delivery2) svgContent = svgContent.replace(/Delivery 60-100 km JHB R440 fee/g, delivery2);
      if (delivery3) svgContent = svgContent.replace(/Fee for other regions calculated/g, delivery3);
      
      // Contact section
      if (contactPhone1) svgContent = svgContent.replace(/011 568 7166/g, contactPhone1);
      if (contactPhone2) svgContent = svgContent.replace(/067 923 8166/g, contactPhone2);
      if (contactEmail) svgContent = svgContent.replace(/sales@bshockedelectrical\.co\.za/g, contactEmail);
      if (contactWebsite) svgContent = svgContent.replace(/https:\/\/bshockedelectrical\.co\.za/g, contactWebsite);
    }
    
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
    // First, clear any remaining bullet points
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
