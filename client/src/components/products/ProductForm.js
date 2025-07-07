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
      {/* Basic Product Info */}
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

      {/* Solar Bulk Deal Fields (existing) */}
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

      {/* NEW: Solar Kit Social Fields */}
      <div className="form-group">
        <h3>Solar Kit Social Fields</h3>
        
        {/* Header Fields */}
        <label htmlFor="ratingText">Rating Text</label>
        <input
          type="text"
          id="ratingText"
          name="ratingText"
          value={productData.ratingText || ''}
          onChange={handleChange}
          placeholder="Hellopeter 4.99"
        />
      </div>

      <div className="form-group">
        <label htmlFor="brandText">Brand Text</label>
        <input
          type="text"
          id="brandText"
          name="brandText"
          value={productData.brandText || ''}
          onChange={handleChange}
          placeholder="B SHOCKED"
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoryText">Category Text</label>
        <input
          type="text"
          id="categoryText"
          name="categoryText"
          value={productData.categoryText || ''}
          onChange={handleChange}
          placeholder="ELECTRICAL | SOLAR"
        />
      </div>

      <div className="form-group">
        <label htmlFor="mainTitle">Main Title</label>
        <input
          type="text"
          id="mainTitle"
          name="mainTitle"
          value={productData.mainTitle || ''}
          onChange={handleChange}
          placeholder="SOLAR KIT PACKAGE"
        />
      </div>

      {/* Power System Details */}
      <div className="form-group">
        <h4>Power System Details</h4>
        <label htmlFor="powerDetail1">Power Detail 1</label>
        <input
          type="text"
          id="powerDetail1"
          name="powerDetail1"
          value={productData.powerDetail1 || ''}
          onChange={handleChange}
          placeholder="• 5kW Deye Hybrid Inverter"
        />
        
        <label htmlFor="powerDetail2">Power Detail 2</label>
        <input
          type="text"
          id="powerDetail2"
          name="powerDetail2"
          value={productData.powerDetail2 || ''}
          onChange={handleChange}
          placeholder="• 5.12kWh Dyness Lithium Battery"
          style={{ marginTop: '8px' }}
        />
      </div>

      {/* Panel Details */}
      <div className="form-group">
        <h4>Panel Details</h4>
        <label htmlFor="panelDetail1">Panel Detail 1</label>
        <input
          type="text"
          id="panelDetail1"
          name="panelDetail1"
          value={productData.panelDetail1 || ''}
          onChange={handleChange}
          placeholder="• 8x 565W JA Solar Mono Panels"
        />
        
        <label htmlFor="panelDetail2">Panel Detail 2</label>
        <input
          type="text"
          id="panelDetail2"
          name="panelDetail2"
          value={productData.panelDetail2 || ''}
          onChange={handleChange}
          placeholder="• 4.52kW Total Panel Capacity"
          style={{ marginTop: '8px' }}
        />
      </div>

      {/* Mounting Details */}
      <div className="form-group">
        <h4>Mounting Hardware</h4>
        <label htmlFor="mountDetail1">Mount Detail 1</label>
        <input
          type="text"
          id="mountDetail1"
          name="mountDetail1"
          value={productData.mountDetail1 || ''}
          onChange={handleChange}
          placeholder="• PV Rails, Roof Hooks, Clamps"
        />
        
        <label htmlFor="mountDetail2">Mount Detail 2</label>
        <input
          type="text"
          id="mountDetail2"
          name="mountDetail2"
          value={productData.mountDetail2 || ''}
          onChange={handleChange}
          placeholder="• Complete Mounting System"
          style={{ marginTop: '8px' }}
        />
      </div>

      {/* Electrical Details */}
      <div className="form-group">
        <h4>Electrical Components</h4>
        <label htmlFor="elecDetail1">Electrical Detail 1</label>
        <input
          type="text"
          id="elecDetail1"
          name="elecDetail1"
          value={productData.elecDetail1 || ''}
          onChange={handleChange}
          placeholder="• DC/AC Combiners, Surge Protection"
        />
        
        <label htmlFor="elecDetail2">Electrical Detail 2</label>
        <input
          type="text"
          id="elecDetail2"
          name="elecDetail2"
          value={productData.elecDetail2 || ''}
          onChange={handleChange}
          placeholder="• Fuses, Switches, Safety Equipment"
          style={{ marginTop: '8px' }}
        />
      </div>

      {/* Benefits */}
      <div className="form-group">
        <h4>System Benefits</h4>
        {[1, 2, 3, 4, 5].map(index => (
          <input
            key={`benefit${index}`}
            type="text"
            id={`benefit${index}`}
            name={`benefit${index}`}
            value={productData[`benefit${index}`] || ''}
            onChange={handleChange}
            placeholder={`✓ Benefit ${index}`}
            style={{ marginTop: '8px' }}
          />
        ))}
      </div>

      {/* Price Fields */}
      <div className="form-group">
        <h4>Price Section</h4>
        <label htmlFor="priceHeader">Price Header</label>
        <input
          type="text"
          id="priceHeader"
          name="priceHeader"
          value={productData.priceHeader || ''}
          onChange={handleChange}
          placeholder="Incl. VAT"
        />
        
        <label htmlFor="priceAmount">Price Amount</label>
        <input
          type="text"
          id="priceAmount"
          name="priceAmount"
          value={productData.priceAmount || ''}
          onChange={handleChange}
          placeholder="R51,779.35"
          style={{ marginTop: '8px' }}
        />
        
        <label htmlFor="priceNote">Price Note</label>
        <input
          type="text"
          id="priceNote"
          name="priceNote"
          value={productData.priceNote || ''}
          onChange={handleChange}
          placeholder="Professional Installation Available"
          style={{ marginTop: '8px' }}
        />
      </div>

      {/* Contact Fields */}
      <div className="form-group">
        <h4>Contact Information</h4>
        <label htmlFor="contactPhone1">Phone 1</label>
        <input
          type="text"
          id="contactPhone1"
          name="contactPhone1"
          value={productData.contactPhone1 || ''}
          onChange={handleChange}
          placeholder="011 568 7166"
        />
        
        <label htmlFor="contactPhone2">Phone 2</label>
        <input
          type="text"
          id="contactPhone2"
          name="contactPhone2"
          value={productData.contactPhone2 || ''}
          onChange={handleChange}
          placeholder="067 923 8166"
          style={{ marginTop: '8px' }}
        />
        
        <label htmlFor="contactEmail">Email</label>
        <input
          type="text"
          id="contactEmail"
          name="contactEmail"
          value={productData.contactEmail || ''}
          onChange={handleChange}
          placeholder="sales@bshockedelectrical.co.za"
          style={{ marginTop: '8px' }}
        />
        
        <label htmlFor="contactWebsite">Website</label>
        <input
          type="text"
          id="contactWebsite"
          name="contactWebsite"
          value={productData.contactWebsite || ''}
          onChange={handleChange}
          placeholder="https://bshockedelectrical.co.za"
          style={{ marginTop: '8px' }}
        />
      </div>
      
      {/* Product Image Upload */}
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
