import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import '../styles/Landing.css';

const Landing = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch events and tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsResponse, tasksResponse] = await Promise.all([
          API.events.getAllEvents(),
          API.tasks.getAllTasks()
        ]);
        
        setEvents(eventsResponse);
        setTasks(tasksResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Group and sort events by date
  const groupedEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return {
      today: events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate < tomorrow;
      }).sort((a, b) => new Date(a.date) - new Date(b.date)),
      
      upcoming: events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= tomorrow && eventDate < nextWeek;
      }).sort((a, b) => new Date(a.date) - new Date(b.date)),
      
      future: events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= nextWeek;
      }).sort((a, b) => new Date(a.date) - new Date(b.date))
    };
  };
  
  // Group tasks by priority and status
  const groupedTasks = () => {
    const highPriority = tasks.filter(task => task.priority <= 2 && task.status !== 'completed')
      .sort((a, b) => a.priority - b.priority);
      
    const normalPriority = tasks.filter(task => task.priority > 2 && task.status !== 'completed')
      .sort((a, b) => a.priority - b.priority);
      
    const completed = tasks.filter(task => task.status === 'completed')
      .sort((a, b) => new Date(b.completed_at || b.updated_at) - new Date(a.completed_at || a.updated_at));
      
    return { highPriority, normalPriority, completed };
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };
  
  // Get priority badge class
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 1: return 'priority-high';
      case 2: return 'priority-important';
      case 3: return 'priority-medium';
      case 4: return 'priority-low';
      case 5: return 'priority-optional';
      default: return 'priority-medium';
    }
  };
  
  // Get priority label
  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 1: return 'High';
      case 2: return 'Important';
      case 3: return 'Medium';
      case 4: return 'Low';
      case 5: return 'Optional';
      default: return 'Medium';
    }
  };
  
  // Handle task status toggle
  const handleTaskStatusToggle = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await API.tasks.updateTask(taskId, { status: newStatus });
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status.');
    }
  };
  
  // Render grouped events
  const { today: todayEvents, upcoming: upcomingEvents, future: futureEvents } = groupedEvents();
  
  // Render grouped tasks
  const { highPriority, normalPriority, completed } = groupedTasks();
  
  return (
    <div className="page-container">
      <NavBar />
      <div className="landing-container">
        <div className="welcome-banner">
          <h1>
            {isAuthenticated 
              ? `Welcome back, ${currentUser.username}!` 
              : 'Welcome to Dynamic Scheduler'}
          </h1>
          <p className="subtitle">
            {isAuthenticated 
              ? "Here's what's on your schedule" 
              : 'Organize your time efficiently'}
          </p>
          <div className="action-buttons">
            <Link to="/input" className="add-button">
              <span className="add-icon">+</span> Add New
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="dashboard-content">
            <div className="column events-column">
              <h2 className="section-title">Events</h2>
              
              {/* Today's Events */}
              <div className="event-section">
                <h3 className="subsection-title">Today</h3>
                {todayEvents.length > 0 ? (
                  <div className="events-list">
                    {todayEvents.map(event => (
                      <div key={event._id} className="event-card">
                        <div className="event-time">{formatDate(event.date).split(',')[1]}</div>
                        <div className="event-details">
                          <h4 className="event-name">{event.event_name}</h4>
                          <div className="event-meta">
                            {event.host && <span className="event-host">Host: {event.host}</span>}
                            {event.category && <span className="event-category">{event.category}</span>}
                          </div>
                        </div>
                        <div className="event-priority">
                          <span className={`priority-badge ${getPriorityClass(event.priority)}`}>
                            {getPriorityLabel(event.priority)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">No events scheduled for today</div>
                )}
              </div>
              
              {/* Upcoming Events */}
              <div className="event-section">
                <h3 className="subsection-title">Upcoming</h3>
                {upcomingEvents.length > 0 ? (
                  <div className="events-list">
                    {upcomingEvents.map(event => (
                      <div key={event._id} className="event-card">
                        <div className="event-time">{formatDate(event.date)}</div>
                        <div className="event-details">
                          <h4 className="event-name">{event.event_name}</h4>
                          <div className="event-meta">
                            {event.host && <span className="event-host">Host: {event.host}</span>}
                            {event.category && <span className="event-category">{event.category}</span>}
                          </div>
                        </div>
                        <div className="event-priority">
                          <span className={`priority-badge ${getPriorityClass(event.priority)}`}>
                            {getPriorityLabel(event.priority)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">No upcoming events</div>
                )}
              </div>
              
              {/* View all events link */}
              {events.length > 0 && (
                <div className="view-all">
                  <Link to="/events">View all events</Link>
                </div>
              )}
            </div>
            
            <div className="column tasks-column">
              <h2 className="section-title">Tasks</h2>
              
              {/* High Priority Tasks */}
              <div className="task-section">
                <h3 className="subsection-title">High Priority</h3>
                {highPriority.length > 0 ? (
                  <div className="tasks-list">
                    {highPriority.map(task => (
                      <div key={task._id} className="task-card">
                        <div className="task-checkbox">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => handleTaskStatusToggle(task._id, task.status)}
                          />
                        </div>
                        <div className="task-details">
                          <h4 className="task-name">{task.task_name}</h4>
                          {task.due_date && (
                            <div className="task-due-date">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="task-priority">
                          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">No high priority tasks</div>
                )}
              </div>
              
              {/* Normal Priority Tasks */}
              <div className="task-section">
                <h3 className="subsection-title">Other Tasks</h3>
                {normalPriority.length > 0 ? (
                  <div className="tasks-list">
                    {normalPriority.slice(0, 5).map(task => (
                      <div key={task._id} className="task-card">
                        <div className="task-checkbox">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => handleTaskStatusToggle(task._id, task.status)}
                          />
                        </div>
                        <div className="task-details">
                          <h4 className="task-name">{task.task_name}</h4>
                          {task.due_date && (
                            <div className="task-due-date">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="task-priority">
                          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">No regular tasks</div>
                )}
              </div>
              
              {/* View all tasks link */}
              {tasks.length > 0 && (
                <div className="view-all">
                  <Link to="/tasks">View all tasks</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;