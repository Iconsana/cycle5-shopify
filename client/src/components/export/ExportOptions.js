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
      
      // Use the new export endpoint
      const response = await fetch('/api/export-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          format,
          productData,
          companyData
        }),
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
