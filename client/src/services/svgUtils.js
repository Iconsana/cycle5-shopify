/**
 * Process an SVG template by replacing placeholders with actual data
 * @param {string} svgContent - Raw SVG template content
 * @param {object} productData - Product data to insert
 * @param {object} companyData - Company data to insert
 * @returns {string} Processed SVG content
 */
export const processTemplate = (svgContent, productData, companyData) => {
  let processed = svgContent;
  
  // Replace product data placeholders
  if (productData) {
    if (productData.title) {
      processed = processed.replace(/{{PRODUCT_TITLE}}/g, productData.title);
    }
    
    if (productData.price) {
      processed = processed.replace(/{{PRODUCT_PRICE}}/g, productData.price);
    }
    
    if (productData.sku) {
      processed = processed.replace(/{{PRODUCT_SKU}}/g, productData.sku);
    }
    
    if (productData.description) {
      processed = processed.replace(/{{PRODUCT_DESCRIPTION}}/g, productData.description);
    }
    
    if (productData.image) {
      processed = processed.replace(/{{PRODUCT_IMAGE}}/g, productData.image);
    }
  }
  
  // Replace company data placeholders
  if (companyData) {
    if (companyData.name) {
      processed = processed.replace(/{{COMPANY_NAME}}/g, companyData.name);
    }
    
    if (companyData.logo) {
      processed = processed.replace(/{{COMPANY_LOGO}}/g, companyData.logo);
    }
    
    if (companyData.phone) {
      processed = processed.replace(/{{PHONE_NUMBER}}/g, companyData.phone);
    }
    
    if (companyData.email) {
      processed = processed.replace(/{{EMAIL}}/g, companyData.email);
    }
    
    if (companyData.website) {
      processed = processed.replace(/{{WEBSITE}}/g, companyData.website);
    }
  }
  
  // Replace any remaining placeholders with empty strings
  processed = processed.replace(/{{[^}]+}}/g, '');
  
  return processed;
};

/**
 * Convert an SVG string to a data URL
 * @param {string} svgString - SVG content as string
 * @returns {string} Data URL representation of the SVG
 */
export const svgToDataUrl = (svgString) => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
};

/**
 * Convert an SVG element to a PNG data URL
 * @param {SVGElement} svgElement - DOM SVG element
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {Promise<string>} Promise resolving to PNG data URL
 */
export const svgToPngDataUrl = (svgElement, width, height) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = width || svgElement.width.baseVal.value;
    canvas.height = height || svgElement.height.baseVal.value;
    
    // Create SVG data URL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
    
    // Create image from SVG
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = svgUrl;
  });
};
