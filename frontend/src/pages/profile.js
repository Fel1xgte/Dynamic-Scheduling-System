import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // User statistics
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTasks: 0,
    completedTasks: 0,
    upcomingEvents: 0
  });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Set initial form values
    if (currentUser) {
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
    }
    
    // Fetch user statistics
    const fetchUserStats = async () => {
      try {
        // Get user's events and tasks
        const [events, tasks] = await Promise.all([
          API.events.getAllEvents(),
          API.tasks.getAllTasks()
        ]);
        
        // Filter for user's items
        const userEvents = events.filter(event => 
          event.user_id === currentUser._id
        );
        
        const userTasks = tasks.filter(task => 
          task.user_id === currentUser._id
        );
        
        // Calculate statistics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = userEvents.filter(event => 
          new Date(event.date) >= today
        );
        
        const completedTasks = userTasks.filter(task => 
          task.status === 'completed'
        );
        
        setStats({
          totalEvents: userEvents.length,
          totalTasks: userTasks.length,
          completedTasks: completedTasks.length,
          upcomingEvents: upcomingEvents.length
        });
        
      } catch (error) {
        console.error('Error fetching user statistics:', error);
      }
    };
    
    fetchUserStats();
  }, [currentUser, isAuthenticated, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Only include password if it's been changed
    const updateData = {
      username,
      email
    };
    
    if (password) {
      updateData.password = password;
    }
    
    try {
      setLoading(true);
      
      // In a real application, you would update the user profile here
      // For this demo, we'll just simulate a successful update
      setTimeout(() => {
        setSuccess('Profile updated successfully');
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      setError('Failed to update profile');
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!isAuthenticated) return null;
  
  return (
    <div className="page-container">
      <NavBar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-placeholder">
              {currentUser.username ? currentUser.username[0].toUpperCase() : '?'}
            </span>
          </div>
          <h1>{currentUser.username}</h1>
          <p className="profile-email">{currentUser.email}</p>
        </div>
        
        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.totalEvents}</span>
            <span className="stat-label">Total Events</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.upcomingEvents}</span>
            <span className="stat-label">Upcoming Events</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {stats.totalTasks > 0 
                ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
                : 0}%
            </span>
            <span className="stat-label">Completion Rate</span>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-section">
            <h2>Edit Profile</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              
              <div className="profile-actions">
                <button type="submit" className="update-button" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="profile-section">
            <h2>Account Settings</h2>
            
            <div className="setting-item">
              <div className="setting-details">
                <h3>Account Status</h3>
                <p>Your account is active</p>
              </div>
              <div className="setting-status active">Active</div>
            </div>
            
            <div className="setting-item">
              <div className="setting-details">
                <h3>Member Since</h3>
                <p>{currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            
            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
              <button className="delete-account-button">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;