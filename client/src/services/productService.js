import axios from 'axios';

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`/api/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Extract colors from an image
export const extractColors = async (imageData) => {
  try {
    // Use consolidated API colors endpoint (mock implementation for now)
    const response = await axios.get('/api/main?action=colors');
    return response.data.data;
  } catch (error) {
    console.error('Error extracting colors:', error);
    // Return default colors if API fails
    return {
      dominant: 'rgb(45,56,128)',
      palette: [
        'rgb(45,56,128)', 
        'rgb(67,89,156)', 
        'rgb(120,145,190)', 
        'rgb(200,210,230)', 
        'rgb(245,245,250)'
      ]
    };
  }
};
