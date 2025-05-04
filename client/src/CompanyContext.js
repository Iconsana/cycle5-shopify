import React, { createContext, useState, useEffect } from 'react';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companyData, setCompanyData] = useState(() => {
    // Load from localStorage if available
    const savedData = localStorage.getItem('companyData');
    return savedData ? JSON.parse(savedData) : {
      name: 'B SHOCKED',
      logo: '',
      phone: '011 568 7166',
      email: 'sales@bshockedelectrical.co.za',
      website: 'https://bshockedelectrical.co.za'
    };
  });
  
  // Save to localStorage whenever companyData changes
  useEffect(() => {
    localStorage.setItem('companyData', JSON.stringify(companyData));
  }, [companyData]);
  
  // Update company data
  const updateCompanyData = (newData) => {
    setCompanyData(prev => ({ ...prev, ...newData }));
  };
  
  return (
    <CompanyContext.Provider value={{ companyData, updateCompanyData }}>
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyContext;
