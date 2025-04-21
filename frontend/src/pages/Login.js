import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }
    
    // Mock login - in a real app, this would call an API
    if (formData.username === 'demo' && formData.password === 'password') {
      // Store login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', formData.username);
      
      // Redirect to profile page
      navigate('/profile');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="page-container">
      <NavBar />
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="login-button">Login</button>
          </div>
        </form>
        
        <div className="login-footer">
          <p>Demo credentials: username: demo, password: password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;