// src/Farmer.js
import React, { useState } from 'react';
import './Farmer.css';
import potatoImg from './assets/potato.webp';
import potatoData from './sprout_development_data.json';

const products = [
  {
    name: potatoData.crop,
    image: potatoImg,
    stages: potatoData.stages,
  },
  // You can add more products here in the future
];

const Farmer = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelect = (e) => {
    const value = e.target.value;
    const product = products.find(p => p.name === value);
    setSelectedProduct(value === "" ? null : product);
  };

  return (
    <div className="farmer-page">
      <div className="top-bar">
        <select id="product-dropdown" onChange={handleSelect} defaultValue="">
          <option value="">- Select a Product -</option>
          {products.map(product => (
            <option key={product.name} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div className="product-details">
          <h2>{selectedProduct.name}</h2>
          <img src={selectedProduct.image} alt={selectedProduct.name} />
          <div className="stage-timeline">
            {selectedProduct.stages.map((stageObj, index) => {
              const stage = stageObj.SproutDevelopment;
              return (
                <div className="stage" key={index}>
                  <h3>Stage {index + 1}</h3>
                  <p className="status">{stage.status}</p>
                  <ul className="issues">
                    {stage.issues.map((issue, i) => (
                      <li key={i}>
                        <strong>{issue.parameter}</strong><br />
                        Actual: {issue.actual}<br />
                        Ideal: {issue.ideal_range}<br />
                        <em>{issue.explanation}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Farmer;
