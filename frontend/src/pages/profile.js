import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/Profile.css';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    const storedImage = localStorage.getItem('profileImage');
    
    setIsLoggedIn(loggedIn);
    setUsername(storedUsername || '');
    setProfileImage(storedImage || '');
    
    // If not logged in, redirect to login page
    if (!loggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Mock user data
  const user = {
    name: username || 'John Doe',
    email: `${username || 'john.doe'}@example.com`,
    role: 'User',
    joinDate: 'January 2024',
    preferences: {
      theme: 'Light',
      notifications: 'Enabled',
      timeFormat: '12-hour'
    }
  };

  const handleLogout = () => {
    // Clear login state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('profileImage');
    
    // Redirect to login page
    navigate('/login');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      setIsUploading(false);
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      setIsUploading(false);
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      // Store the image in localStorage
      localStorage.setItem('profileImage', event.target.result);
      setProfileImage(event.target.result);
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // If not logged in, don't render the profile
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="page-container">
      <NavBar />
      <div className="profile-container">
        <h1 className="profile-title">User Profile</h1>
        
        <div className="profile-header">
          <div className="profile-avatar" onClick={triggerFileInput}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-image" />
            ) : (
              <span className="avatar-icon">👤</span>
            )}
            <div className="upload-overlay">
              <span className="upload-icon">📷</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <div className="profile-info">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-role">{user.role}</p>
          </div>
        </div>
        
        <div className="profile-section">
          <h3 className="section-title">Account Information</h3>
          <div className="info-item">
            <span className="info-label">Member Since:</span>
            <span className="info-value">{user.joinDate}</span>
          </div>
        </div>
        
        <div className="profile-section">
          <h3 className="section-title">Preferences</h3>
          <div className="info-item">
            <span className="info-label">Theme:</span>
            <span className="info-value">{user.preferences.theme}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Notifications:</span>
            <span className="info-value">{user.preferences.notifications}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Time Format:</span>
            <span className="info-value">{user.preferences.timeFormat}</span>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="edit-button">Edit Profile</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;