# Dynamic Scheduling System Backend

This is the backend API for the Dynamic Scheduling System, built with Flask and MongoDB.

## Setup Instructions

### 1. Create Virtual Environment

```bash
# Create a new virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. MongoDB Setup

Make sure you have MongoDB installed and running on your system. The application will connect to a database called `dynamic_scheduling` by default.

You can override the MongoDB connection string by setting the `MONGO_URI` environment variable:

```bash
# On Windows:
set MONGO_URI=mongodb://localhost:27017/dynamic_scheduling
# On macOS/Linux:
export MONGO_URI=mongodb://localhost:27017/dynamic_scheduling
```

### 4. Running the Server

```bash
python app.py
```

The server will start on port 5000 by default.

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Events Endpoints

- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event
- `GET /api/events/<event_id>` - Get a specific event
- `PUT /api/events/<event_id>` - Update an event
- `DELETE /api/events/<event_id>` - Delete an event

### Tasks Endpoints

- `GET /api/tasks` - Get all tasks (can filter by priority or status)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/<task_id>` - Get a specific task
- `PUT /api/tasks/<task_id>` - Update a task
- `DELETE /api/tasks/<task_id>` - Delete a task

### Scheduling Endpoints

- `POST /api/schedule/suggestions` - Get scheduling suggestions for a list of tasks