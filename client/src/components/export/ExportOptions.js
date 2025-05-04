import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { generateImage } from '../../services/templateService';

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
      
      const blob = await generateImage(
        template.id,
        productData,
        companyData,
        format
      );
      
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
