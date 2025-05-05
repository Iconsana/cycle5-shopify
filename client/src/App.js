import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import TemplateGenerator from './pages/TemplateGenerator';
import Settings from './pages/Settings';
import { CompanyProvider } from './CompanyContext';
import './App.css';

function App() {
  return (
    <CompanyProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/generator" element={<TemplateGenerator />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CompanyProvider>
  );
}

export default App;
