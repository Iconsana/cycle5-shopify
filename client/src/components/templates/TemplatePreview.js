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
        setLoading(true);
        setError(null);
        console.log("Fetching template:", template.id);
        
        // If we already have content, use it directly
        if (template.content) {
          processAndSetSvg(template.content);
          return;
        }
        
        // Otherwise fetch the template data
        const response = await fetch(`/api/templates/${template.id}`);
        
        // Check response
        if (!response.ok) {
          throw new Error(`Failed to load template: ${response.status}`);
        }
        
        // Parse JSON response
        const data = await response.json();
        console.log("Template data received:", data);
        
        if (!data.success || !data.data || !data.data.content) {
          throw new Error('Invalid template data received');
        }
        
        // Process the SVG content
        processAndSetSvg(data.data.content);
      } catch (err) {
        console.error('Error fetching template:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Helper function to process SVG content
    const processAndSetSvg = (svgContent) => {
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
      
      setProcessedSvg(processed);
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
        dangerouslySetInnerHTML={{ __html: processedSvg }}
      />
    </div>
  );
};

export default TemplatePreview;
