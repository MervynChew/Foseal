// src/components/ProductionLine.js
import React, { useState, useEffect, useRef } from 'react';
import './ProductionLine.css';
import logo from './assets/logo.png';

function ProductionLine() {
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Store the stream so we can stop it

  useEffect(() => {
    if (cameraOn && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream; // Store the stream
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Camera access denied:", err);
        });
    } else {
      // Stop camera when cameraOn is false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [cameraOn]);

  const toggleCamera = () => {
    setCameraOn(prev => !prev);
  };

  return (
    <div className="production-line-page">
      <h1>AGRICONNECT</h1>

      <h2>Scan Your Crops with Precision</h2>
      <p className="intro">
        Every scan reveals the quality, grade, and shelf life — guiding every step from harvest to processing with confidence.
      </p>

      <button className="camera-button" onClick={toggleCamera}>
        {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>

      {cameraOn && (
        <div className="camera-preview">
          <video
            ref={videoRef}
            id="cameraStream"
            autoPlay
            playsInline
            muted
          />
        </div>
      )}
    </div>
  );
}

export default ProductionLine;
