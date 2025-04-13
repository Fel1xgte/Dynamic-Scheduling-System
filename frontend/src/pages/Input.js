import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import '../styles/Input.css';

const Input = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [inputType, setInputType] = useState('event'); // 'event' or 'task'
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Event form state
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventHost, setEventHost] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventAgenda, setEventAgenda] = useState('');
  const [eventPriority, setEventPriority] = useState(3); // Default medium priority
  
  // Task form state
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState(3); // Default medium priority
  const [taskStatus, setTaskStatus] = useState('pending');
  const [taskTags, setTaskTags] = useState('');

  // Handle event form submission
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    // Validation
    if (!eventName || !eventDate) {
      setFormError('Event name and date are required');
      return;
    }
    
    try {
      setLoading(true);
      
      const eventData = {
        event_name: eventName,
        date: eventDate,
        host: eventHost || undefined,
        category: eventCategory || undefined,
        agenda: eventAgenda || undefined,
        priority: parseInt(eventPriority),
        user_id: currentUser ? currentUser._id : undefined
      };
      
      const response = await API.events.createEvent(eventData);
      
      if (response.error) {
        setFormError(response.error);
      } else {
        setFormSuccess('Event created successfully!');
        // Reset form
        setEventName('');
        setEventDate('');
        setEventHost('');
        setEventCategory('');
        setEventAgenda('');
        setEventPriority(3);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      setFormError('Failed to create event. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle task form submission
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    // Validation
    if (!taskName) {
      setFormError('Task name is required');
      return;
    }
    
    try {
      setLoading(true);
      
      const taskData = {
        task_name: taskName,
        description: taskDescription || undefined,
        due_date: taskDueDate || undefined,
        priority: parseInt(taskPriority),
        status: taskStatus,
        tags: taskTags ? taskTags.split(',').map(tag => tag.trim()) : undefined,
        user_id: currentUser ? currentUser._id : undefined
      };
      
      const response = await API.tasks.createTask(taskData);
      
      if (response.error) {
        setFormError(response.error);
      } else {
        setFormSuccess('Task created successfully!');
        // Reset form
        setTaskName('');
        setTaskDescription('');
        setTaskDueDate('');
        setTaskPriority(3);
        setTaskStatus('pending');
        setTaskTags('');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      setFormError('Failed to create task. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Format today's date for min attribute on date inputs
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-container">
      <NavBar />
      <div className="input-container">
        <div className="input-header">
          <h1>Create New {inputType === 'event' ? 'Event' : 'Task'}</h1>
          <div className="input-type-selector">
            <button
              className={`selector-button ${inputType === 'event' ? 'active' : ''}`}
              onClick={() => setInputType('event')}
            >
              Event
            </button>
            <button
              className={`selector-button ${inputType === 'task' ? 'active' : ''}`}
              onClick={() => setInputType('task')}
            >
              Task
            </button>
          </div>
        </div>

        {formError && <div className="error-message">{formError}</div>}
        {formSuccess && <div className="success-message">{formSuccess}</div>}

        {inputType === 'event' ? (
          <form className="input-form" onSubmit={handleEventSubmit}>
            <div className="form-group">
              <label htmlFor="eventName">Event Name*</label>
              <input
                type="text"
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventDate">Event Date & Time*</label>
              <input
                type="datetime-local"
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={today}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventHost">Host</label>
              <input
                type="text"
                id="eventHost"
                value={eventHost}
                onChange={(e) => setEventHost(e.target.value)}
                placeholder="Who is hosting this event?"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventCategory">Category</label>
              <select
                id="eventCategory"
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Select Category --</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Birthday">Birthday</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="eventAgenda">Agenda / Description</label>
              <textarea
                id="eventAgenda"
                value={eventAgenda}
                onChange={(e) => setEventAgenda(e.target.value)}
                placeholder="Describe the event..."
                rows="4"
                disabled={loading}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="eventPriority">Priority</label>
              <select
                id="eventPriority"
                value={eventPriority}
                onChange={(e) => setEventPriority(e.target.value)}
                disabled={loading}
              >
                <option value="1">High Priority</option>
                <option value="2">Important</option>
                <option value="3">Medium</option>
                <option value="4">Low Priority</option>
                <option value="5">Optional</option>
              </select>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </form>
        ) : (
          <form className="input-form" onSubmit={handleTaskSubmit}>
            <div className="form-group">
              <label htmlFor="taskName">Task Name*</label>
              <input
                type="text"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="taskDescription">Description</label>
              <textarea
                id="taskDescription"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Describe the task..."
                rows="4"
                disabled={loading}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="taskDueDate">Due Date</label>
              <input
                type="date"
                id="taskDueDate"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                min={today}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="taskPriority">Priority</label>
              <select
                id="taskPriority"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                disabled={loading}
              >
                <option value="1">High Priority</option>
                <option value="2">Important</option>
                <option value="3">Medium</option>
                <option value="4">Low Priority</option>
                <option value="5">Optional</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="taskStatus">Status</label>
              <select
                id="taskStatus"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                disabled={loading}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="taskTags">Tags (comma separated)</label>
              <input
                type="text"
                id="taskTags"
                value={taskTags}
                onChange={(e) => setTaskTags(e.target.value)}
                placeholder="e.g. work, presentation, urgent"
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating Task...' : 'Create Task'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Input;