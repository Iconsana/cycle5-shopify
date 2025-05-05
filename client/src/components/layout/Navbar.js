import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CompanyContext from '../../CompanyContext';

const Navbar = () => {
  const { companyData } = useContext(CompanyContext);
  
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          {companyData.name} Template Generator
        </Link>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/generator">Create Templates</Link>
          <Link to="/settings">Settings</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
