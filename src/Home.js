import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>B SHOCKED Marketing Template Generator</h1>
        <p>Create professional marketing images for your Shopify products in seconds.</p>
        <Link to="/generator" className="btn btn-primary">Start Creating</Link>
      </div>
      
      <div className="features">
        <div className="feature">
          <h3>Choose Templates</h3>
          <p>Select from professionally designed templates that match your brand.</p>
        </div>
        <div className="feature">
          <h3>Add Products</h3>
          <p>Enter product details manually or connect to your Shopify store.</p>
        </div>
        <div className="feature">
          <h3>Customize Colors</h3>
          <p>Automatically extract colors from your product images for a cohesive look.</p>
        </div>
        <div className="feature">
          <h3>Export & Share</h3>
          <p>Download your marketing images in PNG or SVG format for social media.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
