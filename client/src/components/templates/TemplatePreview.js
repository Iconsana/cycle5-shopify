// client/src/components/templates/TemplatePreview.js
import React from 'react';

const TemplatePreview = ({ template, productData, companyData }) => {
  if (!template) {
    return <div className="no-template">Please select a template</div>;
  }

  // Construct query params for the render-template endpoint
  const params = new URLSearchParams();
  params.append('templateId', template.id);
  
  // Add product data
  if (productData?.title) params.append('title', productData.title);
  if (productData?.price) params.append('price', productData.price);
  if (productData?.sku) params.append('sku', productData.sku);
  if (productData?.description) params.append('description', productData.description);
  
  // Include the product image URL if available
  if (productData?.image) params.append('imageUrl', productData.image);
  
  // Add company data
  if (companyData?.name) params.append('company', companyData.name);
  if (companyData?.phone) params.append('phone', companyData.phone);
  if (companyData?.email) params.append('email', companyData.email);
  if (companyData?.website) params.append('website', companyData.website);
  
  // Add cache-busting parameter
  params.append('t', Date.now());
  
  // Construct the preview URL
  const previewUrl = `/api/render-template?${params.toString()}`;

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
