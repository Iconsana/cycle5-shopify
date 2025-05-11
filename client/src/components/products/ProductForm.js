import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractColors } from '../../services/productService';

const ProductForm = ({ productData, onProductChange }) => {
  const [colorPalette, setColorPalette] = useState([]);
  
  // Handle file drop for product image
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      // Handle the uploaded image
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Create preview URL
        const imageUrl = URL.createObjectURL(file);
        
        // Update product data with image
        onProductChange({ image: imageUrl });
        
        // Extract colors from the image
        try {
          // Convert image to base64 for color extraction
          const reader = new FileReader();
          reader.onload = async (event) => {
            const base64 = event.target.result;
            
            // Extract colors from the image
            const colors = await extractColors(base64);
            setColorPalette(colors.palette);
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error('Error extracting colors:', error);
        }
      }
    }
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    onProductChange({ [name]: value });
  };
  
  return (
    <div className="product-form">
      <div className="form-group">
        <label htmlFor="title">Product Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={productData.title || ''}
          onChange={handleChange}
          placeholder="Enter product title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          type="text"
          id="price"
          name="price"
          value={productData.price || ''}
          onChange={handleChange}
          placeholder="R0.00"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="sku">SKU</label>
        <input
          type="text"
          id="sku"
          name="sku"
          value={productData.sku || ''}
          onChange={handleChange}
          placeholder="Enter product SKU"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={productData.description || ''}
          onChange={handleChange}
          placeholder="Enter product description"
          rows={4}
        />
      </div>
      
      {/* New fields for Solar Bulk Deal template */}
      <div className="form-group">
        <label htmlFor="promotionTitle">Promotion Title</label>
        <input
          type="text"
          id="promotionTitle"
          name="promotionTitle"
          value={productData.promotionTitle || ''}
          onChange={handleChange}
          placeholder="SOLAR BULK DEAL"
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageTitle">Image Title</label>
        <input
          type="text"
          id="imageTitle"
          name="imageTitle"
          value={productData.imageTitle || ''}
          onChange={handleChange}
          placeholder="5 Dyness BX 51100 Units"
        />
      </div>

      <div className="form-group">
        <label htmlFor="secondaryDescription">Secondary Description</label>
        <input
          type="text"
          id="secondaryDescription"
          name="secondaryDescription"
          value={productData.secondaryDescription || ''}
          onChange={handleChange}
          placeholder="Bulk Deal"
        />
      </div>

      <div className="form-group">
        <label>Bullet Points</label>
        {[1, 2, 3, 4, 5].map(index => (
          <input
            key={`bulletPoint${index}`}
            type="text"
            id={`bulletPoint${index}`}
            name={`bulletPoint${index}`}
            value={productData[`bulletPoint${index}`] || ''}
            onChange={handleChange}
            placeholder={`Bullet point ${index}`}
            className="mt-2"
            style={{ marginTop: '8px' }}
          />
        ))}
      </div>
      
      <div className="form-group">
        <label>Product Image</label>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag & drop an image here, or click to select one</p>
          {productData.image && (
            <div className="image-preview">
              <img src={productData.image} alt="Product preview" />
            </div>
          )}
        </div>
      </div>
      
      {colorPalette.length > 0 && (
        <div className="color-palette">
          <label>Extracted Colors:</label>
          <div className="colors">
            {colorPalette.map((color, index) => (
              <div 
                key={index} 
                className="color-swatch"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
