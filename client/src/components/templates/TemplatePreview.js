// client/src/components/templates/TemplatePreview.js
import React from 'react';

const TemplatePreview = ({ template, productData, companyData }) => {
  if (!template) {
    return <div className="no-template">Please select a template</div>;
  }

  // Construct query params for preview
  const params = new URLSearchParams();
  params.append('templateId', template.id);
  
  // Add product data parameters
  if (productData?.title) params.append('title', productData.title);
  if (productData?.price) params.append('price', productData.price);
  if (productData?.sku) params.append('sku', productData.sku);
  if (productData?.description) params.append('description', productData.description);
  
  // Add company data parameters
  if (companyData?.name) params.append('company', companyData.name);
  if (companyData?.phone) params.append('phone', companyData.phone);
  if (companyData?.email) params.append('email', companyData.email);
  if (companyData?.website) params.append('website', companyData.website);
  
  // Add cache-busting param
  params.append('t', Date.now());
  
  // Construct preview URL
  const previewUrl = `/api/preview?${params.toString()}`;

  return (
    <div className="template-preview-container">
      <div className="template-preview-content">
        <img 
          src={previewUrl} 
          alt="Template Preview" 
          style={{ maxWidth: '100%', height: 'auto' }} 
        />
      </div>
    </div>
  );
};

export default TemplatePreview;
