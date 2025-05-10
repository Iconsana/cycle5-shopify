// pages/api/svg-template.js (Next.js Pages Router)
export default function handler(req, res) {
  const { title, description, price } = req.query;
  
  // Generate SVG content
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <rect width="1200" height="630" fill="#ffffff" />
      <text x="100" y="100" font-size="48" font-weight="bold">${escapeHTML(title || 'Product Title')}</text>
      <text x="100" y="200" font-size="32">${escapeHTML(description || 'Product description')}</text>
      <text x="100" y="300" font-size="40" fill="#e44d26">${escapeHTML(price || '$0.00')}</text>
    </svg>
  `;
  
  // Critical: Set correct content-type header
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.status(200).send(svgContent);
}

// Helper function to prevent XSS
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
