// api/debug.js - Debug endpoint to test the system
module.exports = async (req, res) => {
  try {
    console.log('=== DEBUG API CALLED ===');
    
    const path = require('path');
    const fs = require('fs');
    
    // Check if we can access the file system
    const templatesDir = path.join(process.cwd(), 'client/public/templates');
    console.log('Templates directory:', templatesDir);
    
    let directoryExists = false;
    let filesList = [];
    
    try {
      directoryExists = fs.existsSync(templatesDir);
      if (directoryExists) {
        filesList = fs.readdirSync(templatesDir);
      }
    } catch (err) {
      console.log('Directory access error:', err.message);
    }
    
    // Try to read the solar template
    const solarTemplatePath = path.join(templatesDir, 'solar-kit-social.svg');
    let templateExists = false;
    let templateSize = 0;
    let templateFirstLine = '';
    
    try {
      templateExists = fs.existsSync(solarTemplatePath);
      if (templateExists) {
        const stats = fs.statSync(solarTemplatePath);
        templateSize = stats.size;
        const content = fs.readFileSync(solarTemplatePath, 'utf8');
        templateFirstLine = content.split('\n')[0];
      }
    } catch (err) {
      console.log('Template read error:', err.message);
    }
    
    // Generate a simple test SVG
    const testSvg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#1e3a8a"/>
      <text x="300" y="50" fill="white" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle">🔧 SYSTEM DIAGNOSTIC</text>
      
      <text x="50" y="100" fill="#fbbf24" font-family="Arial" font-size="16">Environment: ${process.env.NODE_ENV || 'development'}</text>
      <text x="50" y="130" fill="white" font-family="Arial" font-size="14">Working Directory: ${process.cwd()}</text>
      <text x="50" y="160" fill="white" font-family="Arial" font-size="14">Templates Dir Exists: ${directoryExists ? '✓ Yes' : '✗ No'}</text>
      <text x="50" y="190" fill="white" font-family="Arial" font-size="14">Files Found: ${filesList.length} (${filesList.join(', ')})</text>
      
      <text x="50" y="230" fill="#fbbf24" font-family="Arial" font-size="16">Solar Template Status:</text>
      <text x="50" y="260" fill="white" font-family="Arial" font-size="14">Exists: ${templateExists ? '✓ Yes' : '✗ No'}</text>
      <text x="50" y="290" fill="white" font-family="Arial" font-size="14">Size: ${templateSize} bytes</text>
      <text x="50" y="320" fill="white" font-family="Arial" font-size="12">First Line: ${templateFirstLine.substring(0, 50)}...</text>
      
      <text x="50" y="360" fill="#f59e0b" font-family="Arial" font-size="14">Time: ${new Date().toISOString()}</text>
    </svg>`;
    
    console.log('Debug info:', {
      directoryExists,
      filesCount: filesList.length,
      templateExists,
      templateSize
    });
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send(testSvg);
    
  } catch (error) {
    console.error('Debug API error:', error);
    
    const errorSvg = `<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="300" fill="#dc3545"/>
      <text x="250" y="50" fill="white" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle">DEBUG ERROR</text>
      <text x="250" y="100" fill="white" font-family="Arial" font-size="14" text-anchor="middle">${error.message}</text>
      <text x="250" y="130" fill="white" font-family="Arial" font-size="12" text-anchor="middle">${error.stack ? error.stack.split('\n')[0] : 'No stack trace'}</text>
      <text x="250" y="200" fill="white" font-family="Arial" font-size="12" text-anchor="middle">Time: ${new Date().toISOString()}</text>
    </svg>`;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(errorSvg);
  }
};
