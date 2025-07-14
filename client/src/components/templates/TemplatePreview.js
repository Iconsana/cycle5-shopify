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

    // Helper function to add parameter only if value exists and is not empty
    const addParam = (key, value) => {
      if (value && value.trim() !== '') {
        params.append(key, value);
      }
    };

    // Add basic product data parameters (only if they exist)
    addParam('title', productData?.title);
    addParam('price', productData?.price);
    addParam('sku', productData?.sku);
    addParam('description', productData?.description);
    addParam('imageUrl', productData?.image);

    // Solar Kit Social specific parameters (only add if they exist)
    if (template.id === 'solar-kit-social') {
      console.log('Building solar-kit-social preview URL with filtered data');
      
      // Header fields
      addParam('ratingText', productData?.ratingText);
      addParam('brandText', productData?.brandText);
      addParam('categoryText', productData?.categoryText);
      addParam('mainTitle', productData?.mainTitle);
      
      // Image section
      addParam('imageTitle', productData?.imageTitle);
      addParam('secondaryDescription', productData?.secondaryDescription);
      
      // Product details sections (only add if they exist)
      addParam('powerDetail1', productData?.powerDetail1);
      addParam('powerDetail2', productData?.powerDetail2);
      addParam('panelDetail1', productData?.panelDetail1);
      // REMOVED: panelDetail2 - no longer exists
      addParam('mountDetail1', productData?.mountDetail1);
      addParam('mountDetail2', productData?.mountDetail2);
      addParam('elecDetail1', productData?.elecDetail1);
      addParam('elecDetail2', productData?.elecDetail2);
      
      // Cables & Installation
      addParam('cableDetail1', productData?.cableDetail1);
      addParam('cableDetail2', productData?.cableDetail2);
      
      // REMOVED: Warranty & Specs fields - no longer exist
      // REMOVED: Expected Performance fields - no longer exist
      
      // Description section
      addParam('descriptionTitle', productData?.descriptionTitle);
      addParam('descriptionLine1', productData?.descriptionLine1);
      addParam('descriptionLine2', productData?.descriptionLine2);
      addParam('descriptionLine3', productData?.descriptionLine3);
      addParam('descriptionLine4', productData?.descriptionLine4);
      addParam('descriptionLine5', productData?.descriptionLine5);
      addParam('descriptionLine6', productData?.descriptionLine6);
      
      // Benefits
      addParam('benefit1', productData?.benefit1);
      addParam('benefit2', productData?.benefit2);
      addParam('benefit3', productData?.benefit3);
      addParam('benefit4', productData?.benefit4);
      addParam('benefit5', productData?.benefit5);
      
      // Price section
      addParam('priceHeader', productData?.priceHeader);
      addParam('priceAmount', productData?.priceAmount);
      addParam('priceNote', productData?.priceNote);
      
      // Delivery section
      addParam('delivery1', productData?.delivery1);
      addParam('delivery2', productData?.delivery2);
      addParam('delivery3', productData?.delivery3);
      
      // Contact section
      addParam('contactPhone1', productData?.contactPhone1);
      addParam('contactPhone2', productData?.contactPhone2);
      addParam('contactEmail', productData?.contactEmail);
      addParam('contactWebsite', productData?.contactWebsite);
    }

    // Existing Solar Bulk Deal parameters (only add if they exist)
    addParam('promotionTitle', productData?.promotionTitle);
    addParam('imageTitle', productData?.imageTitle);
    addParam('secondaryDescription', productData?.secondaryDescription);
    addParam('bulletPoint1', productData?.bulletPoint1);
    addParam('bulletPoint2', productData?.bulletPoint2);
    addParam('bulletPoint3', productData?.bulletPoint3);
    addParam('bulletPoint4', productData?.bulletPoint4);
    addParam('bulletPoint5', productData?.bulletPoint5);

    // Add company data parameters (only if they exist)
    addParam('company', companyData?.name);
    addParam('phone', companyData?.phone);
    addParam('email', companyData?.email);
    addParam('website', companyData?.website);
    
    // Add cache-busting parameter
    params.append('t', Date.now());
    
    // Construct the preview URL
    const url = `/api/render-template?${params.toString()}`;
    setPreviewUrl(url);
    setImageError(false);
    
    console.log('Preview URL:', url);
    console.log('Parameters being sent:', Object.fromEntries(params.entries()));
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
