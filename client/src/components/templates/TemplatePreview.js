import React, { useEffect, useState } from 'react';

// Inline implementation of SVG template processing
const processTemplate = (svgContent, productData, companyData) => {
  if (!svgContent) return '';
  
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

const TemplatePreview = ({ template, productData, companyData }) => {
  const [processedSvg, setProcessedSvg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!template) return;
    
    const fetchAndProcessTemplate = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If we already have the template content, process it directly
        if (template.content) {
          const processed = processTemplate(template.content, productData, companyData);
          setProcessedSvg(processed);
        } 
        // Otherwise, fetch the full template content
        else if (template.id) {
          console.log('Fetching template:', template.id);
          
          // Use absolute URL to avoid CORS and path issues
          const baseUrl = window.location.origin;
          const response = await fetch(`${baseUrl}/api/templates/${template.id}`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log('Template data received:', data);
          
          if (data.success && data.data && data.data.content) {
            const processed = processTemplate(data.data.content, productData, companyData);
            setProcessedSvg(processed);
          } else {
            throw new Error('Invalid template data received');
          }
        }
      } catch (err) {
        console.error('Error in template preview:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndProcessTemplate();
  }, [template, productData, companyData]);
  
  if (!template) {
    return <div className="no-template">Please select a template</div>;
  }
  
  if (loading) {
    return <div className="loading-template">Loading template...</div>;
  }
  
  if (error) {
    return <div className="template-error">Error: {error}</div>;
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
