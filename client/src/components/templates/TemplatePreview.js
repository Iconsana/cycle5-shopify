import React, { useEffect, useState } from 'react';

const TemplatePreview = ({ template, productData, companyData }) => {
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Reset states when template changes
    if (!template) {
      setSvgContent('');
      setError(null);
      return;
    }
    
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the template SVG content directly
        const response = await fetch(`/api/templates/${template.id}`);
        
        // Check if response is OK
        if (!response.ok) {
          throw new Error(`Failed to load template: ${response.status}`);
        }
        
        // Get the SVG content as text
        const svgText = await response.text();
        
        // Process the SVG content with replacements
        let processedSvg = svgText;
        
        // Replace product data placeholders
        if (productData) {
          if (productData.title) {
            processedSvg = processedSvg.replace(/{{PRODUCT_TITLE}}/g, productData.title);
          }
          if (productData.price) {
            processedSvg = processedSvg.replace(/{{PRODUCT_PRICE}}/g, productData.price);
          }
          if (productData.sku) {
            processedSvg = processedSvg.replace(/{{PRODUCT_SKU}}/g, productData.sku);
          }
          if (productData.description) {
            processedSvg = processedSvg.replace(/{{PRODUCT_DESCRIPTION}}/g, productData.description);
          }
          if (productData.image) {
            processedSvg = processedSvg.replace(/{{PRODUCT_IMAGE}}/g, productData.image);
          }
        }
        
        // Replace company data placeholders
        if (companyData) {
          if (companyData.name) {
            processedSvg = processedSvg.replace(/{{COMPANY_NAME}}/g, companyData.name);
          }
          if (companyData.phone) {
            processedSvg = processedSvg.replace(/{{PHONE_NUMBER}}/g, companyData.phone);
          }
          if (companyData.email) {
            processedSvg = processedSvg.replace(/{{EMAIL}}/g, companyData.email);
          }
          if (companyData.website) {
            processedSvg = processedSvg.replace(/{{WEBSITE}}/g, companyData.website);
          }
        }
        
        // Replace any remaining placeholders with empty strings
        processedSvg = processedSvg.replace(/{{[^}]+}}/g, '');
        
        setSvgContent(processedSvg);
      } catch (err) {
        console.error('Error fetching template:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplate();
  }, [template, productData, companyData]);
  
  if (!template) {
    return <div className="no-template">Please select a template</div>;
  }
  
  if (loading) {
    return <div className="loading-template">Loading template...</div>;
  }
  
  if (error) {
    return <div className="error-template">Error: {error}</div>;
  }
  
  return (
    <div className="template-preview-container">
      <div 
        className="template-preview-content"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};

export default TemplatePreview;
