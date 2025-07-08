// client/src/components/templates/TemplatePreview.js
import React from 'react';

const TemplatePreview = ({ template, productData, companyData }) => {
  if (!template) {
    return <div className="no-template">Please select a template</div>;
  }

  // Build URL params for the template
  const params = new URLSearchParams();
  params.append('templateId', template.id);

  // Add basic product data parameters
  if (productData?.title) params.append('title', productData.title);
  if (productData?.price) params.append('price', productData.price);
  if (productData?.sku) params.append('sku', productData.sku);
  if (productData?.description) params.append('description', productData.description);
  if (productData?.image) params.append('imageUrl', productData.image);

  // Solar Kit Social specific parameters
  if (template.id === 'solar-kit-social') {
    // Header fields
    if (productData?.ratingText) params.append('ratingText', productData.ratingText);
    if (productData?.brandText) params.append('brandText', productData.brandText);
    if (productData?.categoryText) params.append('categoryText', productData.categoryText);
    if (productData?.mainTitle) params.append('mainTitle', productData.mainTitle);
    
    // Image section
    if (productData?.imageTitle) params.append('imageTitle', productData.imageTitle);
    if (productData?.secondaryDescription) params.append('secondaryDescription', productData.secondaryDescription);
    
    // Product details sections
    if (productData?.powerDetail1) params.append('powerDetail1', productData.powerDetail1);
    if (productData?.powerDetail2) params.append('powerDetail2', productData.powerDetail2);
    if (productData?.panelDetail1) params.append('panelDetail1', productData.panelDetail1);
    if (productData?.panelDetail2) params.append('panelDetail2', productData.panelDetail2);
    if (productData?.mountDetail1) params.append('mountDetail1', productData.mountDetail1);
    if (productData?.mountDetail2) params.append('mountDetail2', productData.mountDetail2);
    if (productData?.elecDetail1) params.append('elecDetail1', productData.elecDetail1);
    if (productData?.elecDetail2) params.append('elecDetail2', productData.elecDetail2);
    
    // NEW: Cables & Installation
    if (productData?.cableDetail1) params.append('cableDetail1', productData.cableDetail1);
    if (productData?.cableDetail2) params.append('cableDetail2', productData.cableDetail2);
    
    // NEW: Warranty & Specs
    if (productData?.warrantyDetail1) params.append('warrantyDetail1', productData.warrantyDetail1);
    if (productData?.warrantyDetail2) params.append('warrantyDetail2', productData.warrantyDetail2);
    
    // NEW: Expected Performance
    if (productData?.performanceDetail1) params.append('performanceDetail1', productData.performanceDetail1);
    if (productData?.performanceDetail2) params.append('performanceDetail2', productData.performanceDetail2);
    
    // Description section
    if (productData?.descriptionTitle) params.append('descriptionTitle', productData.descriptionTitle);
    if (productData?.descriptionLine1) params.append('descriptionLine1', productData.descriptionLine1);
    if (productData?.descriptionLine2) params.append('descriptionLine2', productData.descriptionLine2);
    if (productData?.descriptionLine3) params.append('descriptionLine3', productData.descriptionLine3);
    if (productData?.descriptionLine4) params.append('descriptionLine4', productData.descriptionLine4);
    if (productData?.descriptionLine5) params.append('descriptionLine5', productData.descriptionLine5);
    if (productData?.descriptionLine6) params.append('descriptionLine6', productData.descriptionLine6);
    
    // Benefits
    if (productData?.benefit1) params.append('benefit1', productData.benefit1);
    if (productData?.benefit2) params.append('benefit2', productData.benefit2);
    if (productData?.benefit3) params.append('benefit3', productData.benefit3);
    if (productData?.benefit4) params.append('benefit4', productData.benefit4);
    if (productData?.benefit5) params.append('benefit5', productData.benefit5);
    
    // Price section
    if (productData?.priceHeader) params.append('priceHeader', productData.priceHeader);
    if (productData?.priceAmount) params.append('priceAmount', productData.priceAmount);
    if (productData?.priceNote) params.append('priceNote', productData.priceNote);
    
    // NEW: Delivery section
    if (productData?.delivery1) params.append('delivery1', productData.delivery1);
    if (productData?.delivery2) params.append('delivery2', productData.delivery2);
    if (productData?.delivery3) params.append('delivery3', productData.delivery3);
    
    // Contact section
    if (productData?.contactPhone1) params.append('contactPhone1', productData.contactPhone1);
    if (productData?.contactPhone2) params.append('contactPhone2', productData.contactPhone2);
    if (productData?.contactEmail) params.append('contactEmail', productData.contactEmail);
    if (productData?.contactWebsite) params.append('contactWebsite', productData.contactWebsite);
  }

  // Existing Solar Bulk Deal parameters
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
          onError={(e) => {
            console.error('Preview failed to load:', previewUrl);
            e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><text x="20" y="150" fill="red">Preview Error</text></svg>`;
          }}
        />
      </div>
    </div>
  );
};

export default TemplatePreview;
