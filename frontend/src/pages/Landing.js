import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Calendar from '../components/Calendar';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Landing.css';

const Landing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

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

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Error loading events');
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, [navigate]);

  // Convert events to tasks format for calendar
  const tasks = events.map(event => ({
    id: event.event_id,
    title: event.title,
    priority: event.priority,
    day: new Date(event.date).getDate()
  }));

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
            {error && <div className="error-message">{error}</div>}
            <div className="tasks-list">
              {events.map(event => (
                <div 
                  key={event.event_id} 
                  className={`task-item task-${event.priority}`}
                >
                  <div className="task-content">
                    <span className="task-title">{event.title}</span>
                    <span className="task-date">
                      {new Date(event.date).toLocaleDateString()} {event.time}
                    </span>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="empty-state">No events scheduled</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;