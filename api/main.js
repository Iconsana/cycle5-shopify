// api/main.js - Consolidated API handler to reduce function count
module.exports = async (req, res) => {
  const { action } = req.query;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    switch (action) {
      case 'templates':
        return await handleTemplates(req, res);
      case 'render':
        return await handleRender(req, res);
      case 'export':
        return await handleExport(req, res);
      case 'debug':
        return await handleDebug(req, res);
      case 'colors':
        return await handleColors(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action parameter' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Handle templates listing
async function handleTemplates(req, res) {
  const templates = [
    { id: 'debug-simple', name: 'Debug Simple' },
    { id: 'battery-style', name: 'Battery Style' },
    { id: 'circuit-promo', name: 'Circuit Promo' },
    { id: 'gradient-seasonal', name: 'Gradient Seasonal' },
    { id: 'tech-enhanced', name: 'Tech Enhanced' },
    { id: 'solar-bulk-deal', name: 'Solar Bulk Deal' },
    { id: 'solar-kit-social', name: 'Solar Kit Social' },
    { id: 'solar-kit-social-v1', name: 'Solar Kit Social V1 (Vertical)' },
    { id: 'solar-kit-social-v3', name: 'Solar Kit Social V3 (Two-Column)' }
  ];
  
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    success: true,
    data: templates,
    timestamp: new Date().toISOString()
  });
}

// Handle template rendering (SVG generation)
async function handleRender(req, res) {
  let templateId, queryData;
  
  // Handle both GET and POST requests
  if (req.method === 'POST') {
    // For POST requests, get data from body
    const body = req.body || {};
    templateId = body.templateId;
    queryData = body.productData || {};
    
    // Also include company data if provided
    if (body.companyData) {
      Object.assign(queryData, body.companyData);
    }
    
    console.log('POST render request for template:', templateId);
    console.log('POST data keys:', Object.keys(queryData));
  } else {
    // For GET requests, use query parameters as before
    templateId = req.query.templateId;
    queryData = req.query;
    console.log('GET render request for template:', templateId);
  }
  
  if (!templateId) {
    return res.status(400).send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <text x="20" y="150" font-family="Arial" font-size="20" fill="red">Error: Missing templateId</text>
    </svg>`);
  }
  
  // Enhanced XML Escaping function
  const escapeXML = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\t/g, ' ')
      .substring(0, 150);
  };
  
  // Get parameters from the unified queryData object
  const {
    ratingText, brandText, categoryText, mainTitle, sku,
    imageTitle, secondaryDescription, image, imageUrl,
    priceHeader, priceAmount, priceNote,
    delivery1, delivery2, delivery3,
    contactPhone1, contactPhone2, contactEmail, contactWebsite,
    benefit1, benefit2, benefit3, benefit4, benefit5,
    descriptionTitle, descriptionLine1, descriptionLine2, descriptionLine3, descriptionLine4, descriptionLine5, descriptionLine6
  } = queryData;
  
  // Extract dynamic fields from unified queryData (works for both GET and POST)
  const dynamicFields = {
    powerDetails: {},
    panelDetails: {},
    mountDetails: {},
    elecDetails: {},
    cableDetails: {},
    additionalParts: {}
  };
  
  Object.keys(queryData).forEach(key => {
    if (key.startsWith('powerDetail')) {
      const number = key.replace('powerDetail', '');
      dynamicFields.powerDetails[number] = queryData[key];
    } else if (key.startsWith('panelDetail')) {
      const number = key.replace('panelDetail', '');
      dynamicFields.panelDetails[number] = queryData[key];
    } else if (key.startsWith('mountDetail')) {
      const number = key.replace('mountDetail', '');
      dynamicFields.mountDetails[number] = queryData[key];
    } else if (key.startsWith('elecDetail')) {
      const number = key.replace('elecDetail', '');
      dynamicFields.elecDetails[number] = queryData[key];
    } else if (key.startsWith('cableDetail')) {
      const number = key.replace('cableDetail', '');
      dynamicFields.cableDetails[number] = queryData[key];
    } else if (key.startsWith('additionalPart')) {
      const number = key.replace('additionalPart', '');
      dynamicFields.additionalParts[number] = queryData[key];
    }
  });
  
  // Handle debug template inline
  if (templateId === 'debug-simple') {
    const debugSvg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#1e3a8a"/>
      <rect x="50" y="50" width="700" height="100" fill="#f59e0b" rx="10"/>
      <text x="400" y="110" fill="white" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle">✅ SYSTEM WORKING</text>
      <text x="80" y="200" fill="white" font-family="Arial, sans-serif" font-size="20">SKU: ${escapeXML(sku || 'TEST-SKU')}</text>
      <text x="80" y="250" fill="#fbbf24" font-family="Arial, sans-serif" font-size="18">${escapeXML(ratingText || 'Debug Rating')}</text>
      <text x="80" y="280" fill="white" font-family="Arial, sans-serif" font-size="16">${escapeXML(brandText || 'Debug Brand')}</text>
      <text x="80" y="310" fill="white" font-family="Arial, sans-serif" font-size="16">${escapeXML(categoryText || 'Debug Category')}</text>
      <rect x="50" y="400" width="300" height="80" fill="#f59e0b" rx="10"/>
      <text x="200" y="450" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">${escapeXML(priceAmount || 'R999.99')}</text>
      <text x="400" y="450" fill="white" font-family="Arial, sans-serif" font-size="14">API: Consolidated ✓</text>
      <text x="400" y="470" fill="white" font-family="Arial, sans-serif" font-size="14">Functions: Under 12 ✓</text>
      <text x="400" y="490" fill="white" font-family="Arial, sans-serif" font-size="14">Vercel: Deploy Ready ✓</text>
      <text x="400" y="520" fill="#fbbf24" font-family="Arial, sans-serif" font-size="12">Fields: ${Object.values(dynamicFields).reduce((a, b) => a + Object.keys(b).length, 0)}</text>
    </svg>`;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(debugSvg);
  }
  
  // Try to read template file
  const path = require('path');
  const fs = require('fs');
  
  const templatesDir = path.join(process.cwd(), 'client/public/templates');
  const svgPath = path.join(templatesDir, `${templateId}.svg`);
  
  if (!fs.existsSync(svgPath)) {
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <text x="20" y="50" font-family="Arial" font-size="16" fill="red">Template not found: ${escapeXML(templateId)}</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(404).send(errorSvg);
  }
  
  let svgContent = fs.readFileSync(svgPath, 'utf8');
  
  // Process solar-kit-social template (all versions)
  if (templateId === 'solar-kit-social' || templateId.startsWith('solar-kit-social-v')) {
    // Basic fields
    if (ratingText) svgContent = svgContent.replace(/\{\{RATING_TEXT\}\}/g, escapeXML(ratingText));
    if (brandText) svgContent = svgContent.replace(/\{\{BRAND_TEXT\}\}/g, escapeXML(brandText));
    if (categoryText) svgContent = svgContent.replace(/\{\{CATEGORY_TEXT\}\}/g, escapeXML(categoryText));
    if (mainTitle) svgContent = svgContent.replace(/\{\{MAIN_TITLE\}\}/g, escapeXML(mainTitle));
    if (sku) svgContent = svgContent.replace(/\{\{PRODUCT_SKU\}\}/g, escapeXML(sku));
    
    // Image section
    if (imageTitle) svgContent = svgContent.replace(/\{\{IMAGE_TITLE\}\}/g, escapeXML(imageTitle));
    if (secondaryDescription) svgContent = svgContent.replace(/\{\{SECONDARY_DESCRIPTION\}\}/g, escapeXML(secondaryDescription));
    
    // Process product image with better error handling
    const productImage = image || imageUrl;
    const hasLargeImage = (req.query.hasLargeImage === 'true') || (queryData.hasLargeImage === 'true');
    
    // Debug logging for image processing
    console.log('=== IMAGE DEBUG INFO ===');
    console.log('image param:', image ? `${image.substring(0, 50)}... (length: ${image.length})` : 'null');
    console.log('imageUrl param:', imageUrl ? `${imageUrl.substring(0, 50)}... (length: ${imageUrl.length})` : 'null');
    console.log('hasLargeImage:', hasLargeImage);
    console.log('productImage chosen:', productImage ? `${productImage.substring(0, 50)}... (length: ${productImage.length})` : 'null');
    console.log('========================');
    
    if (productImage) {
      try {
        // Decode the image URL if it was encoded
        const decodedImage = decodeURIComponent(productImage);
        
        // Basic validation for base64 images
        if (decodedImage.startsWith('data:image/')) {
          // Allow reasonable base64 image sizes (increased limit to 500KB)
          if (decodedImage.length > 500000) {
            console.warn('Image data too large (>500KB), using fallback');
            svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, '');
            svgContent = svgContent.replace(/\{\{IMAGE_FALLBACK_OPACITY\}\}/g, '1');
          } else {
            console.log(`Using image data (${decodedImage.length} chars)`);
            svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, decodedImage);
            svgContent = svgContent.replace(/\{\{IMAGE_FALLBACK_OPACITY\}\}/g, '0');
          }
        } else if (decodedImage.startsWith('http')) {
          // Regular URL
          svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, decodedImage);
          svgContent = svgContent.replace(/\{\{IMAGE_FALLBACK_OPACITY\}\}/g, '0');
        } else {
          // Invalid image format, use fallback
          svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, '');
          svgContent = svgContent.replace(/\{\{IMAGE_FALLBACK_OPACITY\}\}/g, '1');
        }
      } catch (error) {
        console.error('Error processing image:', error.message);
        // Use fallback on any error
        svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, '');
        svgContent = svgContent.replace(/\{\{IMAGE_FALLBACK_OPACITY\}\}/g, '1');
      }
    } else {
      // If no image or large image detected, show fallback
      svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, '');
      svgContent = svgContent.replace(/\{\{IMAGE_FALLBACK_OPACITY\}\}/g, '1');
      
      if (hasLargeImage) {
        // Add a notice for large images
        console.log('Large image detected or no image provided, using fallback display');
      } else {
        console.log('No image provided, using fallback display');
      }
    }
    
    // Dynamic fields
    Object.keys(dynamicFields.powerDetails).forEach(num => {
      const placeholder = `\\{\\{POWER_DETAIL_${num}\\}\\}`;
      const value = dynamicFields.powerDetails[num];
      if (value) svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
    });
    
    Object.keys(dynamicFields.panelDetails).forEach(num => {
      const placeholder = `\\{\\{PANEL_DETAIL_${num}\\}\\}`;
      const value = dynamicFields.panelDetails[num];
      if (value) svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
    });
    
    Object.keys(dynamicFields.mountDetails).forEach(num => {
      const placeholder = `\\{\\{MOUNT_DETAIL_${num}\\}\\}`;
      const value = dynamicFields.mountDetails[num];
      if (value) svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
    });
    
    Object.keys(dynamicFields.elecDetails).forEach(num => {
      const placeholder = `\\{\\{ELEC_DETAIL_${num}\\}\\}`;
      const value = dynamicFields.elecDetails[num];
      if (value) svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
    });
    
    Object.keys(dynamicFields.cableDetails).forEach(num => {
      const placeholder = `\\{\\{CABLE_DETAIL_${num}\\}\\}`;
      const value = dynamicFields.cableDetails[num];
      if (value) svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
    });
    
    Object.keys(dynamicFields.additionalParts).forEach(num => {
      const placeholder = `\\{\\{ADDITIONAL_PART_${num}\\}\\}`;
      const value = dynamicFields.additionalParts[num];
      if (value) svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
    });
    
    // Price and contact
    if (priceHeader) svgContent = svgContent.replace(/\{\{PRICE_HEADER\}\}/g, escapeXML(priceHeader));
    if (priceAmount) svgContent = svgContent.replace(/\{\{PRICE_AMOUNT\}\}/g, escapeXML(priceAmount));
    if (priceNote) svgContent = svgContent.replace(/\{\{PRICE_NOTE\}\}/g, escapeXML(priceNote));
    
    if (delivery1) svgContent = svgContent.replace(/\{\{DELIVERY_1\}\}/g, escapeXML(delivery1));
    if (delivery2) svgContent = svgContent.replace(/\{\{DELIVERY_2\}\}/g, escapeXML(delivery2));
    if (delivery3) svgContent = svgContent.replace(/\{\{DELIVERY_3\}\}/g, escapeXML(delivery3));
    
    if (contactPhone1) svgContent = svgContent.replace(/\{\{CONTACT_PHONE_1\}\}/g, escapeXML(contactPhone1));
    if (contactPhone2) svgContent = svgContent.replace(/\{\{CONTACT_PHONE_2\}\}/g, escapeXML(contactPhone2));
    if (contactEmail) svgContent = svgContent.replace(/\{\{CONTACT_EMAIL\}\}/g, escapeXML(contactEmail));
    if (contactWebsite) svgContent = svgContent.replace(/\{\{CONTACT_WEBSITE\}\}/g, escapeXML(contactWebsite));
    
    // Benefits fields
    if (benefit1) svgContent = svgContent.replace(/\{\{BENEFIT_1\}\}/g, escapeXML(benefit1));
    if (benefit2) svgContent = svgContent.replace(/\{\{BENEFIT_2\}\}/g, escapeXML(benefit2));
    if (benefit3) svgContent = svgContent.replace(/\{\{BENEFIT_3\}\}/g, escapeXML(benefit3));
    if (benefit4) svgContent = svgContent.replace(/\{\{BENEFIT_4\}\}/g, escapeXML(benefit4));
    if (benefit5) svgContent = svgContent.replace(/\{\{BENEFIT_5\}\}/g, escapeXML(benefit5));
    
    // Description fields
    if (descriptionTitle) svgContent = svgContent.replace(/\{\{DESCRIPTION_TITLE\}\}/g, escapeXML(descriptionTitle));
    if (descriptionLine1) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_1\}\}/g, escapeXML(descriptionLine1));
    if (descriptionLine2) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_2\}\}/g, escapeXML(descriptionLine2));
    if (descriptionLine3) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_3\}\}/g, escapeXML(descriptionLine3));
    if (descriptionLine4) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_4\}\}/g, escapeXML(descriptionLine4));
    if (descriptionLine5) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_5\}\}/g, escapeXML(descriptionLine5));
    if (descriptionLine6) svgContent = svgContent.replace(/\{\{DESCRIPTION_LINE_6\}\}/g, escapeXML(descriptionLine6));
  }
  
  // Process solar-bulk-deal template
  if (templateId === 'solar-bulk-deal') {
    // Get solar-bulk-deal specific parameters
    const {
      companyName, promotionTitle, productSku, productTitle, productPrice,
      bulletPoint1, bulletPoint2, bulletPoint3, bulletPoint4,
      phoneNumber, phoneNumber2, email, website,
      brandText, // Add brandText as fallback for companyName
      sku // Add sku as fallback for productSku
    } = queryData;
    
    // Header fields - use brandText as fallback for companyName
    const actualCompanyName = companyName || brandText;
    if (actualCompanyName) svgContent = svgContent.replace(/\{\{COMPANY_NAME\}\}/g, escapeXML(actualCompanyName));
    if (categoryText) svgContent = svgContent.replace(/\{\{CATEGORY_TEXT\}\}/g, escapeXML(categoryText));
    
    // Title fields - use sku as fallback for productSku
    if (promotionTitle) svgContent = svgContent.replace(/\{\{PROMOTION_TITLE\}\}/g, escapeXML(promotionTitle));
    const actualProductSku = productSku || sku;
    if (actualProductSku) svgContent = svgContent.replace(/\{\{PRODUCT_SKU\}\}/g, escapeXML(actualProductSku));
    if (productTitle) svgContent = svgContent.replace(/\{\{PRODUCT_TITLE\}\}/g, escapeXML(productTitle));
    
    // Image section
    if (imageTitle) svgContent = svgContent.replace(/\{\{IMAGE_TITLE\}\}/g, escapeXML(imageTitle));
    
    // Process product image with the same logic as solar-kit-social
    const productImage = image || imageUrl;
    if (productImage) {
      try {
        const decodedImage = decodeURIComponent(productImage);
        if (decodedImage.startsWith('data:image/')) {
          if (decodedImage.length > 500000) {
            svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, '');
          } else {
            svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, decodedImage);
          }
        } else if (decodedImage.startsWith('http')) {
          svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, decodedImage);
        } else {
          svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, '');
        }
      } catch (error) {
        svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, '');
      }
    } else {
      svgContent = svgContent.replace(/\{\{PRODUCT_IMAGE\}\}/g, '');
    }
    
    // Bullet points
    if (bulletPoint1) svgContent = svgContent.replace(/\{\{BULLET_POINT_1\}\}/g, escapeXML(bulletPoint1));
    if (bulletPoint2) svgContent = svgContent.replace(/\{\{BULLET_POINT_2\}\}/g, escapeXML(bulletPoint2));
    if (bulletPoint3) svgContent = svgContent.replace(/\{\{BULLET_POINT_3\}\}/g, escapeXML(bulletPoint3));
    if (bulletPoint4) svgContent = svgContent.replace(/\{\{BULLET_POINT_4\}\}/g, escapeXML(bulletPoint4));
    
    // Price
    if (productPrice) svgContent = svgContent.replace(/\{\{PRODUCT_PRICE\}\}/g, escapeXML(productPrice));
    
    // Contact information
    if (phoneNumber) svgContent = svgContent.replace(/\{\{PHONE_NUMBER\}\}/g, escapeXML(phoneNumber));
    if (phoneNumber2) svgContent = svgContent.replace(/\{\{PHONE_NUMBER_2\}\}/g, escapeXML(phoneNumber2));
    if (email) svgContent = svgContent.replace(/\{\{EMAIL\}\}/g, escapeXML(email));
    if (website) svgContent = svgContent.replace(/\{\{WEBSITE\}\}/g, escapeXML(website));
    
    // Delivery information (shared with solar-kit-social)
    if (delivery1) svgContent = svgContent.replace(/\{\{DELIVERY_1\}\}/g, escapeXML(delivery1));
    if (delivery2) svgContent = svgContent.replace(/\{\{DELIVERY_2\}\}/g, escapeXML(delivery2));
    if (delivery3) svgContent = svgContent.replace(/\{\{DELIVERY_3\}\}/g, escapeXML(delivery3));
  }
  
  // Clean up unused placeholders
  svgContent = svgContent.replace(/\{\{[^}]+\}\}/g, '');
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache');
  return res.status(200).send(svgContent);
}

