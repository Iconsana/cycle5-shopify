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
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Convert to base64 for SVG embedding
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target.result;
          onProductChange({ image: base64Image });
        };
        reader.readAsDataURL(file);
        
        // Extract colors from the image
        try {
          const reader2 = new FileReader();
          reader2.onload = async (event) => {
            try {
              const base64 = event.target.result;
              const colors = await extractColors(base64);
              setColorPalette(colors.palette || []);
            } catch (error) {
              console.error('Error extracting colors:', error);
            }
          };
          reader2.readAsDataURL(file);
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    }
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    onProductChange({ [name]: value });
  };
  
  const inputStyle = { marginTop: '4px' };
  const sectionStyle = { marginTop: '8px' };
  
  return (
    <div className="product-form">
      {/* Header Fields */}
      <div className="form-group">
        <h3>Header Information</h3>
        
        <label htmlFor="ratingText">Rating Text</label>
        <input
          type="text"
          id="ratingText"
          name="ratingText"
          value={productData.ratingText || 'Hellopeter 4.67'}
          onChange={handleChange}
          placeholder="Hellopeter 4.67"
        />
        
        <label htmlFor="brandText" style={sectionStyle}>Brand Text</label>
        <input
          type="text"
          id="brandText"
          name="brandText"
          value={productData.brandText || 'B SHOCKED'}
          onChange={handleChange}
          placeholder="B SHOCKED"
          style={inputStyle}
        />
        
        <label htmlFor="categoryText" style={sectionStyle}>Category Text</label>
        <input
          type="text"
          id="categoryText"
          name="categoryText"
          value={productData.categoryText || 'ELECTRICAL | SOLAR'}
          onChange={handleChange}
          placeholder="ELECTRICAL | SOLAR"
          style={inputStyle}
        />
      </div>

      {/* Main Title and SKU */}
      <div className="form-group">
        <h3>Product Title & SKU</h3>
        
        <label htmlFor="mainTitle">Main Title</label>
        <input
          type="text"
          id="mainTitle"
          name="mainTitle"
          value={productData.mainTitle || 'SOLAR KIT PACKAGE'}
          onChange={handleChange}
          placeholder="SOLAR KIT PACKAGE"
        />
        
        <label htmlFor="sku" style={sectionStyle}>SKU</label>
        <input
          type="text"
          id="sku"
          name="sku"
          value={productData.sku || 'RIIGDEYE-5KW-PACK'}
          onChange={handleChange}
          placeholder="RIIGDEYE-5KW-PACK"
          style={inputStyle}
        />
      </div>

      {/* Product Image Upload */}
      <div className="form-group">
        <h3>Product Image</h3>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag & drop an image here, or click to select one</p>
          {productData.image && (
            <div className="image-preview">
              <img 
                src={productData.image} 
                alt="Product preview" 
                style={{maxWidth: '200px', maxHeight: '150px'}} 
              />
            </div>
          )}
        </div>
        
        <label htmlFor="imageTitle" style={sectionStyle}>Image Title</label>
        <input
          type="text"
          id="imageTitle"
          name="imageTitle"
          value={productData.imageTitle || '5 Dyness BX 51100 Units'}
          onChange={handleChange}
          placeholder="5 Dyness BX 51100 Units"
          style={inputStyle}
        />
        
        <label htmlFor="secondaryDescription" style={sectionStyle}>Secondary Description</label>
        <input
          type="text"
          id="secondaryDescription"
          name="secondaryDescription"
          value={productData.secondaryDescription || 'Complete Solar Kit'}
          onChange={handleChange}
          placeholder="Complete Solar Kit"
          style={inputStyle}
        />
      </div>

      {/* Product Details Sections */}
      <div className="form-group">
        <h3>Power System Details</h3>
        <label htmlFor="powerDetail1">Power Detail 1</label>
        <input
          type="text"
          id="powerDetail1"
          name="powerDetail1"
          value={productData.powerDetail1 || '• 5kW Deye Hybrid Inverter'}
          onChange={handleChange}
          placeholder="• 5kW Deye Hybrid Inverter"
        />
        
        <label htmlFor="powerDetail2" style={sectionStyle}>Power Detail 2</label>
        <input
          type="text"
          id="powerDetail2"
          name="powerDetail2"
          value={productData.powerDetail2 || '• 5.12kWh Dyness Lithium Battery'}
          onChange={handleChange}
          placeholder="• 5.12kWh Dyness Lithium Battery"
          style={inputStyle}
        />
      </div>

      <div className="form-group">
        <h3>Solar Panel Details</h3>
        <label htmlFor="panelDetail1">Panel Detail 1</label>
        <input
          type="text"
          id="panelDetail1"
          name="panelDetail1"
          value={productData.panelDetail1 || '• 8x 565W JA Solar Mono Panels'}
          onChange={handleChange}
          placeholder="• 8x 565W JA Solar Mono Panels"
        />
        
        <label htmlFor="panelDetail2" style={sectionStyle}>Panel Detail 2</label>
        <input
          type="text"
          id="panelDetail2"
          name="panelDetail2"
          value={productData.panelDetail2 || '• 4.52kW Total Panel Capacity'}
          onChange={handleChange}
          placeholder="• 4.52kW Total Panel Capacity"
          style={inputStyle}
        />
      </div>

      <div className="form-group">
        <h3>Mounting Hardware</h3>
        <label htmlFor="mountDetail1">Mount Detail 1</label>
        <input
          type="text"
          id="mountDetail1"
          name="mountDetail1"
          value={productData.mountDetail1 || '• PV Rails, Roof Hooks, Clamps'}
          onChange={handleChange}
          placeholder="• PV Rails, Roof Hooks, Clamps"
        />
        
        <label htmlFor="mountDetail2" style={sectionStyle}>Mount Detail 2</label>
        <input
          type="text"
          id="mountDetail2"
          name="mountDetail2"
          value={productData.mountDetail2 || '• Complete Mounting System'}
          onChange={handleChange}
          placeholder="• Complete Mounting System"
          style={inputStyle}
        />
      </div>

      <div className="form-group">
        <h3>Electrical Components</h3>
        <label htmlFor="elecDetail1">Electrical Detail 1</label>
        <input
          type="text"
          id="elecDetail1"
          name="elecDetail1"
          value={productData.elecDetail1 || '• DC/AC Combiners, Surge Protection'}
          onChange={handleChange}
          placeholder="• DC/AC Combiners, Surge Protection"
        />
        
        <label htmlFor="elecDetail2" style={sectionStyle}>Electrical Detail 2</label>
        <input
          type="text"
          id="elecDetail2"
          name="elecDetail2"
          value={productData.elecDetail2 || '• Fuses, Switches, Safety Equipment'}
          onChange={handleChange}
          placeholder="• Fuses, Switches, Safety Equipment"
          style={inputStyle}
        />
      </div>

      {/* NEW: Cables & Installation Section */}
      <div className="form-group">
        <h3>Cables & Installation</h3>
        <label htmlFor="cableDetail1">Cable Detail 1</label>
        <input
          type="text"
          id="cableDetail1"
          name="cableDetail1"
          value={productData.cableDetail1 || '• Solar Cables, Battery Cables, MC4'}
          onChange={handleChange}
          placeholder="• Solar Cables, Battery Cables, MC4"
        />
        
        <label htmlFor="cableDetail2" style={sectionStyle}>Cable Detail 2</label>
        <input
          type="text"
          id="cableDetail2"
          name="cableDetail2"
          value={productData.cableDetail2 || '• Conduits, Trunking, Earth Spike'}
          onChange={handleChange}
          placeholder="• Conduits, Trunking, Earth Spike"
          style={inputStyle}
        />
      </div>

      {/* NEW: Warranty & Specs Section */}
      <div className="form-group">
        <h3>Warranty & Specs</h3>
        <label htmlFor="warrantyDetail1">Warranty Detail 1</label>
        <input
          type="text"
          id="warrantyDetail1"
          name="warrantyDetail1"
          value={productData.warrantyDetail1 || '• 25yr Panels, 10yr Inverter & Battery'}
          onChange={handleChange}
          placeholder="• 25yr Panels, 10yr Inverter & Battery"
        />
        
        <label htmlFor="warrantyDetail2" style={sectionStyle}>Warranty Detail 2</label>
        <input
          type="text"
          id="warrantyDetail2"
          name="warrantyDetail2"
          value={productData.warrantyDetail2 || '• Grid-Tie Hybrid, Professional Install'}
          onChange={handleChange}
          placeholder="• Grid-Tie Hybrid, Professional Install"
          style={inputStyle}
        />
      </div>

      {/* NEW: Expected Performance Section */}
      <div className="form-group">
        <h3>Expected Performance</h3>
        <label htmlFor="performanceDetail1">Performance Detail 1</label>
        <input
          type="text"
          id="performanceDetail1"
          name="performanceDetail1"
          value={productData.performanceDetail1 || '• ~1,800kWh/month Generation'}
          onChange={handleChange}
          placeholder="• ~1,800kWh/month Generation"
        />
        
        <label htmlFor="performanceDetail2" style={sectionStyle}>Performance Detail 2</label>
        <input
          type="text"
          id="performanceDetail2"
          name="performanceDetail2"
          value={productData.performanceDetail2 || '• 85% Energy Independence'}
          onChange={handleChange}
          placeholder="• 85% Energy Independence"
          style={inputStyle}
        />
      </div>

      {/* Description Section */}
      <div className="form-group">
        <h3>Product Description</h3>
        <label htmlFor="descriptionTitle">Description Title</label>
        <input
          type="text"
          id="descriptionTitle"
          name="descriptionTitle"
          value={productData.descriptionTitle || 'COMPLETE SOLAR KIT'}
          onChange={handleChange}
          placeholder="COMPLETE SOLAR KIT"
        />
        
        {[1, 2, 3, 4, 5, 6].map(index => {
          const fieldName = `descriptionLine${index}`;
          const placeholders = [
            'Everything you need for a',
            'professional solar installation.',
            'Hybrid system with battery',
            'backup for load-shedding',
            'protection and energy',
            'independence.'
          ];
          
          return (
            <div key={fieldName} style={sectionStyle}>
              <label htmlFor={fieldName}>Description Line {index}</label>
              <input
                type="text"
                id={fieldName}
                name={fieldName}
                value={productData[fieldName] || ''}
                onChange={handleChange}
                placeholder={placeholders[index - 1]}
                style={inputStyle}
              />
            </div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="form-group">
        <h3>System Benefits</h3>
        {[1, 2, 3, 4, 5].map(index => {
          const fieldName = `benefit${index}`;
          const placeholders = [
            '✓ Load Shedding Protection',
            '✓ Reduce Electricity Bills',
            '✓ Eco-Friendly Power',
            '✓ Professional Support',
            '✓ Complete Installation Kit'
          ];
          
          return (
            <div key={fieldName} style={index === 1 ? {} : sectionStyle}>
              <label htmlFor={fieldName}>Benefit {index}</label>
              <input
                type="text"
                id={fieldName}
                name={fieldName}
                value={productData[fieldName] || ''}
                onChange={handleChange}
                placeholder={placeholders[index - 1]}
                style={inputStyle}
              />
            </div>
          );
        })}
      </div>

      {/* Price Section */}
      <div className="form-group">
        <h3>Price Information</h3>
        <label htmlFor="priceHeader">Price Header</label>
        <input
          type="text"
          id="priceHeader"
          name="priceHeader"
          value={productData.priceHeader || 'Incl. VAT'}
          onChange={handleChange}
          placeholder="Incl. VAT"
        />
        
        <label htmlFor="priceAmount" style={sectionStyle}>Price Amount</label>
        <input
          type="text"
          id="priceAmount"
          name="priceAmount"
          value={productData.priceAmount || 'R51,779.35'}
          onChange={handleChange}
          placeholder="R51,779.35"
          style={inputStyle}
        />
        
        <label htmlFor="priceNote" style={sectionStyle}>Price Note</label>
        <input
          type="text"
          id="priceNote"
          name="priceNote"
          value={productData.priceNote || 'Professional Installation Available'}
          onChange={handleChange}
          placeholder="Professional Installation Available"
          style={inputStyle}
        />
      </div>

      {/* NEW: Delivery Information Section */}
      <div className="form-group">
        <h3>Delivery Information</h3>
        <label htmlFor="delivery1">Delivery Option 1</label>
        <input
          type="text"
          id="delivery1"
          name="delivery1"
          value={productData.delivery1 || 'Delivery JHB free up to 20 km'}
          onChange={handleChange}
          placeholder="Delivery JHB free up to 20 km"
        />
        
        <label htmlFor="delivery2" style={sectionStyle}>Delivery Option 2</label>
        <input
          type="text"
          id="delivery2"
          name="delivery2"
          value={productData.delivery2 || 'Delivery 60-100 km JHB R440 fee'}
          onChange={handleChange}
          placeholder="Delivery 60-100 km JHB R440 fee"
          style={inputStyle}
        />
        
        <label htmlFor="delivery3" style={sectionStyle}>Delivery Option 3</label>
        <input
          type="text"
          id="delivery3"
          name="delivery3"
          value={productData.delivery3 || 'Fee for other regions calculated'}
          onChange={handleChange}
          placeholder="Fee for other regions calculated"
          style={inputStyle}
        />
      </div>

      {/* Contact Information */}
      <div className="form-group">
        <h3>Contact Information</h3>
        <label htmlFor="contactPhone1">Phone 1</label>
        <input
          type="text"
          id="contactPhone1"
          name="contactPhone1"
          value={productData.contactPhone1 || '011 568 7166'}
          onChange={handleChange}
          placeholder="011 568 7166"
        />
        
        <label htmlFor="contactPhone2" style={sectionStyle}>Phone 2</label>
        <input
          type="text"
          id="contactPhone2"
          name="contactPhone2"
          value={productData.contactPhone2 || '067 923 8166'}
          onChange={handleChange}
          placeholder="067 923 8166"
          style={inputStyle}
        />
        
        <label htmlFor="contactEmail" style={sectionStyle}>Email</label>
        <input
          type="text"
          id="contactEmail"
          name="contactEmail"
          value={productData.contactEmail || 'sales@bshockedelectrical.co.za'}
          onChange={handleChange}
          placeholder="sales@bshockedelectrical.co.za"
          style={inputStyle}
        />
        
        <label htmlFor="contactWebsite" style={sectionStyle}>Website</label>
        <input
          type="text"
          id="contactWebsite"
          name="contactWebsite"
          value={productData.contactWebsite || 'https://bshockedelectrical.co.za'}
          onChange={handleChange}
          placeholder="https://bshockedelectrical.co.za"
          style={inputStyle}
        />
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
