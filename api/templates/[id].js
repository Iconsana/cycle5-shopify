// Vercel serverless function for retrieving a specific template using CommonJS syntax

// Hardcoded templates with their SVG content (same as in templates.js)
const templates = [
  {
    id: 'battery-style',
    name: 'Battery Style',
    file: 'battery-style.svg',
    content: `<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
      <!-- This is simplified template content - replace with full SVG content -->
      <rect width="1200" height="1200" fill="#001428"/>
      <rect width="1200" height="1200" fill="url(#glowCenter)"/>
      <polygon points="0,350 1200,500 1200,1200 0,1200" fill="white" opacity="0.97"/>
      <text x="150" y="150" font-family="Arial" font-size="70" fill="white">{{COMPANY_NAME}}</text>
      <text x="150" y="500" font-family="Arial" font-size="40" fill="#002651">{{PRODUCT_TITLE}}</text>
      <text x="150" y="600" font-family="Arial" font-size="30" fill="#002651">{{PRODUCT_DESCRIPTION}}</text>
      <text x="150" y="700" font-family="Arial" font-size="25" fill="#002651">SKU: {{PRODUCT_SKU}}</text>
      <text x="200" y="950" font-family="Arial" font-size="40" fill="#002651">{{PRODUCT_PRICE}}</text>
    </svg>`
  },
  {
    id: 'circuit-promo',
    name: 'Circuit Promo',
    file: 'circuit-promo.svg',
    content: `<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
      <!-- This is simplified template content - replace with full SVG content -->
      <rect width="1200" height="1200" fill="#001428"/>
      <path d="M600,0 C800,50 900,200 900,400 C900,600 800,800 900,1000 C1000,1200 1200,1200 1200,1200 L1200,0 Z" fill="white"/>
      <text x="150" y="150" font-family="Arial" font-size="70" fill="white">{{COMPANY_NAME}}</text>
      <text x="900" y="300" font-family="Arial" font-size="40" fill="#002651">{{PRODUCT_TITLE}}</text>
      <text x="900" y="400" font-family="Arial" font-size="30" fill="#002651">{{PRODUCT_DESCRIPTION}}</text>
      <text x="300" y="500" font-family="Arial" font-size="25" fill="white">SKU: {{PRODUCT_SKU}}</text>
      <text x="900" y="700" font-family="Arial" font-size="40" fill="#FFB900">{{PRODUCT_PRICE}}</text>
    </svg>`
  },
  {
    id: 'gradient-seasonal',
    name: 'Gradient Seasonal',
    file: 'gradient-seasonal.svg',
    content: `<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
      <!-- This is simplified template content - replace with full SVG content -->
      <rect width="1200" height="1200" fill="#001428"/>
      <path d="M0,400 C200,350 400,450 600,400 C800,350 1000,450 1200,400 L1200,1200 L0,1200 Z" fill="#001428" opacity="0.6"/>
      <text x="150" y="150" font-family="Arial" font-size="70" fill="white">{{COMPANY_NAME}}</text>
      <text x="600" y="350" font-family="Arial" font-size="40" fill="white" text-anchor="middle">{{PRODUCT_TITLE}}</text>
      <text x="600" y="450" font-family="Arial" font-size="30" fill="#FFB900" text-anchor="middle">{{PRODUCT_DESCRIPTION}}</text>
      <text x="600" y="700" font-family="Arial" font-size="25" fill="#FFB900" text-anchor="middle">SKU: {{PRODUCT_SKU}}</text>
      <text x="600" y="800" font-family="Arial" font-size="40" fill="white" text-anchor="middle">{{PRODUCT_PRICE}}</text>
    </svg>`
  },
  {
    id: 'tech-enhanced',
    name: 'Tech Enhanced',
    file: 'tech-enhanced.svg',
    content: `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <!-- This is simplified template content - replace with full SVG content -->
      <rect width="1000" height="1000" fill="#001428"/>
      <polygon points="0,250 1000,400 1000,1000 0,1000" fill="#002651" opacity="0.6"/>
      <text x="150" y="150" font-family="Arial" font-size="70" fill="white">{{COMPANY_NAME}}</text>
      <text x="500" y="330" font-family="Arial" font-size="40" fill="#FFB900" text-anchor="middle">{{PRODUCT_TITLE}}</text>
      <text x="500" y="500" font-family="Arial" font-size="30" fill="white" text-anchor="middle">{{PRODUCT_DESCRIPTION}}</text>
      <text x="500" y="600" font-family="Arial" font-size="25" fill="white" text-anchor="middle">SKU: {{PRODUCT_SKU}}</text>
      <text x="500" y="730" font-family="Arial" font-size="40" fill="#FFB900" text-anchor="middle">{{PRODUCT_PRICE}}</text>
    </svg>`
  }
];

// Handler function using CommonJS syntax
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Add content type header for clarity
  res.setHeader('Content-Type', 'application/json');
  
  // Log the incoming request for debugging
  console.log('Template request for ID:', req.query.id);
  
  // Get the template ID from the URL
  const { id } = req.query;
  
  // Find the requested template
  const template = templates.find(t => t.id === id);
  
  // If template not found, return 404
  if (!template) {
    console.log('Template not found:', id);
    return res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }
  
  // Log success
  console.log('Returning template:', template.id);
  
  // Return the template data
  return res.status(200).json({
    success: true,
    data: template
  });
};
