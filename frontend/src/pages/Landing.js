import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Calendar from '../components/Calendar';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Landing.css';

const Landing = () => {
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState('');

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentTime(now.toLocaleString('en-US', options));
    };

    // Update immediately
    updateTime();
    
    // Then update every minute
    const intervalId = setInterval(updateTime, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Mock tasks data with dates
  const tasks = [
    { id: 1, title: 'Complete project proposal', priority: 'high', day: 5 },
    { id: 2, title: 'Review team presentations', priority: 'medium', day: 10 },
    { id: 3, title: 'Schedule weekly meetings', priority: 'medium', day: 15 },
    { id: 4, title: 'Update documentation', priority: 'low', day: 20 },
    { id: 5, title: 'Send progress report', priority: 'high', day: 25 },
    { id: 6, title: 'Prepare for client meeting', priority: 'low', day: 28 },
  ];

  return (
    <div className="page-container">
      <NavBar />
      <div className="landing-container">
        <header className="header">
          <div className="logo">
            <span className="logo-text">Dynamic Planning For A Smarter Day.</span>
          </div>
          <Link to="/input" className="add-button">
            <span className="add-icon">+</span>
            Add New
          </Link>
        </header>

        <div className="main-content">
          <div className="left-panel">
            <Calendar tasks={tasks} />
            <div className="date-display">
              <div className="date-label">Current Time</div>
              <div className="date-value">{currentTime}</div>
            </div>
          </div>

          <div className="tasks-section">
            <div className="tasks-header">
              <h2 className="tasks-title">Tasks</h2>
            </div>
            <div className="tasks-list">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-item task-${task.priority}`}
                >
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;