import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

const Navbar = () => {
  const location = useLocation();

  // Check if the current route is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src="/calendylogo.png" alt="Calendy Logo" className="navbar-logo" />
          <span className="logo-text">Dynamic Scheduler</span>
        </Link>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/" className={`navbar-item ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/input" className={`navbar-item ${isActive('/input')}`}>
            Add Event
          </Link>
        </div>
        <div className="navbar-end">
          <Link to="/profile" className={`navbar-item profile-button ${isActive('/profile')}`}>
            <span className="profile-icon">👤</span>
            <span className="profile-text">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;