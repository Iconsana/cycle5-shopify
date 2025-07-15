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

    // Sanitize text to prevent SVG crashes
    const sanitizeText = (text) => {
      if (!text) return '';
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .substring(0, 100); // Limit length to prevent overflow
    };

    // Add basic product data parameters (only if they exist)
    addParam('title', sanitizeText(productData?.title));
    addParam('price', sanitizeText(productData?.price));
    addParam('sku', sanitizeText(productData?.sku));
    addParam('description', sanitizeText(productData?.description));
    addParam('imageUrl', productData?.image);

    // Solar Kit Social specific parameters (only add if they exist)
    if (template.id === 'solar-kit-social') {
      console.log('Building solar-kit-social preview URL with dynamic field support');
      
      // Header fields
      addParam('ratingText', sanitizeText(productData?.ratingText));
      addParam('brandText', sanitizeText(productData?.brandText));
      addParam('categoryText', sanitizeText(productData?.categoryText));
      addParam('mainTitle', sanitizeText(productData?.mainTitle));
      
      // Image section - FIX FOR CRASH
      addParam('imageTitle', sanitizeText(productData?.imageTitle));
      addParam('secondaryDescription', sanitizeText(productData?.secondaryDescription));
      
      // Dynamic Power System fields (1-3 fields)
      for (let i = 1; i <= 3; i++) {
        const fieldName = `powerDetail${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
      
      // Dynamic Solar Panel fields (1-2 fields)
      for (let i = 1; i <= 2; i++) {
        const fieldName = `panelDetail${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
      
      // Dynamic Mounting Hardware fields (1-3 fields)
      for (let i = 1; i <= 3; i++) {
        const fieldName = `mountDetail${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
      
      // Dynamic Electrical Components fields (1-3 fields)
      for (let i = 1; i <= 3; i++) {
        const fieldName = `elecDetail${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
      
      // Dynamic Cables & Installation fields (1-3 fields)
      for (let i = 1; i <= 3; i++) {
        const fieldName = `cableDetail${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
      
      // NEW: Dynamic Additional Parts fields (1-10 fields)
      for (let i = 1; i <= 10; i++) {
        const fieldName = `additionalPart${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
      
      // Description section
      addParam('descriptionTitle', sanitizeText(productData?.descriptionTitle));
      for (let i = 1; i <= 6; i++) {
        const fieldName = `descriptionLine${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
      
      // Benefits
      for (let i = 1; i <= 5; i++) {
        const fieldName = `benefit${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
      
      // Price section
      addParam('priceHeader', sanitizeText(productData?.priceHeader));
      addParam('priceAmount', sanitizeText(productData?.priceAmount));
      addParam('priceNote', sanitizeText(productData?.priceNote));
      
      // Delivery section
      for (let i = 1; i <= 3; i++) {
        const fieldName = `delivery${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
      
      // Contact section
      addParam('contactPhone1', sanitizeText(productData?.contactPhone1));
      addParam('contactPhone2', sanitizeText(productData?.contactPhone2));
      addParam('contactEmail', sanitizeText(productData?.contactEmail));
      addParam('contactWebsite', sanitizeText(productData?.contactWebsite));
    }

    // Existing Solar Bulk Deal parameters (only add if they exist)
    addParam('promotionTitle', sanitizeText(productData?.promotionTitle));
    addParam('imageTitle', sanitizeText(productData?.imageTitle));
    addParam('secondaryDescription', sanitizeText(productData?.secondaryDescription));
    
    // Bullet points for other templates
    for (let i = 1; i <= 5; i++) {
      const fieldName = `bulletPoint${i}`;
      if (productData?.[fieldName]) {
        addParam(fieldName, sanitizeText(productData[fieldName]));
      }
    }

    // Add company data parameters (only if they exist)
    addParam('company', sanitizeText(companyData?.name));
    addParam('phone', sanitizeText(companyData?.phone));
    addParam('email', sanitizeText(companyData?.email));
    addParam('website', sanitizeText(companyData?.website));
    
    // Add cache-busting parameter
    params.append('t', Date.now());
    
    // Construct the preview URL
    const url = `/api/render-template?${params.toString()}`;
    setPreviewUrl(url);
    setImageError(false);
    
    console.log('Preview URL:', url);
    console.log('Parameters being sent:', Object.fromEntries(params.entries()));
    
    // Log dynamic field counts for debugging
    const dynamicFields = {
      powerDetails: Object.keys(productData || {}).filter(k => k.startsWith('powerDetail')).length,
      panelDetails: Object.keys(productData || {}).filter(k => k.startsWith('panelDetail')).length,
      mountDetails: Object.keys(productData || {}).filter(k => k.startsWith('mountDetail')).length,
      elecDetails: Object.keys(productData || {}).filter(k => k.startsWith('elecDetail')).length,
      cableDetails: Object.keys(productData || {}).filter(k => k.startsWith('cableDetail')).length,
      additionalParts: Object.keys(productData || {}).filter(k => k.startsWith('additionalPart')).length
    };
    console.log('Dynamic field counts:', dynamicFields);
    
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
    console.error('Error details:', e);
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
            <p style={{ color: '#dc3545', marginBottom: '10px' }}>⚠️ Preview Error</p>
            <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '10px' }}>
              Failed to load template preview. This might be due to special characters in text fields.
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
                padding: '8px 12px',
                border: '1px solid #007bff',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🔄 Retry Preview
            </button>
            <details style={{ marginTop: '15px', fontSize: '11px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#007bff' }}>🔍 Debug Info</summary>
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f1f1f1', borderRadius: '4px' }}>
                <p><strong>Template:</strong> {template.id}</p>
                <p><strong>URL Length:</strong> {previewUrl.length} characters</p>
                <p><strong>Fields with data:</strong> {Object.keys(productData || {}).filter(k => productData[k]).length}</p>
                <p><strong>Dynamic fields:</strong></p>
                <ul style={{ fontSize: '10px', marginLeft: '15px' }}>
                  <li>Power Details: {Object.keys(productData || {}).filter(k => k.startsWith('powerDetail')).length}</li>
                  <li>Additional Parts: {Object.keys(productData || {}).filter(k => k.startsWith('additionalPart')).length}</li>
                </ul>
                <details style={{ marginTop: '8px' }}>
                  <summary style={{ fontSize: '10px', color: '#666' }}>Full URL</summary>
                  <div style={{ fontSize: '9px', wordBreak: 'break-all', maxHeight: '100px', overflow: 'auto', backgroundColor: 'white', padding: '5px', marginTop: '5px' }}>
                    {previewUrl}
                  </div>
                </details>
              </div>
            </details>
          </div>
        ) : (
          <>
            <img 
              src={previewUrl} 
              alt="Template Preview" 
              style={{ maxWidth: '100%', height: 'auto' }} 
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {/* Field count indicator */}
            <div style={{
              fontSize: '10px',
              color: '#666',
              textAlign: 'center',
              marginTop: '10px',
              padding: '5px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px'
            }}>
              📊 Active fields: {Object.keys(productData || {}).filter(k => productData[k] && productData[k].trim()).length}
              {template.id === 'solar-kit-social' && (
                <span> | Additional parts: {Object.keys(productData || {}).filter(k => k.startsWith('additionalPart') && productData[k]).length}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TemplatePreview;
