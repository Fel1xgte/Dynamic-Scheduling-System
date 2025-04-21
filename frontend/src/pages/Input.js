import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/Input.css';

const Input = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    priority: 'medium',
    category: 'work'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the event to your backend
    console.log('Event data:', formData);
    
    // For now, we'll just navigate back to the home page
    navigate('/');
  };

  return (
    <div className="page-container">
      <NavBar />
      <div className="input-container">
        <div className="input-header">
          <div className="logo">
            <span className="logo-text">Dynamic Planning</span>
          </div>
          <h1 className="input-title">Add New Event</h1>
        </div>
        
        <form className="input-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              rows="4"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="meeting">Meeting</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Input;