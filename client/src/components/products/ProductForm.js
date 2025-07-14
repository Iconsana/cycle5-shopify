import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractColors } from '../../services/productService';

const ProductForm = ({ productData, onProductChange }) => {
  const [colorPalette, setColorPalette] = useState([]);
  
  // State to track which individual fields are hidden
  const [hiddenFields, setHiddenFields] = useState({});
  
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
  
  // Toggle individual field visibility
  const toggleFieldVisibility = (fieldName) => {
    setHiddenFields(prev => {
      const newHiddenFields = { ...prev };
      if (newHiddenFields[fieldName]) {
        delete newHiddenFields[fieldName];
      } else {
        newHiddenFields[fieldName] = true;
      }
      
      // When hiding a field, also clear its data so it doesn't appear in template
      if (newHiddenFields[fieldName]) {
        onProductChange({ [fieldName]: '' });
      }
      
      return newHiddenFields;
    });
  };
  
  // Toggle section visibility
  const toggleSection = (sectionKey) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  
  // Check if field is hidden
  const isFieldHidden = (fieldName) => hiddenFields[fieldName];
  
  // Get filtered product data (excluding hidden fields)
  const getVisibleProductData = () => {
    const filteredData = { ...productData };
    Object.keys(hiddenFields).forEach(fieldName => {
      if (hiddenFields[fieldName]) {
        delete filteredData[fieldName];
      }
    });
    return filteredData;
  };
  
  // Pass the filtered data to parent
  React.useEffect(() => {
    const visibleData = getVisibleProductData();
    if (JSON.stringify(visibleData) !== JSON.stringify(productData)) {
      // Only update if there's a real difference to avoid infinite loops
      const hiddenFieldNames = Object.keys(hiddenFields).filter(f => hiddenFields[f]);
      if (hiddenFieldNames.length > 0) {
        onProductChange(visibleData);
      }
    }
  }, [hiddenFields]);
  
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
  
  // Field toggle button style
  const fieldToggleStyle = {
    background: 'none',
    border: '1px solid #dc3545',
    color: '#dc3545',
    padding: '2px 6px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '10px',
    marginLeft: '8px'
  };
  
  // Section header style
  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px'
  };
  
  // Field container style
  const fieldContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px'
  };
  
  // Render individual field with hide button
  const renderField = (fieldName, label, placeholder, style = {}) => {
    const hidden = isFieldHidden(fieldName);
    
    return (
      <div style={fieldContainerStyle}>
        <div style={{ flex: 1 }}>
          <label htmlFor={fieldName}>{label}</label>
          <input
            type="text"
            id={fieldName}
            name={fieldName}
            value={hidden ? '' : (productData[fieldName] || '')}
            onChange={handleChange}
            placeholder={placeholder}
            style={{ ...inputStyle, ...style, opacity: hidden ? 0.5 : 1 }}
            disabled={hidden}
          />
        </div>
        <button
          type="button"
          onClick={() => toggleFieldVisibility(fieldName)}
          style={{
            ...fieldToggleStyle,
            backgroundColor: hidden ? '#dc3545' : 'transparent',
            color: hidden ? 'white' : '#dc3545'
          }}
          title={hidden ? 'Show field' : 'Hide field'}
        >
          {hidden ? 'Show' : 'Hide'}
        </button>
      </div>
    );
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
            {isVisible ? 'Hide Section' : 'Show Section'}
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
          {renderField('ratingText', 'Rating Text', 'Hellopeter 4.67')}
          {renderField('brandText', 'Brand Text', 'B SHOCKED', fieldStyle)}
          {renderField('categoryText', 'Category Text', 'ELECTRICAL | SOLAR', fieldStyle)}
        </>
      ))}

      {/* Main Title and SKU */}
      {renderSection('titleSku', 'Product Title & SKU', (
        <>
          {renderField('mainTitle', 'Main Title', 'SOLAR KIT PACKAGE')}
          {renderField('sku', 'SKU', 'RIIGDEYE-5KW-PACK', fieldStyle)}
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
          
          {renderField('imageTitle', 'Image Title', '5 Dyness BX 51100 Units', fieldStyle)}
          {renderField('secondaryDescription', 'Secondary Description', 'Complete Solar Kit', fieldStyle)}
        </>
      ))}

      {/* Power System Details */}
      {renderSection('powerSystem', 'Power System Details', (
        <>
          {renderField('powerDetail1', 'Power Detail 1', '• 5kW Deye Hybrid Inverter')}
          {renderField('powerDetail2', 'Power Detail 2', '• 5.12kWh Dyness Lithium Battery', fieldStyle)}
        </>
      ))}

      {/* Solar Panel Details - ONLY Panel Detail 1 */}
      {renderSection('solarPanels', 'Solar Panel Details', (
        <>
          {renderField('panelDetail1', 'Panel Detail 1', '• 8x 565W JA Solar Mono Panels')}
          <small style={{color: '#28a745', fontSize: '12px', display: 'block', marginTop: '8px'}}>
            ✅ Panel Detail 2 (Total Capacity) has been removed per management request
          </small>
        </>
      ))}

      {/* Mounting Hardware */}
      {renderSection('mountingHardware', 'Mounting Hardware', (
        <>
          {renderField('mountDetail1', 'Mount Detail 1', '• PV Rails, Roof Hooks, Clamps')}
          {renderField('mountDetail2', 'Mount Detail 2', '• Complete Mounting System', fieldStyle)}
        </>
      ))}

      {/* Electrical Components */}
      {renderSection('electricalComponents', 'Electrical Components', (
        <>
          {renderField('elecDetail1', 'Electrical Detail 1', '• DC/AC Combiners, Surge Protection')}
          {renderField('elecDetail2', 'Electrical Detail 2', '• Fuses, Switches, Safety Equipment', fieldStyle)}
        </>
      ))}

      {/* CABLES & INSTALLATION SECTION */}
      {renderSection('cablesInstallation', '🔌 Cables & Installation', (
        <>
          {renderField('cableDetail1', 'Cable Detail 1', '• Solar Cables, Battery Cables, MC4')}
          {renderField('cableDetail2', 'Cable Detail 2', '• Conduits, Trunking, Earth Spike', fieldStyle)}
        </>
      ), true)}

      {/* REMOVED SECTIONS NOTICE */}
      <div style={{...sectionStyle, backgroundColor: '#d4edda', padding: '15px', borderRadius: '8px', border: '1px solid #c3e6cb'}}>
        <h4 style={{color: '#155724', marginBottom: '10px'}}>✅ Removed Sections (Per Management Request)</h4>
        <ul style={{color: '#155724', margin: 0, paddingLeft: '20px'}}>
          <li>Warranty & Specs section - completely removed</li>
          <li>Expected Performance section - completely removed</li>
          <li>Panel Detail 2 field - completely removed</li>
        </ul>
        <small style={{color: '#155724', fontSize: '12px', display: 'block', marginTop: '8px'}}>
          These sections will not appear in the template or exports.
        </small>
      </div>

      {/* Description Section */}
      {renderSection('productDescription', 'Product Description', (
        <>
          {renderField('descriptionTitle', 'Description Title', 'COMPLETE SOLAR KIT')}
          
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
                {renderField(fieldName, `Description Line ${index}`, placeholders[index - 1])}
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
                {renderField(fieldName, `Benefit ${index}`, placeholders[index - 1])}
              </div>
            );
          })}
        </>
      ))}

      {/* Price Section */}
      {renderSection('priceInformation', 'Price Information', (
        <>
          {renderField('priceHeader', 'Price Header', 'Incl. VAT')}
          {renderField('priceAmount', 'Price Amount', 'R51,779.35', fieldStyle)}
          {renderField('priceNote', 'Price Note', 'Professional Installation Available', fieldStyle)}
        </>
      ))}

      {/* DELIVERY INFORMATION SECTION */}
      {renderSection('deliveryInformation', '🚚 Delivery Information', (
        <>
          {renderField('delivery1', 'Delivery Option 1', 'Delivery JHB free up to 20 km')}
          {renderField('delivery2', 'Delivery Option 2', 'Delivery 60-100 km JHB R440 fee', fieldStyle)}
          {renderField('delivery3', 'Delivery Option 3', 'Fee for other regions calculated', fieldStyle)}
        </>
      ), true)}

      {/* Contact Information */}
      {renderSection('contactInformation', 'Contact Information', (
        <>
          {renderField('contactPhone1', 'Phone 1', '011 568 7166')}
          {renderField('contactPhone2', 'Phone 2', '067 923 8166', fieldStyle)}
          {renderField('contactEmail', 'Email', 'sales@bshockedelectrical.co.za', fieldStyle)}
          {renderField('contactWebsite', 'Website', 'https://bshockedelectrical.co.za', fieldStyle)}
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
        <div style={{marginBottom: '10px'}}>
          <button
            type="button"
            onClick={() => {
              setHiddenFields({});
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
            Show All Fields & Sections
          </button>
        </div>
        
        <div style={{fontSize: '12px', color: '#666'}}>
          Hidden fields: {Object.keys(hiddenFields).filter(f => hiddenFields[f]).length > 0 ? 
            Object.keys(hiddenFields).filter(f => hiddenFields[f]).join(', ') : 'None'}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
