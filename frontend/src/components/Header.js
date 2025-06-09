import React from 'react';
import './Header.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom'; // if using React Router

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="AgriConnect Logo" className="header-logo" />
      </div>
      <nav className="header-nav">
        <a href="/" className="header-button">About</a>
      </nav>
    </header>
  );
}

export default Header;
