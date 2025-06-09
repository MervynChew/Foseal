// src/components/Footer.js
import React from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/logo.png';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="footer-left">
        <button
          className="footer-logo-button"
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <img src={logo} alt="Logo" className="footer-logo" />
        </button>

        <span className="footer-slogan">Bridging Fields and You.</span>
      </div>

      <div className="footer-center">
        <div className="footer-links">
          <a href="/">About</a>
        </div>

        <div className="footer-social">
          <a href="mailto:info@agriconnect.com" className="tooltip" aria-label="Email">
            <FaEnvelope />
            <span className="tooltip-text">Email</span>
          </a>
          <a href="https://www.facebook.com/mervyn.chew.904" target="_blank" rel="noopener noreferrer" className="tooltip" aria-label="Facebook">
            <FaFacebookF />
            <span className="tooltip-text">Facebook</span>
          </a>
          <a href="https://www.instagram.com/arwenlx/" target="_blank" rel="noopener noreferrer" className="tooltip" aria-label="Instagram">
            <FaInstagram />
            <span className="tooltip-text">Instagram</span>
          </a>
          <a href="https://www.linkedin.com/in/ivan-tham-aa159b298?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B1WJU%2FrtFTKyVXF2kddQdFw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="tooltip"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn />
            <span className="tooltip-text">LinkedIn</span>
          </a>
        </div>

        <div className="footer-copy">
          © 2025 AgriConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;