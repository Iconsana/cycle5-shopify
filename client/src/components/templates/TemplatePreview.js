// client/src/components/templates/TemplatePreview.js
import React from 'react';

const TemplatePreview = ({ template, productData, companyData }) => {
  if (!template) {
    return <div className="no-template">Please select a template</div>;
  }

  // In TemplatePreview.js, find the section that builds the URL params
const params = new URLSearchParams();
params.append('templateId', template.id);

// Add product data parameters
if (productData?.title) params.append('title', productData.title);
if (productData?.price) params.append('price', productData.price);
if (productData?.sku) params.append('sku', productData.sku);
if (productData?.description) params.append('description', productData.description);
if (productData?.image) params.append('imageUrl', productData.image);

// New Solar Bulk Deal parameters
if (productData?.promotionTitle) params.append('promotionTitle', productData.promotionTitle);
if (productData?.imageTitle) params.append('imageTitle', productData.imageTitle);
if (productData?.secondaryDescription) params.append('secondaryDescription', productData.secondaryDescription);
if (productData?.bulletPoint1) params.append('bulletPoint1', productData.bulletPoint1);
if (productData?.bulletPoint2) params.append('bulletPoint2', productData.bulletPoint2);
if (productData?.bulletPoint3) params.append('bulletPoint3', productData.bulletPoint3);
if (productData?.bulletPoint4) params.append('bulletPoint4', productData.bulletPoint4);
if (productData?.bulletPoint5) params.append('bulletPoint5', productData.bulletPoint5);

// Add company data parameters
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
