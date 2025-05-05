import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

  // If no user data, don't render the profile
  if (!user) {
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
            <h2 className="profile-name">
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}`
                : user.username}
            </h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-role">Member since {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;