const sharp = require('sharp');

// Get product by ID (stub for future Shopify integration)
exports.getProductById = async (req, res) => {
  try {
    // This is a stub - in a real app, you would fetch from Shopify API
    const mockProduct = {
      id: req.params.id,
      title: 'Sample Product',
      description: 'This is a sample product description. It would be fetched from Shopify in a real implementation.',
      price: 'R1,299.99',
      sku: 'SAMPLE-001',
      images: []
    };
    
    res.json({ success: true, data: mockProduct });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(404).json({ success: false, error: 'Product not found' });
  }
};

// Extract colors from an image
exports.extractColors = async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }
    
    // Extract base64 image data
    const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Process image to extract dominant colors
    const { dominant, palette } = await extractDominantColors(buffer);
    
    res.json({
      success: true,
      data: {
        dominant,
        palette
      }
    });
  } catch (error) {
    console.error('Error extracting colors:', error);
    res.status(500).json({ success: false, error: 'Error extracting colors' });
  }
};

// Helper function to extract dominant colors
async function extractDominantColors(imageBuffer) {
  // This is a simplified version of color extraction
  // In a production app, you might want to use a more sophisticated algorithm
  
  // Resize image for faster processing
  const resizedImageBuffer = await sharp(imageBuffer)
    .resize(100)
    .toBuffer();
  
  // Get image data
  const { data, info } = await sharp(resizedImageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  // Simple color counting
  const colorMap = {};
  
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Skip transparent pixels if alpha channel exists
    if (info.channels === 4 && data[i + 3] < 128) {
      continue;
    }
    
    const rgb = `rgb(${r},${g},${b})`;
    colorMap[rgb] = (colorMap[rgb] || 0) + 1;
  }
  
  // Convert to array and sort by frequency
  const sortedColors = Object.entries(colorMap)
    .map(([color, count]) => ({ color, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    dominant: sortedColors[0]?.color || 'rgb(0,0,0)',
    palette: sortedColors.slice(0, 5).map(item => item.color)
  };
}
