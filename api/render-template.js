// api/render-template.js - Updated with dynamic field support and crash fixes
module.exports = async (req, res) => {
  try {
    console.log('=== RENDER TEMPLATE DEBUG ===');
    console.log('Method:', req.method);
    console.log('Query params count:', Object.keys(req.query).length);
    
    const { templateId } = req.query;
    
    if (!templateId) {
      console.log('ERROR: Missing templateId');
      return res.status(400).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <text x="20" y="150" font-family="Arial" font-size="20" fill="red">Error: Missing templateId</text>
      </svg>`);
    }
    
    console.log('Template ID:', templateId);
    
    // Enhanced XML Escaping function to prevent crashes
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
    
    // Get all parameters from query - ENHANCED to handle dynamic fields
    const {
      title, price, sku, description, company, phone, email, website, imageUrl,
      // Solar Bulk Deal fields
      promotionTitle, imageTitle, secondaryDescription,
      // Solar Kit Social fields
      ratingText, brandText, categoryText, mainTitle,
      // Description and benefits
      descriptionTitle, descriptionLine1, descriptionLine2, descriptionLine3,
      descriptionLine4, descriptionLine5, descriptionLine6,
      benefit1, benefit2, benefit3, benefit4, benefit5,
      // Price section
      priceHeader, priceAmount, priceNote,
      // Delivery section
      delivery1, delivery2, delivery3,
      // Contact section
      contactPhone1, contactPhone2, contactEmail, contactWebsite
    } = req.query;

    // Extract dynamic fields from query parameters
    const dynamicFields = {
      powerDetails: {},
      panelDetails: {},
      mountDetails: {},
      elecDetails: {},
      cableDetails: {},
      additionalParts: {},
      bulletPoints: {}
    };

    // Process all query parameters to find dynamic fields
    Object.keys(req.query).forEach(key => {
      if (key.startsWith('powerDetail')) {
        const number = key.replace('powerDetail', '');
        dynamicFields.powerDetails[number] = req.query[key];
      } else if (key.startsWith('panelDetail')) {
        const number = key.replace('panelDetail', '');
        dynamicFields.panelDetails[number] = req.query[key];
      } else if (key.startsWith('mountDetail')) {
        const number = key.replace('mountDetail', '');
        dynamicFields.mountDetails[number] = req.query[key];
      } else if (key.startsWith('elecDetail')) {
        const number = key.replace('elecDetail', '');
        dynamicFields.elecDetails[number] = req.query[key];
      } else if (key.startsWith('cableDetail')) {
        const number = key.replace('cableDetail', '');
        dynamicFields.cableDetails[number] = req.query[key];
      } else if (key.startsWith('additionalPart')) {
        const number = key.replace('additionalPart', '');
        dynamicFields.additionalParts[number] = req.query[key];
      } else if (key.startsWith('bulletPoint')) {
        const number = key.replace('bulletPoint', '');
        dynamicFields.bulletPoints[number] = req.query[key];
      }
    });
    
    // Debug log key parameters and dynamic field counts
    console.log('Key params received:', {
      ratingText: !!ratingText,
      brandText: !!brandText,
      mainTitle: !!mainTitle,
      sku: !!sku,
      imageTitle: !!imageTitle,
      secondaryDescription: !!secondaryDescription
    });
    console.log('Dynamic field counts:', {
      powerDetails: Object.keys(dynamicFields.powerDetails).length,
      panelDetails: Object.keys(dynamicFields.panelDetails).length,
      mountDetails: Object.keys(dynamicFields.mountDetails).length,
      elecDetails: Object.keys(dynamicFields.elecDetails).length,
      cableDetails: Object.keys(dynamicFields.cableDetails).length,
      additionalParts: Object.keys(dynamicFields.additionalParts).length
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
    let svgContent;
    
    // Handle debug template with inline fallback
    if (templateId === 'debug-simple' && !fs.existsSync(svgPath)) {
      console.log('Creating inline debug template');
      svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#1e3a8a"/>
        <rect x="50" y="50" width="700" height="100" fill="#f59e0b" rx="10"/>
        <text x="400" y="110" fill="white" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle">INLINE DEBUG TEMPLATE</text>
        <text x="80" y="200" fill="white" font-family="Arial, sans-serif" font-size="20">SKU: ${escapeXML(sku || 'TEST-SKU')}</text>
        <text x="80" y="250" fill="#fbbf24" font-family="Arial, sans-serif" font-size="18">${escapeXML(ratingText || 'Debug Rating')}</text>
        <text x="80" y="280" fill="white" font-family="Arial, sans-serif" font-size="16">${escapeXML(brandText || 'Debug Brand')}</text>
        <text x="80" y="310" fill="white" font-family="Arial, sans-serif" font-size="16">${escapeXML(categoryText || 'Debug Category')}</text>
        <rect x="50" y="400" width="300" height="80" fill="#f59e0b" rx="10"/>
        <text x="200" y="450" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">${escapeXML(priceAmount || 'R999.99')}</text>
        <text x="400" y="450" fill="white" font-family="Arial, sans-serif" font-size="14">Template: Inline ✓</text>
        <text x="400" y="470" fill="white" font-family="Arial, sans-serif" font-size="14">API: Working ✓</text>
        <text x="400" y="490" fill="white" font-family="Arial, sans-serif" font-size="14">Time: ${new Date().toISOString()}</text>
      </svg>`;
    } else {
      svgContent = fs.readFileSync(svgPath, 'utf8');
    }
    
    console.log('SVG content length:', svgContent.length);
    
    // Handle Solar Kit Social template specifically
    if (templateId === 'solar-kit-social') {
      console.log('Processing solar-kit-social template with dynamic fields');
      
      // Header fields - FIXED escaping
      if (ratingText) svgContent = svgContent.replace(/\{\{RATING_TEXT\}\}/g, escapeXML(ratingText));
      if (brandText) svgContent = svgContent.replace(/\{\{BRAND_TEXT\}\}/g, escapeXML(brandText));
      if (categoryText) svgContent = svgContent.replace(/\{\{CATEGORY_TEXT\}\}/g, escapeXML(categoryText));
      if (mainTitle) svgContent = svgContent.replace(/\{\{MAIN_TITLE\}\}/g, escapeXML(mainTitle));
      if (sku) svgContent = svgContent.replace(/\{\{PRODUCT_SKU\}\}/g, escapeXML(sku));
      
      // Image section - ENHANCED to dynamically insert image element
      if (imageUrl && imageUrl.startsWith('data:')) {
        console.log('Inserting product image');
        // Replace the placeholder rect with an actual image element
        const imageRect = '<rect x="45" y="325" width="210" height="150" fill="#f0f0f0" rx="3"/>\n  <text x="150" y="400" fill="#666" font-family="Arial, sans-serif" font-size="12" text-anchor="middle">[Product Image]</text>';
        const imageElement = `<image x="45" y="325" width="210" height="150" href="${imageUrl}" preserveAspectRatio="xMidYMid meet"/>`;
        svgContent = svgContent.replace(imageRect, imageElement);
      } else {
        console.log('Using placeholder image');
        // Keep the placeholder rect as is
      }
      
      // FIXED: Image title and secondary description with proper escaping
      if (imageTitle) {
        console.log('Processing imageTitle:', imageTitle);
        svgContent = svgContent.replace(/\{\{IMAGE_TITLE\}\}/g, escapeXML(imageTitle));
      }
      if (secondaryDescription) {
        console.log('Processing secondaryDescription:', secondaryDescription);
        svgContent = svgContent.replace(/\{\{SECONDARY_DESCRIPTION\}\}/g, escapeXML(secondaryDescription));
      }
      
      // Dynamic Power System fields (1-3)
      Object.keys(dynamicFields.powerDetails).forEach(num => {
        const placeholder = `\\{\\{POWER_DETAIL_${num}\\}\\}`;
        const value = dynamicFields.powerDetails[num];
        if (value) {
          svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
          console.log(`Replaced POWER_DETAIL_${num}`);
        }
      });
      
      // Dynamic Solar Panel fields (1-2)
      Object.keys(dynamicFields.panelDetails).forEach(num => {
        const placeholder = `\\{\\{PANEL_DETAIL_${num}\\}\\}`;
        const value = dynamicFields.panelDetails[num];
        if (value) {
          svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
          console.log(`Replaced PANEL_DETAIL_${num}`);
        }
      });
      
      // Dynamic Mounting Hardware fields (1-3)
      Object.keys(dynamicFields.mountDetails).forEach(num => {
        const placeholder = `\\{\\{MOUNT_DETAIL_${num}\\}\\}`;
        const value = dynamicFields.mountDetails[num];
        if (value) {
          svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
          console.log(`Replaced MOUNT_DETAIL_${num}`);
        }
      });
      
      // Dynamic Electrical Components fields (1-3)
      Object.keys(dynamicFields.elecDetails).forEach(num => {
        const placeholder = `\\{\\{ELEC_DETAIL_${num}\\}\\}`;
        const value = dynamicFields.elecDetails[num];
        if (value) {
          svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
          console.log(`Replaced ELEC_DETAIL_${num}`);
        }
      });
      
      // Dynamic Cables & Installation fields (1-3)
      Object.keys(dynamicFields.cableDetails).forEach(num => {
        const placeholder = `\\{\\{CABLE_DETAIL_${num}\\}\\}`;
        const value = dynamicFields.cableDetails[num];
        if (value) {
          svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
          console.log(`Replaced CABLE_DETAIL_${num}`);
        }
      });
      
      // NEW: Dynamic Additional Parts fields (1-10)
      Object.keys(dynamicFields.additionalParts).forEach(num => {
        const placeholder = `\\{\\{ADDITIONAL_PART_${num}\\}\\}`;
        const value = dynamicFields.additionalParts[num];
        if (value) {
          svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
          console.log(`Replaced ADDITIONAL_PART_${num}`);
        }
      });
      
      // Description section
      if (descriptionTitle) svgContent = svgContent.replace(/\{\{DESCRIPTION_TITLE\}\}/g, escapeXML(descriptionTitle));
      if (descriptionLine1) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_1\}\}/g, escapeXML(descriptionLine1));
      if (descriptionLine2) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_2\}\}/g, escapeXML(descriptionLine2));
      if (descriptionLine3) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_3\}\}/g, escapeXML(descriptionLine3));
      if (descriptionLine4) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_4\}\}/g, escapeXML(descriptionLine4));
      if (descriptionLine5) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_5\}\}/g, escapeXML(descriptionLine5));
      if (descriptionLine6) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_6\}\}/g, escapeXML(descriptionLine6));
      
      // Benefits
      if (benefit1) svgContent = svgContent.replace(/\{\{BENEFIT_1\}\}/g, escapeXML(benefit1));
      if (benefit2) svgContent = svgContent.replace(/\{\{BENEFIT_2\}\}/g, escapeXML(benefit2));
      if (benefit3) svgContent = svgContent.replace(/\{\{BENEFIT_3\}\}/g, escapeXML(benefit3));
      if (benefit4) svgContent = svgContent.replace(/\{\{BENEFIT_4\}\}/g, escapeXML(benefit4));
      if (benefit5) svgContent = svgContent.replace(/\{\{BENEFIT_5\}\}/g, escapeXML(benefit5));
      
      // Price section
      if (priceHeader) svgContent = svgContent.replace(/\{\{PRICE_HEADER\}\}/g, escapeXML(priceHeader));
      if (priceAmount) svgContent = svgContent.replace(/\{\{PRICE_AMOUNT\}\}/g, escapeXML(priceAmount));
      if (priceNote) svgContent = svgContent.replace(/\{\{PRICE_NOTE\}\}/g, escapeXML(priceNote));
      
      // Delivery section
      if (delivery1) svgContent = svgContent.replace(/\{\{DELIVERY_1\}\}/g, escapeXML(delivery1));
      if (delivery2) svgContent = svgContent.replace(/\{\{DELIVERY_2\}\}/g, escapeXML(delivery2));
      if (delivery3) svgContent = svgContent.replace(/\{\{DELIVERY_3\}\}/g, escapeXML(delivery3));
      
      // Contact section
      if (contactPhone1) svgContent = svgContent.replace(/\{\{CONTACT_PHONE_1\}\}/g, escapeXML(contactPhone1));
      if (contactPhone2) svgContent = svgContent.replace(/\{\{CONTACT_PHONE_2\}\}/g, escapeXML(contactPhone2));
      if (contactEmail) svgContent = svgContent.replace(/\{\{CONTACT_EMAIL\}\}/g, escapeXML(contactEmail));
      if (contactWebsite) svgContent = svgContent.replace(/\{\{CONTACT_WEBSITE\}\}/g, escapeXML(contactWebsite));
      
      console.log('Completed solar-kit-social dynamic field replacements');
    }
    
    // Handle other templates (existing logic) - FIXED escaping
    if (title) svgContent = svgContent.replace(/\{\{PRODUCT_TITLE\}\}/g, escapeXML(title));
    if (price) svgContent = svgContent.replace(/\{\{PRODUCT_PRICE\}\}/g, escapeXML(price));
    if (sku) svgContent = svgContent.replace(/\{\{PRODUCT_SKU\}\}/g, escapeXML(sku));
    if (description) svgContent = svgContent.replace(/\{\{PRODUCT_DESCRIPTION\}\}/g, escapeXML(description));
    if (company) svgContent = svgContent.replace(/\{\{COMPANY_NAME\}\}/g, escapeXML(company));
    if (phone) svgContent = svgContent.replace(/\{\{PHONE_NUMBER\}\}/g, escapeXML(phone));
    if (email) svgContent = svgContent.replace(/\{\{EMAIL\}\}/g, escapeXML(email));
    if (website) svgContent = svgContent.replace(/\{\{WEBSITE\}\}/g, escapeXML(website));
    
    // Handle other template-specific fields with improved escaping
    if (promotionTitle) svgContent = svgContent.replace(/\{\{PROMOTION_TITLE\}\}/g, escapeXML(promotionTitle));
    if (imageTitle) svgContent = svgContent.replace(/\{\{IMAGE_TITLE\}\}/g, escapeXML(imageTitle));
    if (secondaryDescription) svgContent = svgContent.replace(/\{\{SECONDARY_DESCRIPTION\}\}/g, escapeXML(secondaryDescription));
    
    // Dynamic bullet points for other templates
    Object.keys(dynamicFields.bulletPoints).forEach(num => {
      const placeholder = `\\{\\{BULLET_POINT_${num}\\}\\}`;
      const value = dynamicFields.bulletPoints[num];
      if (value) {
        svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
      }
    });
    
    // Replace any remaining placeholders with empty strings (this removes any unused placeholders)
    const beforeCleanup = svgContent.length;
    svgContent = svgContent.replace(/\{\{[^}]+\}\}/g, '');
    const afterCleanup = svgContent.length;
    
    console.log('SVG length before cleanup:', beforeCleanup);
    console.log('SVG length after cleanup:', afterCleanup);
    console.log('Placeholders removed:', beforeCleanup - afterCleanup);
    console.log('Dynamic fields processed:', {
      powerDetails: Object.keys(dynamicFields.powerDetails).length,
      additionalParts: Object.keys(dynamicFields.additionalParts).length
    });
    
    // Validate SVG before sending
    if (svgContent.includes('<svg') && svgContent.includes('</svg>')) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).send(svgContent);
      console.log('=== RENDER COMPLETE ===');
    } else {
      console.log('ERROR: Invalid SVG generated');
      res.status(500).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <text x="20" y="50" font-family="Arial" font-size="16" fill="red">SVG Generation Error</text>
        <text x="20" y="80" font-family="Arial" font-size="12" fill="red">Invalid SVG structure generated</text>
      </svg>`);
    }
    
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
      <text x="20" y="100" font-family="Arial" font-size="12" fill="red">Check console for details</text>
    </svg>`);
  }
};
