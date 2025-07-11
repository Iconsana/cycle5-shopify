import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractColors } from '../../services/productService';

const ProductForm = ({ productData, onProductChange }) => {
  const [colorPalette, setColorPalette] = useState([]);
  
  // State to track which sections are visible
  const [sectionVisibility, setSectionVisibility] = useState({
    header: true,
    titleSku: true,
    productImage: true,
    powerSystem: true,
    solarPanels: true,
    mountingHardware: true,
    electricalComponents: true,
    cablesInstallation: true,
    warrantySpecs: true,        // This can be hidden per request
    expectedPerformance: true,  // This can be hidden per request
    productDescription: true,
    systemBenefits: true,
    priceInformation: true,
    deliveryInformation: true,
    contactInformation: true
  });
  
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
  
  // Toggle section visibility
  const toggleSection = (sectionKey) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  
  const inputStyle = { marginTop: '4px' };
  const sectionStyle = { marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #e1e1e1' };
  const fieldStyle = { marginTop: '8px' };
  
  // Section toggle button style
  const toggleButtonStyle = {
    background: 'none',
    border: '1px solid #007bff',
    color: '#007bff',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '10px'
  };
  
  // Section header style
  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px'
  };
  
  // Render section with toggle
  const renderSection = (sectionKey, title, content, highlighted = false) => {
    const isVisible = sectionVisibility[sectionKey];
    const sectionClasses = highlighted ? 
      {...sectionStyle, backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px'} : 
      sectionStyle;
    
    return (
      <div className="form-group" style={sectionClasses}>
        <div style={sectionHeaderStyle}>
          <h3 style={highlighted ? {color: '#0056b3'} : {}}>{title}</h3>
          <button
            type="button"
            onClick={() => toggleSection(sectionKey)}
            style={{
              ...toggleButtonStyle,
              backgroundColor: isVisible ? '#007bff' : 'transparent',
              color: isVisible ? 'white' : '#007bff'
            }}
          >
            {isVisible ? 'Hide' : 'Show'}
          </button>
        </div>
        {isVisible && content}
      </div>
    );
  };
  
  return (
    <div className="product-form">
      {/* Header Fields */}
      {renderSection('header', 'Header Information', (
        <>
          <label htmlFor="ratingText">Rating Text</label>
          <input
            type="text"
            id="ratingText"
            name="ratingText"
            value={productData.ratingText || ''}
            onChange={handleChange}
            placeholder="Hellopeter 4.67"
          />
          
          <label htmlFor="brandText" style={fieldStyle}>Brand Text</label>
          <input
            type="text"
            id="brandText"
            name="brandText"
            value={productData.brandText || ''}
            onChange={handleChange}
            placeholder="B SHOCKED"
            style={inputStyle}
          />
          
          <label htmlFor="categoryText" style={fieldStyle}>Category Text</label>
          <input
            type="text"
            id="categoryText"
            name="categoryText"
            value={productData.categoryText || ''}
            onChange={handleChange}
            placeholder="ELECTRICAL | SOLAR"
            style={inputStyle}
          />
        </>
      ))}

      {/* Main Title and SKU */}
      {renderSection('titleSku', 'Product Title & SKU', (
        <>
          <label htmlFor="mainTitle">Main Title</label>
          <input
            type="text"
            id="mainTitle"
            name="mainTitle"
            value={productData.mainTitle || ''}
            onChange={handleChange}
            placeholder="SOLAR KIT PACKAGE"
          />
          
          <label htmlFor="sku" style={fieldStyle}>SKU</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={productData.sku || ''}
            onChange={handleChange}
            placeholder="RIIGDEYE-5KW-PACK"
            style={inputStyle}
          />
        </>
      ))}

      {/* Product Image Upload */}
      {renderSection('productImage', 'Product Image', (
        <>
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
          
          <label htmlFor="imageTitle" style={fieldStyle}>Image Title</label>
          <input
            type="text"
            id="imageTitle"
            name="imageTitle"
            value={productData.imageTitle || ''}
            onChange={handleChange}
            placeholder="5 Dyness BX 51100 Units"
            style={inputStyle}
          />
          
          <label htmlFor="secondaryDescription" style={fieldStyle}>Secondary Description</label>
          <input
            type="text"
            id="secondaryDescription"
            name="secondaryDescription"
            value={productData.secondaryDescription || ''}
            onChange={handleChange}
            placeholder="Complete Solar Kit"
            style={inputStyle}
          />
        </>
      ))}

      {/* Power System Details */}
      {renderSection('powerSystem', 'Power System Details', (
        <>
          <label htmlFor="powerDetail1">Power Detail 1</label>
          <input
            type="text"
            id="powerDetail1"
            name="powerDetail1"
            value={productData.powerDetail1 || ''}
            onChange={handleChange}
            placeholder="• 5kW Deye Hybrid Inverter"
          />
          
          <label htmlFor="powerDetail2" style={fieldStyle}>Power Detail 2</label>
          <input
            type="text"
            id="powerDetail2"
            name="powerDetail2"
            value={productData.powerDetail2 || ''}
            onChange={handleChange}
            placeholder="• 5.12kWh Dyness Lithium Battery"
            style={inputStyle}
          />
        </>
      ))}

      {/* Solar Panel Details */}
      {renderSection('solarPanels', 'Solar Panel Details', (
        <>
          <label htmlFor="panelDetail1">Panel Detail 1</label>
          <input
            type="text"
            id="panelDetail1"
            name="panelDetail1"
            value={productData.panelDetail1 || ''}
            onChange={handleChange}
            placeholder="• 8x 565W JA Solar Mono Panels"
          />
          
          <label htmlFor="panelDetail2" style={fieldStyle}>Panel Detail 2 (Optional - can be hidden)</label>
          <input
            type="text"
            id="panelDetail2"
            name="panelDetail2"
            value={productData.panelDetail2 || ''}
            onChange={handleChange}
            placeholder="• 4.52kW Total Panel Capacity"
            style={inputStyle}
          />
          <small style={{color: '#666', fontSize: '12px'}}>
            💡 Tip: You can hide Panel Detail 2 by clearing this field and using the Hide button above
          </small>
        </>
      ))}

      {/* Mounting Hardware */}
      {renderSection('mountingHardware', 'Mounting Hardware', (
        <>
          <label htmlFor="mountDetail1">Mount Detail 1</label>
          <input
            type="text"
            id="mountDetail1"
            name="mountDetail1"
            value={productData.mountDetail1 || ''}
            onChange={handleChange}
            placeholder="• PV Rails, Roof Hooks, Clamps"
          />
          
          <label htmlFor="mountDetail2" style={fieldStyle}>Mount Detail 2</label>
          <input
            type="text"
            id="mountDetail2"
            name="mountDetail2"
            value={productData.mountDetail2 || ''}
            onChange={handleChange}
            placeholder="• Complete Mounting System"
            style={inputStyle}
          />
        </>
      ))}

      {/* Electrical Components */}
      {renderSection('electricalComponents', 'Electrical Components', (
        <>
          <label htmlFor="elecDetail1">Electrical Detail 1</label>
          <input
            type="text"
            id="elecDetail1"
            name="elecDetail1"
            value={productData.elecDetail1 || ''}
            onChange={handleChange}
            placeholder="• DC/AC Combiners, Surge Protection"
          />
          
          <label htmlFor="elecDetail2" style={fieldStyle}>Electrical Detail 2</label>
          <input
            type="text"
            id="elecDetail2"
            name="elecDetail2"
            value={productData.elecDetail2 || ''}
            onChange={handleChange}
            placeholder="• Fuses, Switches, Safety Equipment"
            style={inputStyle}
          />
        </>
      ))}

      {/* CABLES & INSTALLATION SECTION */}
      {renderSection('cablesInstallation', '🔌 Cables & Installation', (
        <>
          <label htmlFor="cableDetail1">Cable Detail 1</label>
          <input
            type="text"
            id="cableDetail1"
            name="cableDetail1"
            value={productData.cableDetail1 || ''}
            onChange={handleChange}
            placeholder="• Solar Cables, Battery Cables, MC4"
          />
          
          <label htmlFor="cableDetail2" style={fieldStyle}>Cable Detail 2</label>
          <input
            type="text"
            id="cableDetail2"
            name="cableDetail2"
            value={productData.cableDetail2 || ''}
            onChange={handleChange}
            placeholder="• Conduits, Trunking, Earth Spike"
            style={inputStyle}
          />
        </>
      ), true)}

      {/* WARRANTY & SPECS SECTION - Can be hidden per management request */}
      {renderSection('warrantySpecs', '📋 Warranty & Specs (Can be hidden)', (
        <>
          <label htmlFor="warrantyDetail1">Warranty Detail 1</label>
          <input
            type="text"
            id="warrantyDetail1"
            name="warrantyDetail1"
            value={productData.warrantyDetail1 || ''}
            onChange={handleChange}
            placeholder="• 25yr Panels, 10yr Inverter & Battery"
          />
          
          <label htmlFor="warrantyDetail2" style={fieldStyle}>Warranty Detail 2</label>
          <input
            type="text"
            id="warrantyDetail2"
            name="warrantyDetail2"
            value={productData.warrantyDetail2 || ''}
            onChange={handleChange}
            placeholder="• Grid-Tie Hybrid, Professional Install"
            style={inputStyle}
          />
          
          <div style={{marginTop: '10px', padding: '8px', backgroundColor: '#fff3cd', borderRadius: '4px'}}>
            <small style={{color: '#856404'}}>
              ⚠️ Management Note: This section can be hidden using the Hide button above
            </small>
          </div>
        </>
      ), true)}

      {/* EXPECTED PERFORMANCE SECTION - Can be hidden per management request */}
      {renderSection('expectedPerformance', '⚡ Expected Performance (Can be hidden)', (
        <>
          <label htmlFor="performanceDetail1">Performance Detail 1</label>
          <input
            type="text"
            id="performanceDetail1"
            name="performanceDetail1"
            value={productData.performanceDetail1 || ''}
            onChange={handleChange}
            placeholder="• ~1,800kWh/month Generation"
          />
          
          <label htmlFor="performanceDetail2" style={fieldStyle}>Performance Detail 2</label>
          <input
            type="text"
            id="performanceDetail2"
            name="performanceDetail2"
            value={productData.performanceDetail2 || ''}
            onChange={handleChange}
            placeholder="• 85% Energy Independence"
            style={inputStyle}
          />
          
          <div style={{marginTop: '10px', padding: '8px', backgroundColor: '#fff3cd', borderRadius: '4px'}}>
            <small style={{color: '#856404'}}>
              ⚠️ Management Note: This section can be hidden using the Hide button above
            </small>
          </div>
        </>
      ), true)}

      {/* Description Section */}
      {renderSection('productDescription', 'Product Description', (
        <>
          <label htmlFor="descriptionTitle">Description Title</label>
          <input
            type="text"
            id="descriptionTitle"
            name="descriptionTitle"
            value={productData.descriptionTitle || ''}
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
              <div key={fieldName} style={fieldStyle}>
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
        </>
      ))}

      {/* Benefits Section */}
      {renderSection('systemBenefits', 'System Benefits', (
        <>
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
              <div key={fieldName} style={index === 1 ? {} : fieldStyle}>
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
        </>
      ))}

      {/* Price Section */}
      {renderSection('priceInformation', 'Price Information', (
        <>
          <label htmlFor="priceHeader">Price Header</label>
          <input
            type="text"
            id="priceHeader"
            name="priceHeader"
            value={productData.priceHeader || ''}
            onChange={handleChange}
            placeholder="Incl. VAT"
          />
          
          <label htmlFor="priceAmount" style={fieldStyle}>Price Amount</label>
          <input
            type="text"
            id="priceAmount"
            name="priceAmount"
            value={productData.priceAmount || ''}
            onChange={handleChange}
            placeholder="R51,779.35"
            style={inputStyle}
          />
          
          <label htmlFor="priceNote" style={fieldStyle}>Price Note</label>
          <input
            type="text"
            id="priceNote"
            name="priceNote"
            value={productData.priceNote || ''}
            onChange={handleChange}
            placeholder="Professional Installation Available"
            style={inputStyle}
          />
        </>
      ))}

      {/* DELIVERY INFORMATION SECTION */}
      {renderSection('deliveryInformation', '🚚 Delivery Information', (
        <>
          <label htmlFor="delivery1">Delivery Option 1</label>
          <input
            type="text"
            id="delivery1"
            name="delivery1"
            value={productData.delivery1 || ''}
            onChange={handleChange}
            placeholder="Delivery JHB free up to 20 km"
          />
          
          <label htmlFor="delivery2" style={fieldStyle}>Delivery Option 2</label>
          <input
            type="text"
            id="delivery2"
            name="delivery2"
            value={productData.delivery2 || ''}
            onChange={handleChange}
            placeholder="Delivery 60-100 km JHB R440 fee"
            style={inputStyle}
          />
          
          <label htmlFor="delivery3" style={fieldStyle}>Delivery Option 3</label>
          <input
            type="text"
            id="delivery3"
            name="delivery3"
            value={productData.delivery3 || ''}
            onChange={handleChange}
            placeholder="Fee for other regions calculated"
            style={inputStyle}
          />
        </>
      ), true)}

      {/* Contact Information */}
      {renderSection('contactInformation', 'Contact Information', (
        <>
          <label htmlFor="contactPhone1">Phone 1</label>
          <input
            type="text"
            id="contactPhone1"
            name="contactPhone1"
            value={productData.contactPhone1 || ''}
            onChange={handleChange}
            placeholder="011 568 7166"
          />
          
          <label htmlFor="contactPhone2" style={fieldStyle}>Phone 2</label>
          <input
            type="text"
            id="contactPhone2"
            name="contactPhone2"
            value={productData.contactPhone2 || ''}
            onChange={handleChange}
            placeholder="067 923 8166"
            style={inputStyle}
          />
          
          <label htmlFor="contactEmail" style={fieldStyle}>Email</label>
          <input
            type="text"
            id="contactEmail"
            name="contactEmail"
            value={productData.contactEmail || ''}
            onChange={handleChange}
            placeholder="sales@bshockedelectrical.co.za"
            style={inputStyle}
          />
          
          <label htmlFor="contactWebsite" style={fieldStyle}>Website</label>
          <input
            type="text"
            id="contactWebsite"
            name="contactWebsite"
            value={productData.contactWebsite || ''}
            onChange={handleChange}
            placeholder="https://bshockedelectrical.co.za"
            style={inputStyle}
          />
        </>
      ))}
      
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

      {/* Quick Action Buttons */}
      <div style={{marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
        <h4>Quick Actions</h4>
        <button
          type="button"
          onClick={() => {
            setSectionVisibility(prev => ({
              ...prev,
              warrantySpecs: false,
              expectedPerformance: false
            }));
          }}
          style={{
            ...toggleButtonStyle,
            backgroundColor: '#dc3545',
            color: 'white',
            marginRight: '10px'
          }}
        >
          Hide Management Requested Sections
        </button>
        
        <button
          type="button"
          onClick={() => {
            setSectionVisibility(prev => {
              const newState = {};
              Object.keys(prev).forEach(key => {
                newState[key] = true;
              });
              return newState;
            });
          }}
          style={{
            ...toggleButtonStyle,
            backgroundColor: '#28a745',
            color: 'white'
          }}
        >
          Show All Sections
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
