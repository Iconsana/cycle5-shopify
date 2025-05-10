// client/src/components/templates/TemplatePreview.js
import React, { useEffect, useState } from 'react';

const TemplatePreview = ({ template, productData, companyData }) => {
  const [previewSrc, setPreviewSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!template) {
      setPreviewSrc('');
      setError(null);
      return;
    }
    
    // Construct URL with parameters for dynamic preview
    const params = new URLSearchParams();
    if (productData?.title) params.append('title', productData.title);
    if (productData?.price) params.append('price', productData.price);
    if (productData?.sku) params.append('sku', productData.sku);
    if (productData?.description) params.append('description', productData.description);
    if (companyData?.name) params.append('company', companyData.name);
    if (companyData?.phone) params.append('phone', companyData.phone);
    if (companyData?.email) params.append('email', companyData.email);
    if (companyData?.website) params.append('website', companyData.website);
    
    // Use an image tag instead of trying to fetch and parse the SVG
    setPreviewSrc(`/api/preview/${template.id}?${params.toString()}&t=${Date.now()}`);
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
      <div className="template-preview-content">
        {previewSrc && (
          <img
            src={previewSrc}
            alt="Template Preview"
            style={{ maxWidth: '100%' }}
          />
        )}
      </div>
    </div>
  );
};

export default TemplatePreview;
