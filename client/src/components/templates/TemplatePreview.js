// client/src/components/templates/TemplatePreview.js
import React, { useState, useEffect } from 'react';

const TemplatePreview = ({ template, productData, companyData }) => {
  const [imageError, setImageError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  
  useEffect(() => {
    if (!template) {
      setPreviewUrl('');
      return;
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
      console.log('Building solar-kit-social preview URL');
      
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
      
      // Cables & Installation
      if (productData?.cableDetail1) params.append('cableDetail1', productData.cableDetail1);
      if (productData?.cableDetail2) params.append('cableDetail2', productData.cableDetail2);
      
      // Warranty & Specs
      if (productData?.warrantyDetail1) params.append('warrantyDetail1', productData.warrantyDetail1);
      if (productData?.warrantyDetail2) params.append('warrantyDetail2', productData.warrantyDetail2);
      
      // Expected Performance
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
      
      // Delivery section
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
    const url = `/api/render-template?${params.toString()}`;
    setPreviewUrl(url);
    setImageError(false);
    
    console.log('Preview URL:', url);
  }, [template, productData, companyData]);

  if (!template) {
    return (
      <div className="template-preview-container">
        <div className="no-template">Please select a template</div>
      </div>
    );
  }

  const handleImageError = (e) => {
    console.error('Preview failed to load:', previewUrl);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Preview loaded successfully');
    setImageError(false);
  };

  return (
    <div className="template-preview-container">
      <div className="template-preview-content">
        {imageError ? (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            backgroundColor: '#f8f9fa'
          }}>
            <p style={{ color: '#dc3545', marginBottom: '10px' }}>Preview Error</p>
            <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '10px' }}>
              Failed to load template preview
            </p>
            <button 
              onClick={() => {
                setImageError(false);
                // Force reload by updating timestamp
                const url = new URL(previewUrl, window.location.origin);
                url.searchParams.set('t', Date.now());
                setPreviewUrl(url.pathname + url.search);
              }}
              style={{
                padding: '5px 10px',
                border: '1px solid #007bff',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
            <details style={{ marginTop: '10px', fontSize: '11px' }}>
              <summary>Debug Info</summary>
              <p>Template: {template.id}</p>
              <p>URL: {previewUrl}</p>
            </details>
          </div>
        ) : (
          <img 
            src={previewUrl} 
            alt="Template Preview" 
            style={{ maxWidth: '100%', height: 'auto' }} 
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
      </div>
    </div>
  );
};

export default TemplatePreview;
