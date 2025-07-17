import React, { useState, useEffect, useContext } from 'react';
import TemplateSelector from '../components/templates/TemplateSelector';
import TemplateManager from '../components/templates/TemplateManager';
import ProductForm from '../components/products/ProductForm';
import TemplatePreview from '../components/templates/TemplatePreview';
import ExportOptions from '../components/export/ExportOptions';
import CompanyContext from '../CompanyContext';
import { getTemplates } from '../services/templateService';

const TemplateGenerator = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    sku: '',
    image: null,
    // Solar Kit Social default values
    ratingText: 'Hellopeter 4.67',
    brandText: 'B SHOCKED',
    categoryText: 'ELECTRICAL | SOLAR',
    mainTitle: 'SOLAR KIT PACKAGE',
    imageTitle: 'Solar Kit Components',
    secondaryDescription: 'Complete Installation Package',
    // Power System defaults
    powerDetail1: '• 5kW Deye Hybrid Inverter',
    powerDetail2: '• 5.12kWh Dyness Lithium Battery',
    // Panel defaults
    panelDetail1: '• 8x 565W JA Solar Mono Panels',
    // Mount defaults
    mountDetail1: '• PV Rails, Roof Hooks, Clamps',
    mountDetail2: '• Complete Mounting System',
    // Electrical defaults
    elecDetail1: '• DC/AC Combiners, Surge Protection',
    elecDetail2: '• Fuses, Switches, Safety Equipment',
    // Cable defaults
    cableDetail1: '• Solar Cables, Battery Cables, MC4',
    cableDetail2: '• Conduits, Trunking, Earth Spike',
    // Description defaults
    descriptionTitle: 'COMPLETE SOLAR KIT',
    descriptionLine1: 'Everything you need for a',
    descriptionLine2: 'professional solar installation.',
    descriptionLine3: 'Hybrid system with battery',
    descriptionLine4: 'backup for load-shedding',
    descriptionLine5: 'protection and energy',
    descriptionLine6: 'independence.',
    // Benefits defaults
    benefit1: '✓ Load Shedding Protection',
    benefit2: '✓ Reduce Electricity Bills',
    benefit3: '✓ Eco-Friendly Power',
    benefit4: '✓ Professional Support',
    benefit5: '✓ Complete Installation Kit',
    // Price defaults
    priceHeader: 'Incl. VAT',
    priceAmount: 'R51,779.35',
    priceNote: 'Professional Installation Available',
    // Delivery defaults
    delivery1: 'Delivery JHB free up to 20 km',
    delivery2: 'Delivery 60-100 km JHB R440 fee',
    delivery3: 'Fee for other regions calculated',
    // Contact defaults
    contactPhone1: '011 568 7166',
    contactPhone2: '067 923 8166',
    contactEmail: 'sales@bshockedelectrical.co.za',
    contactWebsite: 'https://bshockedelectrical.co.za'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { companyData } = useContext(CompanyContext);
  
  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const templatesData = await getTemplates();
        setTemplates(templatesData);
        if (templatesData.length > 0) {
          // Set solar-kit-social as default if available, otherwise first template
          const solarTemplate = templatesData.find(t => t.id === 'solar-kit-social');
          setSelectedTemplate(solarTemplate || templatesData[0]);
        }
      } catch (err) {
        setError('Failed to load templates. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);
  
  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    console.log('Selected template:', template.id);
  };
  
  // Handle product data changes
  const handleProductChange = (newData) => {
    setProductData(prev => ({ ...prev, ...newData }));
  };

  // Handle loading a saved template
  const handleLoadTemplate = (savedTemplate) => {
    try {
      // Find the template type in our available templates
      const templateType = templates.find(t => t.id === savedTemplate.templateId);
      if (!templateType) {
        console.error('Template type not found:', savedTemplate.templateId);
        return;
      }

      // Set the template type
      setSelectedTemplate(templateType);
      
      // Load the product data
      setProductData(savedTemplate.productData || {});
      
      console.log('Loaded template:', savedTemplate.name);
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  // Clear non-essential data when switching templates
  const handleTemplateSwitch = (template) => {
    console.log('Switching to template:', template.id);
    
    // Keep basic data but clear template-specific fields
    const basicData = {
      title: productData.title,
      description: productData.description,
      price: productData.price,
      sku: productData.sku,
      image: productData.image
    };

    // If switching to solar-kit-social, keep the defaults
    if (template.id === 'solar-kit-social') {
      setProductData(prev => ({ ...basicData, ...prev }));
    } else {
      // For other templates, use minimal data
      setProductData(basicData);
    }
    
    setSelectedTemplate(template);
  };
  
  if (loading) {
    return (
      <div className="template-generator">
        <div className="loading">
          <h2>Loading Templates...</h2>
          <p>Please wait while we load the available templates.</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="template-generator">
        <div className="error">
          <h2>Error Loading Templates</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="template-generator">
      {/* Page Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Solar Kit Template Generator</h1>
        <p>Create professional marketing templates for your solar kit products</p>
        {selectedTemplate && (
          <div style={{ 
            padding: '10px 20px', 
            backgroundColor: '#e8f5e8', 
            borderRadius: '5px', 
            display: 'inline-block',
            marginTop: '10px'
          }}>
            <strong>Active Template:</strong> {selectedTemplate.name}
            {selectedTemplate.id === 'solar-kit-social' && (
              <span style={{ color: '#0056b3', marginLeft: '10px' }}>
                ⭐ (Supports dynamic fields)
              </span>
            )}
          </div>
        )}
      </div>

      <div className="generator-grid">
        {/* Left Column - Form Content */}
        <div className="generator-form">
          {/* Template Management Section */}
          <section style={{ marginBottom: '2rem' }}>
            <TemplateManager 
              onLoadTemplate={handleLoadTemplate}
              currentTemplate={selectedTemplate}
              currentProductData={productData}
              currentCompanyData={companyData}
            />
          </section>

          {/* Template Selection Section */}
          <section style={{ marginBottom: '2rem' }}>
            <h2>1. Choose a Template</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Select from our professionally designed templates. The Solar Kit Social template supports dynamic fields for complex product configurations.
            </p>
            <TemplateSelector 
              templates={templates} 
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleTemplateSwitch}
            />
          </section>
          
          {/* Product Details Section */}
          <section>
            <h2>2. Configure Product Details</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Fill in your product information. Use the expandable sections to add more details as needed.
              {selectedTemplate?.id === 'solar-kit-social' && (
                <span style={{ color: '#0056b3', fontWeight: 'bold' }}>
                  {' '}This template supports up to 25+ dynamic fields for complex solar kits.
                </span>
              )}
            </p>
            <ProductForm 
              productData={productData}
              onProductChange={handleProductChange}
            />
          </section>
        </div>
        
        {/* Right Column - Sticky Preview */}
        <div className="template-preview">
          <TemplatePreview 
            template={selectedTemplate}
            productData={productData}
            companyData={companyData}
          />
          
          <ExportOptions 
            template={selectedTemplate}
            productData={productData}
            companyData={companyData}
          />

          {/* Preview Stats */}
          {selectedTemplate && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '10px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '5px',
              fontSize: '12px',
              color: '#666'
            }}>
              <strong>📊 Template Info:</strong><br/>
              Active fields: {Object.keys(productData).filter(k => productData[k] && productData[k].toString().trim()).length}<br/>
              Template: {selectedTemplate.name}<br/>
              {selectedTemplate.id === 'solar-kit-social' && (
                <>
                  Dynamic parts: {Object.keys(productData).filter(k => k.startsWith('additionalPart') && productData[k]).length}/10<br/>
                  Categories: {Object.keys(productData).filter(k => 
                    (k.startsWith('powerDetail') || k.startsWith('panelDetail') || 
                     k.startsWith('mountDetail') || k.startsWith('elecDetail') || 
                     k.startsWith('cableDetail')) && productData[k]
                  ).length}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div style={{ 
        marginTop: '3rem', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        borderLeft: '4px solid #007bff'
      }}>
        <h3>💡 Tips for Better Results</h3>
        <ul style={{ marginBottom: 0 }}>
          <li><strong>Use high-quality images:</strong> Upload clear product photos for best results</li>
          <li><strong>Keep text concise:</strong> Shorter descriptions look better on social media</li>
          <li><strong>Hide unused fields:</strong> Use the "Hide" buttons to remove fields you don't need</li>
          <li><strong>Preview as you go:</strong> The preview updates live as you type</li>
          {selectedTemplate?.id === 'solar-kit-social' && (
            <li><strong>Use Additional Parts:</strong> Add extra components using the "Additional Assembly Parts" section</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TemplateGenerator;
