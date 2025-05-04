import React, { useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CompanyContext from '../context/CompanyContext';

const Settings = () => {
  const { companyData, updateCompanyData } = useContext(CompanyContext);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Handle file drop for company logo
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.svg']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const logoUrl = URL.createObjectURL(file);
        updateCompanyData({ logo: logoUrl });
      }
    }
  });
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('Company settings updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateCompanyData({ [name]: value });
  };
  
  return (
    <div className="settings-page">
      <h1>Company Settings</h1>
      <p>Update your company information for use in marketing templates.</p>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Company Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={companyData.name}
            onChange={handleChange}
            placeholder="Enter company name"
          />
        </div>
        
        <div className="form-group">
          <label>Company Logo</label>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag & drop a logo here, or click to select one</p>
            {companyData.logo && (
              <div className="image-preview">
                <img src={companyData.logo} alt="Company logo preview" />
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={companyData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={companyData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={companyData.website}
            onChange={handleChange}
            placeholder="Enter website URL"
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Save Settings</button>
      </form>
    </div>
  );
};

export default Settings;
