import axios from 'axios';

// Get all templates
export const getTemplates = async () => {
  try {
    const response = await axios.get('/api/templates');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

// Get a specific template
export const getTemplateById = async (id) => {
  try {
    const response = await axios.get(`/api/templates/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching template ${id}:`, error);
    throw error;
  }
};

// Generate image from template
export const generateImage = async (templateId, productData, companyData, format) => {
  try {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('templateId', templateId);
    
    // Add product data
    formData.append('productData', JSON.stringify(productData));
    
    // Add company data
    formData.append('companyData', JSON.stringify(companyData));
    
    // Add format
    formData.append('format', format);
    
    // If there's a product image URL, fetch it and append as file
    if (productData.image && productData.image.startsWith('data:')) {
      // It's already a base64 string
      const blob = await fetch(productData.image).then(r => r.blob());
      formData.append('productImage', blob, 'product-image.png');
    } else if (productData.image && productData.image.startsWith('http')) {
      // It's a URL, fetch it first
      const imageResponse = await fetch(productData.image);
      const blob = await imageResponse.blob();
      formData.append('productImage', blob, 'product-image.png');
    }
    
    // Make API request
    const response = await axios.post('/api/templates/generate', formData, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
