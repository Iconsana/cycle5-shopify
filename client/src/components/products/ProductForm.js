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
    additionalParts: true, // New section
    productDescription: true,
    systemBenefits: true,
    priceInformation: true,
    deliveryInformation: true,
    contactInformation: true
  });

  // State to track dynamic field counts per category
  const [categoryFieldCounts, setCategoryFieldCounts] = useState({
    powerSystem: 2,
    solarPanels: 1,
    mountingHardware: 2,
    electricalComponents: 2,
    cablesInstallation: 2,
    additionalParts: 0 // Start with 0, user can add up to 10
  });

  // Maximum fields per category
  const maxFields = {
    powerSystem: 3,
    solarPanels: 2,
    mountingHardware: 3,
    electricalComponents: 3,
    cablesInstallation: 3,
    additionalParts: 10
  };
  
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

  // Add field to category
  const addFieldToCategory = (category) => {
    setCategoryFieldCounts(prev => ({
      ...prev,
      [category]: Math.min(prev[category] + 1, maxFields[category])
    }));
  };

  // Remove field from category
  const removeFieldFromCategory = (category) => {
    setCategoryFieldCounts(prev => {
      const newCount = Math.max(prev[category] - 1, category === 'additionalParts' ? 0 : 1);
      
      // Clear the data for the removed field
      const fieldToRemove = `${category}Detail${prev[category]}`;
      if (category === 'additionalParts') {
        const fieldToRemove = `additionalPart${prev[category]}`;
        onProductChange({ [fieldToRemove]: '' });
      } else {
        onProductChange({ [fieldToRemove]: '' });
      }
      
      return {
        ...prev,
        [category]: newCount
      };
    });
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
  const sectionStyle = { marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e1e1e1' };
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

  // Add/Remove button styles
  const addButtonStyle = {
    background: '#28a745',
    border: 'none',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '10px'
  };

  const removeButtonStyle = {
    background: '#dc3545',
    border: 'none',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '5px'
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

  // Render dynamic category fields
  const renderCategoryFields = (category, baseLabel, placeholders) => {
    const fieldCount = categoryFieldCounts[category];
    const fields = [];
    
    for (let i = 1; i <= fieldCount; i++) {
      const fieldName = `${category}Detail${i}`;
      const label = `${baseLabel} ${i}`;
      const placeholder = placeholders[i - 1] || `Enter ${baseLabel.toLowerCase()} ${i}`;
      
      fields.push(
        <div key={fieldName} style={i === 1 ? {} : fieldStyle}>
          {renderField(fieldName, label, placeholder)}
        </div>
      );
    }
    
    return (
      <div>
        {fields}
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
          {fieldCount < maxFields[category] && (
            <button
              type="button"
              onClick={() => addFieldToCategory(category)}
              style={addButtonStyle}
              title={`Add another ${baseLabel.toLowerCase()}`}
            >
              + Add {baseLabel}
            </button>
          )}
          {fieldCount > (category === 'additionalParts' ? 0 : 1) && (
            <button
              type="button"
              onClick={() => removeFieldFromCategory(category)}
              style={removeButtonStyle}
              title={`Remove last ${baseLabel.toLowerCase()}`}
            >
              - Remove
            </button>
          )}
          <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
            {fieldCount}/{maxFields[category]} fields
          </span>
        </div>
      </div>
    );
  };

  // Render additional parts section
  const renderAdditionalParts = () => {
    const fieldCount = categoryFieldCounts.additionalParts;
    const fields = [];
    
    for (let i = 1; i <= fieldCount; i++) {
      const fieldName = `additionalPart${i}`;
      const label = `Additional Part ${i}`;
      const placeholder = `• Additional component or material`;
      
      fields.push(
        <div key={fieldName} style={i === 1 ? {} : fieldStyle}>
          {renderField(fieldName, label, placeholder)}
        </div>
      );
    }
    
    return (
      <div>
        {fieldCount === 0 && (
          <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '10px' }}>
            Add extra components, consumables, or materials not covered in the main categories above.
          </p>
        )}
        {fields}
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
          {fieldCount < maxFields.additionalParts && (
            <button
              type="button"
              onClick={() => addFieldToCategory('additionalParts')}
              style={addButtonStyle}
              title="Add additional part"
            >
              + Add Additional Part
            </button>
          )}
          {fieldCount > 0 && (
            <button
              type="button"
              onClick={() => removeFieldFromCategory('additionalParts')}
              style={removeButtonStyle}
              title="Remove last additional part"
            >
              - Remove
            </button>
          )}
          <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
            {fieldCount}/{maxFields.additionalParts} additional parts
          </span>
        </div>
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
          
          {renderField('imageTitle', 'Image Title', 'Solar Kit Components', fieldStyle)}
          {renderField('secondaryDescription', 'Secondary Description', 'Complete Installation Package', fieldStyle)}
        </>
      ))}

      {/* Expandable Power System Details */}
      {renderSection('powerSystem', 'Power System Details', (
        renderCategoryFields('powerSystem', 'Power Detail', [
          '• 5kW Deye Hybrid Inverter',
          '• 5.12kWh Dyness Lithium Battery',
          '• Additional power component'
        ])
      ))}

      {/* Expandable Solar Panel Details */}
      {renderSection('solarPanels', 'Solar Panel Details', (
        renderCategoryFields('solarPanels', 'Panel Detail', [
          '• 8x 565W JA Solar Mono Panels',
          '• 4.52kW Total Panel Capacity'
        ])
      ))}

      {/* Expandable Mounting Hardware */}
      {renderSection('mountingHardware', 'Mounting Hardware', (
        renderCategoryFields('mountingHardware', 'Mount Detail', [
          '• PV Rails, Roof Hooks, Clamps',
          '• Complete Mounting System',
          '• Additional mounting hardware'
        ])
      ))}

      {/* Expandable Electrical Components */}
      {renderSection('electricalComponents', 'Electrical Components', (
        renderCategoryFields('electricalComponents', 'Electrical Detail', [
          '• DC/AC Combiners, Surge Protection',
          '• Fuses, Switches, Safety Equipment',
          '• Additional electrical components'
        ])
      ))}

      {/* Expandable Cables & Installation */}
      {renderSection('cablesInstallation', '🔌 Cables & Installation', (
        renderCategoryFields('cablesInstallation', 'Cable Detail', [
          '• Solar Cables, Battery Cables, MC4',
          '• Conduits, Trunking, Earth Spike',
          '• Additional cables & installation materials'
        ])
      ), true)}

      {/* NEW: Additional Assembly Parts Section */}
      {renderSection('additionalParts', '📦 Additional Assembly Parts', (
        renderAdditionalParts()
      ), true)}

      {/* Field Count Summary */}
      <div style={{...sectionStyle, backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px', border: '1px solid #c3e6cb'}}>
        <h4 style={{color: '#155724', marginBottom: '10px'}}>📊 Field Usage Summary</h4>
        <div style={{fontSize: '12px', color: '#155724'}}>
          <div>Power System: {categoryFieldCounts.powerSystem}/{maxFields.powerSystem} fields</div>
          <div>Solar Panels: {categoryFieldCounts.solarPanels}/{maxFields.solarPanels} fields</div>
          <div>Mounting Hardware: {categoryFieldCounts.mountingHardware}/{maxFields.mountingHardware} fields</div>
          <div>Electrical Components: {categoryFieldCounts.electricalComponents}/{maxFields.electricalComponents} fields</div>
          <div>Cables & Installation: {categoryFieldCounts.cablesInstallation}/{maxFields.cablesInstallation} fields</div>
          <div><strong>Additional Parts: {categoryFieldCounts.additionalParts}/{maxFields.additionalParts} fields</strong></div>
          <div style={{marginTop: '8px', fontWeight: 'bold'}}>
            Total Active Fields: {Object.values(categoryFieldCounts).reduce((a, b) => a + b, 0)}
          </div>
        </div>
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

      {/* Delivery Information */}
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
