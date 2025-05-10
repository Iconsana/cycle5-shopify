// api/generate/[templateId].js
module.exports = async function handler(req, res) {
  const { templateId } = req.query;
  const { title, description, price, format } = req.body;
  
  try {
    // Get SVG content
    const path = require('path');
    const fs = require('fs');
    const templatesDir = path.join(process.cwd(), 'client/public/templates');
    const filePath = path.join(templatesDir, `${templateId}.svg`);
    let svgContent = fs.readFileSync(filePath, 'utf8');
    
    // Replace placeholders
    svgContent = svgContent
      .replace(/{{PRODUCT_TITLE}}/g, title || '')
      .replace(/{{PRODUCT_PRICE}}/g, price || '')
      .replace(/{{PRODUCT_DESCRIPTION}}/g, description || '')
      // Add more placeholder replacements as needed
    
    // If format is PNG, convert
    if (format === 'png') {
      // You can use sharp or another library for conversion
      // For example with satori and resvg-js (need to install these)
      const sharp = require('sharp');
      const pngBuffer = await sharp(Buffer.from(svgContent))
        .toFormat('png')
        .toBuffer();
      
      res.setHeader('Content-Type', 'image/png');
      return res.status(200).send(pngBuffer);
    }
    
    // Otherwise return SVG
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svgContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating image' });
  }
};
