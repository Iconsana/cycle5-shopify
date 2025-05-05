import React, { useEffect, useState } from 'react';

// Try to import from utils directory first
let processTemplate;
try {
  // This should work if we successfully created the utils directory
  const svgUtils = require('../../utils/svgUtils');
  processTemplate = svgUtils.processTemplate;
  console.log("Successfully imported from utils/svgUtils");
} catch (error) {
  console.error("Could not import from utils/svgUtils, using inline implementation", error);
  
  // Fallback: inline implementation
  processTemplate = (svgContent, productData, companyData) => {
    let processed = svgContent;
    
    // Replace product data placeholders
    if (productData) {
      if (productData.title) {
        processed = processed.replace(/{{PRODUCT_TITLE}}/g, productData.title);
      }
      
      if (productData.price) {
        processed = processed.replace(/{{PRODUCT_PRICE}}/g, productData.price);
      }
      
      if (productData.sku) {
        processed = processed.replace(/{{PRODUCT_SKU}}/g, productData.sku);
      }
      
      if (productData.description) {
        processed = processed.replace(/{{PRODUCT_DESCRIPTION}}/g, productData.description);
      }
      
      if (productData.image) {
        processed = processed.replace(/{{PRODUCT_IMAGE}}/g, productData.image);
      }
    }
    
    // Replace company data placeholders
    if (companyData) {
      if (companyData.name) {
        processed = processed.replace(/{{COMPANY_NAME}}/g, companyData.name);
      }
      
      if (companyData.logo) {
        processed = processed.replace(/{{COMPANY_LOGO}}/g, companyData.logo);
      }
      
      if (companyData.phone) {
        processed = processed.replace(/{{PHONE_NUMBER}}/g, companyData.phone);
      }
      
      if (companyData.email) {
        processed = processed.replace(/{{EMAIL}}/g, companyData.email);
      }
      
      if (companyData.website) {
        processed = processed.replace(/{{WEBSITE}}/g, companyData.website);
      }
    }
    
    // Replace any remaining placeholders with empty strings
    processed = processed.replace(/{{[^}]+}}/g, '');
    
    return processed;
  };
}

const TemplatePreview = ({ template, productData, companyData }) => {
  const [processedSvg, setProcessedSvg] = useState('');
  
  useEffect(() => {
    if (template && template.content) {
      try {
        const processed = processTemplate(template.content, productData, companyData);
        setProcessedSvg(processed);
      } catch (error) {
        console.error("Error processing template:", error);
        setProcessedSvg('<svg><text>Error processing template</text></svg>');
      }
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