// Handle template export
async function handleExport(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
  
  const { templateId, productData, companyData } = req.body;
  
  if (!templateId) {
    return res.status(400).json({ error: 'Missing templateId parameter' });
  }
  
  // Use the same logic as render but return as download
  const params = new URLSearchParams();
  params.append('action', 'render');
  params.append('templateId', templateId);
  
  // Add all product data as query params
  if (productData) {
    Object.keys(productData).forEach(key => {
      if (productData[key]) {
        params.append(key, productData[key]);
      }
    });
  }
  
  // Render the template
  req.query = Object.fromEntries(params.entries());
  const mockRes = {
    headers: {},
    statusCode: 200,
    setHeader: function(key, value) { this.headers[key] = value; },
    status: function(code) { this.statusCode = code; return this; },
    send: function(content) { this.content = content; return this; }
  };
  
  await handleRender(req, mockRes);
  
  if (mockRes.statusCode !== 200) {
    return res.status(mockRes.statusCode).json({ error: 'Render failed' });
  }
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Disposition', `attachment; filename="${templateId}-export.svg"`);
  return res.status(200).send(mockRes.content);
}

// Handle debug information
async function handleDebug(req, res) {
  const path = require('path');
  const fs = require('fs');
  
  const templatesDir = path.join(process.cwd(), 'client/public/templates');
  const directoryExists = fs.existsSync(templatesDir);
  const filesList = directoryExists ? fs.readdirSync(templatesDir) : [];
  
  const debugSvg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="400" fill="#1e3a8a"/>
    <text x="300" y="50" fill="white" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle">🔧 CONSOLIDATED API DEBUG</text>
    
    <text x="50" y="100" fill="#fbbf24" font-family="Arial" font-size="16">Status: All systems operational</text>
    <text x="50" y="130" fill="white" font-family="Arial" font-size="14">API Functions: Consolidated (Under 12 limit)</text>
    <text x="50" y="160" fill="white" font-family="Arial" font-size="14">Templates Dir: ${directoryExists ? '✓ Found' : '✗ Missing'}</text>
    <text x="50" y="190" fill="white" font-family="Arial" font-size="14">Template Files: ${filesList.length} found</text>
    
    <text x="50" y="230" fill="#f59e0b" font-family="Arial" font-size="14">Available Actions:</text>
    <text x="50" y="250" fill="white" font-family="Arial" font-size="12">• ?action=templates - List templates</text>
    <text x="50" y="270" fill="white" font-family="Arial" font-size="12">• ?action=render&templateId=X - Render template</text>
    <text x="50" y="290" fill="white" font-family="Arial" font-size="12">• ?action=export (POST) - Export template</text>
    <text x="50" y="310" fill="white" font-family="Arial" font-size="12">• ?action=debug - This page</text>
    
    <text x="50" y="350" fill="#f59e0b" font-family="Arial" font-size="14">Deployment: Ready for Vercel ✓</text>
    <text x="50" y="370" fill="white" font-family="Arial" font-size="12">Time: ${new Date().toISOString()}</text>
  </svg>`;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  return res.status(200).send(debugSvg);
}

// Handle color extraction (mock)
async function handleColors(req, res) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    success: true,
    data: {
      dominant: 'rgb(45,56,128)',
      palette: [
        'rgb(45,56,128)', 
        'rgb(67,89,156)', 
        'rgb(120,145,190)', 
        'rgb(200,210,230)', 
        'rgb(245,245,250)'
      ]
    }
  });
}
