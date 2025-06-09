import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Farmer from './Farmer';
import ProductionLine from './ProductionLine';
import Consumer from './Consumer';
import Store from './Store';
import Header from './components/Header';
import Footer from './components/Footer';
import BackgroundVideo from './components/Background';
import './App.css';

function App() {
  

  return (
    <Router>
      <div className="app-wrapper">
        <BackgroundVideo />
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={
              <div className="homepage">
                <div className="homepage-left">
                  <img src={require('./assets/name.png')} alt="AgriConnect" />
                  <p className="homepage-description">
                    Connecting farms to communities through sustainable agriculture and innovation.
                  </p>
                </div>
                <div className="homepage-right">
                  <p className="homepage-tagline">
                    Let's get started - Select Your Role.
                  </p>
                  <div className="homepage-buttons">
                    <a href="/farmer">
                      <button>Farmer</button>
                    </a>
                    <a href="/production-line">
                      <button>Production Line</button>
                    </a>
                  </div>
                </div>
              </div>
            } />
            <Route path="/farmer" element={<Farmer />} />
            <Route path="/production-line" element={<ProductionLine />} />
            <Route path="/consumer" element={<Consumer />} />
            <Route path="/store" element={<Store />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;