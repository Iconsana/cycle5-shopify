const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

// Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '../../client/public/templates');
    const files = await fs.readdir(templatesDir);
    
    const templates = await Promise.all(
      files
        .filter(file => file.endsWith('.svg'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(templatesDir, file), 'utf8');
          return {
            id: file.replace('.svg', ''),
            name: file.replace('.svg', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            file,
            content
          };
        })
    );
    
    res.json({ success: true, data: templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ success: false, error: 'Error fetching templates' });
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const templatesDir = path.join(__dirname, '../../client/public/templates');
    const filePath = path.join(templatesDir, `${id}.svg`);
    
    const content = await fs.readFile(filePath, 'utf8');
    
    res.json({
      success: true,
      data: {
        id,
        name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        file: `${id}.svg`,
        content
      }
    });
  } catch (error) {
    console.error(`Error fetching template ${req.params.id}:`, error);
    res.status(404).json({ success: false, error: 'Template not found' });
  }
};

// Generate image from template
exports.generateImage = async (req, res) => {
  try {
    const { templateId, productData, companyData, format } = req.body;
    
    // Get the template
    const templatesDir = path.join(__dirname, '../../client/public/templates');
    const filePath = path.join(templatesDir, `${templateId}.svg`);
    
    let svgContent = await fs.readFile(filePath, 'utf8');
    
    // Replace placeholders
    if (productData) {
      if (productData.title) {
        svgContent = svgContent.replace(/{{PRODUCT_TITLE}}/g, productData.title);
      }
      if (productData.price) {
        svgContent = svgContent.replace(/{{PRODUCT_PRICE}}/g, productData.price);
      }
      if (productData.sku) {
        svgContent = svgContent.replace(/{{PRODUCT_SKU}}/g, productData.sku);
      }
      if (productData.description) {
        svgContent = svgContent.replace(/{{PRODUCT_DESCRIPTION}}/g, productData.description);
      }
    }
    
    if (companyData) {
      if (companyData.phone) {
        svgContent = svgContent.replace(/{{PHONE_NUMBER}}/g, companyData.phone);
      }
      if (companyData.email) {
        svgContent = svgContent.replace(/{{EMAIL}}/g, companyData.email);
      }
      if (companyData.website) {
        svgContent = svgContent.replace(/{{WEBSITE}}/g, companyData.website);
      }
    }
    
    // Handle product image if provided
    if (req.file) {
      // Process image (remove background, resize, etc.)
      // This is a simplified version - you might want to use more sophisticated
      // image processing in a production app
      const processedImage = await sharp(req.file.buffer)
        .resize(500) // Resize to a reasonable size
        .toBuffer();
      
      // Convert to base64 for embedding in SVG
      const base64Image = `data:image/png;base64,${processedImage.toString('base64')}`;
      
      // Replace image placeholder
      svgContent = svgContent.replace(/{{PRODUCT_IMAGE}}/g, base64Image);
    }
    
    // Return SVG or convert to PNG if requested
    if (format === 'png') {
      const pngBuffer = await sharp(Buffer.from(svgContent))
        .toFormat('png')
        .toBuffer();
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename="template.png"');
      return res.send(pngBuffer);
    }
    
    // Return SVG
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', 'attachment; filename="template.svg"');
    res.send(svgContent);
    
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ success: false, error: 'Error generating image' });
  }
};
