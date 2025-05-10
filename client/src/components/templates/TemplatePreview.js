// client/src/components/templates/TemplatePreview.js
import React, { useEffect, useState } from 'react';

const TemplatePreview = ({ template, productData, companyData }) => {
  const [processedSvg, setProcessedSvg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Reset states when template changes
    if (!template) {
      setProcessedSvg('');
      setError(null);
      return;
    }
    
    const fetchTemplate = async () => {
      try {
        setLoading(true); // Actually use setLoading here
        setError(null);
        
        // If we already have content, use it directly
        if (template.content) {
          processAndSetSvg(template.content);
          return;
        }
        
        // Create image URL for preview instead of fetching JSON
        const imgUrl = `/api/templates/${template.id}`;
        setProcessedSvg(`<img src="${imgUrl}" alt="Template Preview" style="max-width: 100%;" />`);
      } catch (err) {
        console.error('Error fetching template:', err);
        setError(err.message);
      } finally {
        setLoading(false); // And here as well
      }
    };
    
    // Helper function to process SVG content
    const processAndSetSvg = (svgContent) => {
      let processed = svgContent;
      
      // Process placeholders as before...
      
      setProcessedSvg(processed);
      setLoading(false);
    };
    
    fetchTemplate();
  }, [template, productData, companyData]);
  
  // Rest of component as before...
}
