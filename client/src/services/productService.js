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
    const response = await axios.post('/api/products/extract-colors', { image: imageData });
    return response.data.data;
  } catch (error) {
    console.error('Error extracting colors:', error);
    throw error;
  }
};
