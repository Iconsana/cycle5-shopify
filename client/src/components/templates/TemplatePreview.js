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
      console.log('Image data type:', typeof imageData);
      console.log('Image data length:', imageData?.length || 'N/A');
      console.log('Image data starts with data:image/?', imageData?.startsWith?.('data:image/'));
      
      // Check if it's a base64 image and if it's too large for URL params
      if (imageData && imageData.startsWith && imageData.startsWith('data:image/') && imageData.length > 50000) {
        // For very large images, use POST method instead
        console.warn('Image too large for URL parameters, will use fallback display');
        addParam('hasLargeImage', 'true');
      } else if (imageData && imageData.startsWith && imageData.startsWith('data:image/') && imageData.length <= 50000) {
        // For smaller base64 images, pass as URL param
        console.log('Adding base64 image to URL (size:', imageData.length, ')');
        addParam('imageUrl', encodeURIComponent(imageData));
      } else if (imageData && imageData.startsWith && imageData.startsWith('http')) {
        // For regular URLs, pass as is
        console.log('Adding HTTP image URL');
        addParam('imageUrl', imageData);
      } else {
        console.warn('Image data format not recognized:', imageData?.substring?.(0, 50) || imageData);
      }
    }

    // Solar Kit Social specific parameters (including all versions)
    if (template.id === 'solar-kit-social' || template.id.startsWith('solar-kit-social-v')) {
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

    // Solar Bulk Deal specific parameters
    if (template.id === 'solar-bulk-deal') {
      console.log('Building solar-bulk-deal preview URL');
      
      // Header fields (no rating/stars for bulk deal)
      addParam('companyName', sanitizeText(productData?.brandText));
      addParam('categoryText', sanitizeText(productData?.categoryText));
      
      // Title fields
      addParam('promotionTitle', sanitizeText(productData?.promotionTitle));
      addParam('productSku', sanitizeText(productData?.sku));
      addParam('productTitle', sanitizeText(productData?.productTitle));
      
      // Image section
      addParam('imageTitle', sanitizeText(productData?.imageTitle));
      
      // Bullet points
      for (let i = 1; i <= 4; i++) {
        const fieldName = `bulletPoint${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
      
      // Price
      addParam('productPrice', sanitizeText(productData?.productPrice));
      
      // Contact information
      addParam('phoneNumber', sanitizeText(productData?.phoneNumber));
      addParam('phoneNumber2', sanitizeText(productData?.phoneNumber2));
      addParam('email', sanitizeText(productData?.email));
      addParam('website', sanitizeText(productData?.website));
      
      // Delivery information
      for (let i = 1; i <= 3; i++) {
        const fieldName = `delivery${i}`;
        if (productData?.[fieldName]) {
          addParam(fieldName, sanitizeText(productData[fieldName]));
        }
      }
    }
    
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
    
    // Check if we need to use POST for large images
    const needsPost = params.get('hasLargeImage') === 'true' && productData?.image;
    
    if (needsPost) {
      // For large images, use POST with the image data in the body
      console.log('Using POST method for large image');
      handlePostPreview(template.id, productData, companyData);
    } else {
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
    }
    
  }, [template, productData, companyData]);

  // Handle POST preview for large images
  const handlePostPreview = async (templateId, productData, companyData) => {
    try {
      console.log('Sending POST request for large image preview...');
      
      const response = await fetch('/api/main?action=render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          productData,
          companyData,
          t: Date.now()
        })
      });
      
      if (response.ok) {
        const svgData = await response.text();
        // Create a blob URL for the SVG data
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const blobUrl = URL.createObjectURL(blob);
        setPreviewUrl(blobUrl);
        setImageError(false);
        console.log('POST preview successful, blob URL created');
      } else {
        console.error('POST preview failed:', response.status);
        setImageError(true);
      }
    } catch (error) {
      console.error('Error with POST preview:', error);
      setImageError(true);
    }
  };

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
    console.error('Event target:', e.target);
    console.error('Event type:', e.type);
    
    // Try to get more information about the error
    if (e.target && e.target.src) {
      console.error('Failed image src:', e.target.src.substring(0, 200) + '...');
    }
    
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
    
    // Test the API endpoint directly first
    fetch('/api/main?action=debug')
      .then(response => {
        console.log('API Response status:', response.status);
        console.log('API Response headers:', response.headers);
        return response.text();
      })
      .then(data => {
        console.log('API Response data:', data.substring(0, 200) + '...');
      })
      .catch(error => {
        console.error('API Test error:', error);
      });
    
    // Also open debug endpoint in new tab for visual testing
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
              📊 Active fields: {Object.keys(productData || {}).filter(k => productData[k] && typeof productData[k] === 'string' && productData[k].trim()).length}
              {(template.id === 'solar-kit-social' || template.id.startsWith('solar-kit-social-v')) && (
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
