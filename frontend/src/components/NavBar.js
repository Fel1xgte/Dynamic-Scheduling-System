import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/NavBar.css';

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Check if the current route is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="logo-icon">📅</span>
          <span className="logo-text">Dynamic Scheduler</span>
        </Link>
      </div>

      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <div className="navbar-start">
              <Link to="/dashboard" className={`navbar-item ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
              <Link to="/events" className={`navbar-item ${isActive('/events')}`}>
                Events
              </Link>
              <Link to="/tasks" className={`navbar-item ${isActive('/tasks')}`}>
                Tasks
              </Link>
              <Link to="/schedule" className={`navbar-item ${isActive('/schedule')}`}>
                Schedule
              </Link>
            </div>
            
            <div className="navbar-end">
              <div className="navbar-user">
                <span className="user-greeting">Hello, {currentUser.username}</span>
                <div className="dropdown">
                  <button className="dropdown-trigger">
                    <span className="user-avatar">👤</span>
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <Link to="/settings" className="dropdown-item">Settings</Link>
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item" onClick={logout}>Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="navbar-end">
            <Link to="/login" className={`navbar-item ${isActive('/login')}`}>
              Login
            </Link>
            <Link to="/register" className={`navbar-item ${isActive('/register')}`}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;