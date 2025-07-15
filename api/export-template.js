// api/export-template.js - Updated with dynamic field support
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
    
    // Enhanced XML Escaping function to handle all characters
    const escapeXML = (str) => {
      if (!str) return '';
      return str
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\t/g, ' ')
        .substring(0, 150); // Limit length to prevent SVG overflow
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
      console.log('Processing solar-kit-social export with dynamic fields:', Object.keys(productData));
      
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
      
      // Dynamic Power System fields (1-3)
      for (let i = 1; i <= 3; i++) {
        const fieldName = `powerDetail${i}`;
        if (productData[fieldName]) {
          svgContent = svgContent.replace(new RegExp(`{{POWER_DETAIL_${i}}}`, 'g'), escapeXML(productData[fieldName]));
          console.log(`Exported POWER_DETAIL_${i}`);
        }
      }
      
      // Dynamic Solar Panel fields (1-2)
      for (let i = 1; i <= 2; i++) {
        const fieldName = `panelDetail${i}`;
        if (productData[fieldName]) {
          svgContent = svgContent.replace(new RegExp(`{{PANEL_DETAIL_${i}}}`, 'g'), escapeXML(productData[fieldName]));
          console.log(`Exported PANEL_DETAIL_${i}`);
        }
      }
      
      // Dynamic Mounting Hardware fields (1-3)
      for (let i = 1; i <= 3; i++) {
        const fieldName = `mountDetail${i}`;
        if (productData[fieldName]) {
          svgContent = svgContent.replace(new RegExp(`{{MOUNT_DETAIL_${i}}}`, 'g'), escapeXML(productData[fieldName]));
          console.log(`Exported MOUNT_DETAIL_${i}`);
        }
      }
      
      // Dynamic Electrical Components fields (1-3)
      for (let i = 1; i <= 3; i++) {
        const fieldName = `elecDetail${i}`;
        if (productData[fieldName]) {
          svgContent = svgContent.replace(new RegExp(`{{ELEC_DETAIL_${i}}}`, 'g'), escapeXML(productData[fieldName]));
          console.log(`Exported ELEC_DETAIL_${i}`);
        }
      }
      
      // Dynamic Cables & Installation fields (1-3)
      for (let i = 1; i <= 3; i++) {
        const fieldName = `cableDetail${i}`;
        if (productData[fieldName]) {
          svgContent = svgContent.replace(new RegExp(`{{CABLE_DETAIL_${i}}}`, 'g'), escapeXML(productData[fieldName]));
          console.log(`Exported CABLE_DETAIL_${i}`);
        }
      }
      
      // NEW: Dynamic Additional Parts fields (1-10)
      for (let i = 1; i <= 10; i++) {
        const fieldName = `additionalPart${i}`;
        if (productData[fieldName]) {
          svgContent = svgContent.replace(new RegExp(`{{ADDITIONAL_PART_${i}}}`, 'g'), escapeXML(productData[fieldName]));
          console.log(`Exported ADDITIONAL_PART_${i}`);
        }
      }
      
      // Description section - ONLY if exists
      if (productData.descriptionTitle) svgContent = svgContent.replace(/{{DESCRIPTION_TITLE}}/g, escapeXML(productData.descriptionTitle));
      for (let i = 1; i <= 6; i++) {
        const fieldName = `descriptionLine${i}`;
        if (productData[fieldName]) {
          svgContent = svgContent.replace(new RegExp(`{{DESCRIPTION_LINE_${i}}}`, 'g'), escapeXML(productData[fieldName]));
        }
      }
      
      // Benefits - ONLY if exists
      for (let i = 1; i <= 5; i++) {
        const fieldName = `benefit${i}`;
        if (productData[fieldName]) {
          svgContent = svgContent.replace(new RegExp(`{{BENEFIT_${i}}}`, 'g'), escapeXML(productData[fieldName]));
        }
      }
      
      // Price section - ONLY if exists
      if (productData.priceHeader) svgContent = svgContent.replace(/{{PRICE_HEADER}}/g, escapeXML(productData.priceHeader));
      if (productData.priceAmount) svgContent = svgContent.replace(/{{PRICE_AMOUNT}}/g, escapeXML(productData.priceAmount));
      if (productData.priceNote) svgContent = svgContent.replace(/{{PRICE_NOTE}}/g, escapeXML(productData.priceNote));
      
      // Delivery section - ONLY if exists
      for (let i = 1; i <= 3; i++) {
        const fieldName = `delivery${i}`;
        if (productData[fieldName]) {
          svgContent = svgContent.replace(new RegExp(`{{DELIVERY_${i}}}`, 'g'), escapeXML(productData[fieldName]));
        }
      }
      
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
      
      // Bullet points for other templates - Dynamic handling
      for (let i = 1; i <= 5; i++) {
        const fieldName = `bulletPoint${i}`;
        if (productData[fieldName]) {
          svgContent = svgContent.replace(new RegExp(`{{BULLET_POINT_${i}}}`, 'g'), escapeXML(productData[fieldName]));
        }
      }
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
    
    // Count dynamic fields that were processed
    const dynamicFieldsProcessed = {
      powerDetails: Object.keys(productData || {}).filter(k => k.startsWith('powerDetail') && productData[k]).length,
      panelDetails: Object.keys(productData || {}).filter(k => k.startsWith('panelDetail') && productData[k]).length,
      mountDetails: Object.keys(productData || {}).filter(k => k.startsWith('mountDetail') && productData[k]).length,
      elecDetails: Object.keys(productData || {}).filter(k => k.startsWith('elecDetail') && productData[k]).length,
      cableDetails: Object.keys(productData || {}).filter(k => k.startsWith('cableDetail') && productData[k]).length,
      additionalParts: Object.keys(productData || {}).filter(k => k.startsWith('additionalPart') && productData[k]).length
    };
    console.log('Dynamic fields processed in export:', dynamicFieldsProcessed);
    
    // For now, always return SVG (PNG conversion causes issues on Vercel)
    // You can convert SVG to PNG client-side if needed
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', `attachment; filename="${templateId}-dynamic.svg"`);
    res.status(200).send(svgContent);
    
  } catch (error) {
    console.error('Error exporting template:', error);
    res.status(500).json({ error: error.message });
  }
};
