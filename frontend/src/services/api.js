// API Service for connecting with backend
const API_URL = 'http://localhost:5001/api';

/**
 * API Service for handling all backend requests
 */
export const API = {
  // Auth Methods
  auth: {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} - API response
     */
    register: async (userData) => {
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        return await response.json();
      } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Failed to register. Please try again.' };
      }
    },

    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @returns {Promise} - API response with user data and token
     */
    login: async (credentials) => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        return await response.json();
      } catch (error) {
        console.error('Login error:', error);
        return { error: 'Failed to login. Please try again.' };
      }
    },
  },

  // Events Methods
  events: {
    /**
     * Get all events
     * @returns {Promise} - List of events
     */
    getAllEvents: async () => {
      try {
        const response = await fetch(`${API_URL}/events`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching events:', error);
        return []; // Return empty array on error
      }
    },

    /**
     * Get event by ID
     * @param {string} eventId - Event ID
     * @returns {Promise} - Event data
     */
    getEventById: async (eventId) => {
      try {
        const response = await fetch(`${API_URL}/events/${eventId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error fetching event ${eventId}:`, error);
        return null;
      }
    },

    /**
     * Create a new event
     * @param {Object} eventData - Event data
     * @returns {Promise} - Created event
     */
    createEvent: async (eventData) => {
      try {
        const response = await fetch(`${API_URL}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error creating event:', error);
        return { error: 'Failed to create event. Please try again.' };
      }
    },

    /**
     * Update an existing event
     * @param {string} eventId - Event ID
     * @param {Object} eventData - Updated event data
     * @returns {Promise} - Updated event
     */
    updateEvent: async (eventId, eventData) => {
      try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error updating event ${eventId}:`, error);
        return { error: 'Failed to update event. Please try again.' };
      }
    },

    /**
     * Delete an event
     * @param {string} eventId - Event ID
     * @returns {Promise} - Deletion result
     */
    deleteEvent: async (eventId) => {
      try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error deleting event ${eventId}:`, error);
        return { error: 'Failed to delete event. Please try again.' };
      }
    },
  },

  // Tasks Methods
  tasks: {
    /**
     * Get all tasks
     * @param {Object} filters - Optional filters (priority, status)
     * @returns {Promise} - List of tasks
     */
    getAllTasks: async (filters = {}) => {
      try {
        let url = `${API_URL}/tasks`;
        
        // Add query parameters if filters provided
        if (Object.keys(filters).length > 0) {
          const params = new URLSearchParams();
          if (filters.priority) params.append('priority', filters.priority);
          if (filters.status) params.append('status', filters.status);
          url = `${url}?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return []; // Return empty array on error
      }
    },

    /**
     * Get task by ID
     * @param {string} taskId - Task ID
     * @returns {Promise} - Task data
     */
    getTaskById: async (taskId) => {
      try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error fetching task ${taskId}:`, error);
        return null;
      }
    },

    /**
     * Create a new task
     * @param {Object} taskData - Task data
     * @returns {Promise} - Created task
     */
    createTask: async (taskData) => {
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error creating task:', error);
        return { error: 'Failed to create task. Please try again.' };
      }
    },

    /**
     * Update an existing task
     * @param {string} taskId - Task ID
     * @param {Object} taskData - Updated task data
     * @returns {Promise} - Updated task
     */
    updateTask: async (taskId, taskData) => {
      try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error updating task ${taskId}:`, error);
        return { error: 'Failed to update task. Please try again.' };
      }
    },

    /**
     * Delete a task
     * @param {string} taskId - Task ID
     * @returns {Promise} - Deletion result
     */
    deleteTask: async (taskId) => {
      try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error deleting task ${taskId}:`, error);
        return { error: 'Failed to delete task. Please try again.' };
      }
    },
  },

  // Scheduling Methods
  scheduling: {
    /**
     * Get scheduling suggestions
     * @param {Array} tasks - List of tasks to schedule
     * @returns {Promise} - Scheduling suggestions
     */
    getSuggestions: async (tasks) => {
      try {
        const response = await fetch(`${API_URL}/schedule/suggestions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tasks }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error getting scheduling suggestions:', error);
        return { error: 'Failed to get scheduling suggestions. Please try again.' };
      }
    },
  },
};

export default API;