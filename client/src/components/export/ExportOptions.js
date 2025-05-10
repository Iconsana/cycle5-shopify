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
      
      // First, prepare the image if it exists
      let processedImage = null;
      if (productData?.image) {
        try {
          // If it's a blob URL or remote URL, fetch and convert to base64
          const imageResponse = await fetch(productData.image);
          const blob = await imageResponse.blob();
          
          // Convert blob to base64
          const reader = new FileReader();
          processedImage = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.error('Error processing image:', err);
          // Continue without the image if there's an error
        }
      }
      
      // Use the processed image or the original
      const dataToSend = {
        templateId: template.id,
        format,
        productData: {
          ...productData,
          image: processedImage || productData?.image
        },
        companyData
      };
      
      // Use the export endpoint
      const response = await fetch('/api/export-template', {
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
      const filename = `${template.id}-${productData.title || 'untitled'}.${format}`;
      
      // Save the file
      saveAs(blob, filename);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export. Please try again.');
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
          onClick={() => handleExport('png')}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Export as PNG'}
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={() => handleExport('svg')}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Export as SVG'}
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ExportOptions;
