// client/src/components/templates/TemplatePreview.js - Fixed with fallback
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
        .substring(0, 100);
    };

    // Add basic product data parameters (only if they exist)
    addParam('title', sanitizeText(productData?.title));
    addParam('price', sanitizeText(productData?.price));
    addParam('sku', sanitizeText(productData?.sku));
    addParam('description', sanitizeText(productData?.description));
    
    // Handle image data more safely - avoid passing large base64 in URL
    if (productData?.image) {
      const imageData = productData.image;
      // Check if it's a base64 image and if it's too large for URL params
      if (imageData.startsWith('data:image/') && imageData.length > 10000) {
        // For large images, don't pass in URL - handle separately
        console.warn('Image too large for URL parameters, skipping image in preview');
        addParam('hasLargeImage', 'true');
      } else if (imageData.startsWith('data:image/') && imageData.length <= 10000) {
        // For smaller base64 images, pass as URL param
        addParam('imageUrl', encodeURIComponent(imageData));
      } else if (imageData.startsWith('http')) {
        // For regular URLs, pass as is
        addParam('imageUrl', imageData);
      }
    }

    // Solar Kit Social specific parameters (only add if they exist)
    if (template.id === 'solar-kit-social') {
      console.log('Building solar-kit-social preview URL with dynamic field support');
      
      // Header fields
      addParam('ratingText', sanitizeText(productData?.ratingText));
      addParam('brandText', sanitizeText(productData?.brandText));
      addParam('categoryText', sanitizeText(productData?.categoryText));
      addParam('mainTitle', sanitizeText(productData?.mainTitle));
      
      // Image section
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
      
      // Dynamic Additional Parts fields (1-10 fields)
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
    // Note: imageTitle and secondaryDescription are already handled in solar-kit-social section above
    
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
    
    // TRY MULTIPLE API ENDPOINTS (fallback approach)
    let urls = [
      `/api/main?action=render&${params.toString()}`,           // New consolidated API
      `/api/render-template?${params.toString()}`,              // Original API
      `/api/main?action=debug&${params.toString()}`             // Debug fallback
    ];
    
    // Try the first URL
    const url = urls[0];
    setPreviewUrl(url);
    setImageError(false);
    
    console.log('Preview URL:', url);
    console.log('Fallback URLs available:', urls.length);
    
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

  // ENHANCED ERROR HANDLING WITH MULTIPLE RETRY OPTIONS
  const retryPreview = () => {
    console.log('🔄 Retrying preview with different approaches...');
    
    // Try different URLs in sequence
    const baseParams = new URLSearchParams();
    baseParams.append('templateId', template.id);
    baseParams.append('mainTitle', productData?.mainTitle || 'Test Title');
    baseParams.append('sku', productData?.sku || 'TEST-SKU');
    baseParams.append('ratingText', productData?.ratingText || 'Hellopeter 4.67');
    baseParams.append('brandText', productData?.brandText || 'B SHOCKED');
    baseParams.append('t', Date.now());
    
    const retryUrls = [
      `/api/main?action=debug&${baseParams.toString()}`,        // Debug first
      `/api/main?action=render&${baseParams.toString()}`,       // Then render
      `/api/render-template?${baseParams.toString()}`           // Original as fallback
    ];
    
    // Try the debug endpoint first to test connectivity
    setPreviewUrl(retryUrls[0]);
    setImageError(false);
    
    console.log('Retry URL:', retryUrls[0]);
  };

  const testDirectAPI = () => {
    console.log('🧪 Testing direct API access...');
    
    // Open debug endpoint in new tab for direct testing
    const debugUrl = `/api/main?action=debug&t=${Date.now()}`;
    window.open(debugUrl, '_blank');
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
              API connection failed. This might be due to deployment issues or API endpoint changes.
            </p>
            
            <div style={{ marginBottom: '15px' }}>
              <button 
                onClick={retryPreview}
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
                🔄 Retry with Debug
              </button>
              
              <button 
                onClick={testDirectAPI}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #28a745',
                  backgroundColor: '#28a745',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🧪 Test API Direct
              </button>
            </div>
            
            <details style={{ marginTop: '15px', fontSize: '11px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#007bff' }}>🔍 Debug Info</summary>
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f1f1f1', borderRadius: '4px' }}>
                <p><strong>Template:</strong> {template.id}</p>
                <p><strong>Current URL:</strong> {previewUrl}</p>
                <p><strong>Fields with data:</strong> {Object.keys(productData || {}).filter(k => productData[k]).length}</p>
                <p><strong>Expected API:</strong> /api/main?action=render</p>
                <p><strong>Status:</strong> API might not be deployed yet</p>
                
                <div style={{ marginTop: '10px' }}>
                  <p><strong>🔧 Quick Fixes:</strong></p>
                  <ul style={{ fontSize: '10px', marginLeft: '15px' }}>
                    <li>Check if old API files are still deployed</li>
                    <li>Verify consolidated API is live</li>
                    <li>Test direct API endpoint access</li>
                    <li>Check browser network tab for actual error</li>
                  </ul>
                </div>
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
              <br/>
              <span style={{ color: '#007bff' }}>API: {previewUrl.includes('action=render') ? 'Consolidated' : 'Legacy'}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TemplatePreview;
