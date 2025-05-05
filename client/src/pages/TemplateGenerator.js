import React, { useState, useEffect, useContext } from 'react';
import TemplateSelector from '../components/templates/TemplateSelector';
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
    image: null
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
          setSelectedTemplate(templatesData[0]);
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
  };
  
  // Handle product data changes
  const handleProductChange = (newData) => {
    setProductData(prev => ({ ...prev, ...newData }));
  };
  
  if (loading) {
    return <div className="loading">Loading templates...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="template-generator">
      <div className="generator-grid">
        <div className="template-selection">
          <h2>Choose a Template</h2>
          <TemplateSelector 
            templates={templates} 
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
          />
        </div>
        
        <div className="product-details">
          <h2>Product Details</h2>
          <ProductForm 
            productData={productData}
            onProductChange={handleProductChange}
          />
        </div>
        
        <div className="template-preview">
          <h2>Preview</h2>
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
        </div>
      </div>
    </div>
  );
};

export default TemplateGenerator;
