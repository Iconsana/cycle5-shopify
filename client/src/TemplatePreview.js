import React, { useEffect, useState } from 'react';
import { processTemplate } from '../utils/svgUtils';

const TemplatePreview = ({ template, productData, companyData }) => {
  const [processedSvg, setProcessedSvg] = useState('');
  
  useEffect(() => {
    if (template && template.content) {
      const processed = processTemplate(template.content, productData, companyData);
      setProcessedSvg(processed);
    }
  }, [template, productData, companyData]);
  
  if (!template) {
    return <div className="no-template">Please select a template</div>;
  }
  
  return (
    <div className="template-preview-container">
      <div 
        className="template-preview-content"
        dangerouslySetInnerHTML={{ __html: processedSvg }}
      />
    </div>
  );
};

export default TemplatePreview;
