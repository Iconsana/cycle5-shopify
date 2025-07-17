// client/src/components/export/ExportOptions.js  
import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const ExportOptions = ({ template, productData, companyData }) => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleExport = async (format) => {
    if (!template) {
      setError('Please select a template first');
      return;
    }
    
    try {
      setExporting(true);
      setError(null);
      
      console.log('Exporting with data:', {
        templateId: template.id,
        productDataKeys: productData ? Object.keys(productData) : [],
        companyDataKeys: companyData ? Object.keys(companyData) : []
      });
      
      // First, prepare the image if it exists
      let processedImage = null;
      if (productData?.image) {
        try {
          // If it's a blob URL or remote URL, fetch and convert to base64
          if (productData.image.startsWith('blob:') || productData.image.startsWith('http')) {
            const imageResponse = await fetch(productData.image);
            const blob = await imageResponse.blob();
            
            // Convert blob to base64
            const reader = new FileReader();
            processedImage = await new Promise((resolve) => {
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
          } else {
            // It's already a data URL
            processedImage = productData.image;
          }
        } catch (err) {
          console.error('Error processing image:', err);
          // Continue without the image if there's an error
        }
      }
      
      // Filter out empty/null values from productData to respect hidden fields
      const filteredProductData = {};
      if (productData) {
        Object.keys(productData).forEach(key => {
          const value = productData[key];
          if (value && value.toString().trim() !== '') {
            filteredProductData[key] = value;
          }
        });
      }
      
      // Override with processed image if available
      if (processedImage) {
        filteredProductData.image = processedImage;
      }
      
      console.log('Filtered product data (hidden fields removed):', {
        originalKeys: productData ? Object.keys(productData) : [],
        filteredKeys: Object.keys(filteredProductData),
        removedKeys: productData ? Object.keys(productData).filter(k => !filteredProductData[k]) : []
      });
      
      // Use the consolidated export endpoint
      const dataToSend = {
        templateId: template.id,
        format,
        productData: filteredProductData,
        companyData
      };
      
      const response = await fetch('/api/main?action=export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }
      
      // Get the file as blob
      const blob = await response.blob();
      
      // Create a filename
      const productTitle = filteredProductData.title || filteredProductData.mainTitle || 'untitled';
      const filename = `${template.id}-${productTitle.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
      
      // Save the file
      saveAs(blob, filename);
      
      console.log('Export successful:', filename);
    } catch (err) {
      console.error('Export error:', err);
      setError(`Failed to export: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <div className="export-options">
      <h3>Export Options</h3>
      
      <div className="export-buttons">
        <button 
          className="btn btn-primary"
          onClick={() => handleExport('svg')}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Export as SVG'}
        </button>
      </div>
      
      {error && (
        <div className="error" style={{ 
          color: '#dc3545', 
          marginTop: '10px', 
          padding: '8px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}
      
      {/* Export info */}
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '4px', 
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Export Info:</strong><br/>
        • Hidden fields will be completely removed from export<br/>
        • SVG format preserves vector graphics and text<br/>
        • Perfect for printing and high-quality displays
      </div>
    </div>
  );
};

export default ExportOptions;
