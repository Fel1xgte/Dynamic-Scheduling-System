from flask import Flask, jsonify, request
from datetime import datetime
import json
import uuid

app = Flask(__name__)

# Add CORS headers to all responses
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response

# Handle OPTIONS requests
@app.route('/api/<path:path>', methods=['OPTIONS'])
def options_handler(path):
    return jsonify({}), 200

# In-memory data storage
events = []
tasks = []
users = []

# Create sample data
def create_sample_data():
    if not events:
        events.append({
            "id": str(uuid.uuid4()),
            "event_name": "Team Meeting",
            "date": "2025-05-01T14:00:00",
            "host": "Project Manager",
            "category": "Work",
            "participants": ["John", "Jane", "Bob"],
            "agenda": "Discuss project progress",
            "priority": 2,
            "created_at": datetime.utcnow().isoformat()
        })
        print("Added sample event")
    
    if not tasks:
        tasks.append({
            "id": str(uuid.uuid4()),
            "task_name": "Complete Backend API",
            "description": "Implement all REST endpoints for the scheduling app",
            "due_date": "2025-04-20",
            "priority": 1,  # High priority
            "status": "in-progress",
            "tags": ["development", "backend"],
            "created_at": datetime.utcnow().isoformat()
        })
        print("Added sample task")
    
    if not users:
        users.append({
            "id": str(uuid.uuid4()),
            "username": "admin",
            "email": "admin@example.com",
            "password_hash": "password123",
            "created_at": datetime.utcnow().isoformat()
        })
        print("Added sample user")

# Add sample data at startup
create_sample_data()

# API Routes
@app.route('/api')
def home():
    return jsonify({"message": "Dynamic Scheduling System API Running!"})

# Events API
@app.route('/api/events', methods=['GET'])
def get_events():
    return jsonify(events)

@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json()
    
    # Validate required fields
    if not data or not 'event_name' in data or not 'date' in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Create new event
    new_event = {
        "id": str(uuid.uuid4()),
        "event_name": data['event_name'],
        "date": data['date'],
        "host": data.get('host', 'Not specified'),
        "category": data.get('category', 'Uncategorized'),
        "participants": data.get('participants', []),
        "agenda": data.get('agenda', ''),
        "priority": data.get('priority', 1),
        "created_at": datetime.now().isoformat()
    }
    
    events.append(new_event)
    return jsonify(new_event), 201

@app.route('/api/events/<event_id>', methods=['GET'])
def get_event(event_id):
    event = next((e for e in events if e['id'] == event_id), None)
    if event:
        return jsonify(event)
    return jsonify({"error": "Event not found"}), 404

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.get_json()
    event = next((e for e in events if e['id'] == event_id), None)
    
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    # Update event fields
    for key in data:
        if key != 'id' and key != 'created_at':  # Don't allow changing id or creation timestamp
            event[key] = data[key]
    
    return jsonify(event)

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    global events
    initial_length = len(events)
    events = [e for e in events if e['id'] != event_id]
    
    if len(events) < initial_length:
        return jsonify({"message": "Event deleted successfully"})
    return jsonify({"error": "Event not found"}), 404

# Tasks API
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    # Optional filter by priority
    priority = request.args.get('priority')
    if priority:
        try:
            priority = int(priority)
            filtered_tasks = [t for t in tasks if t['priority'] == priority]
            return jsonify(filtered_tasks)
        except ValueError:
            return jsonify({"error": "Priority must be a number"}), 400
    
    # Optional filter by status
    status = request.args.get('status')
    if status:
        filtered_tasks = [t for t in tasks if t['status'] == status]
        return jsonify(filtered_tasks)
    
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    # Validate required fields
    if not data or not 'task_name' in data:
        return jsonify({"error": "Task name is required"}), 400
    
    # Create new task
    new_task = {
        "id": str(uuid.uuid4()),
        "task_name": data['task_name'],
        "description": data.get('description', ''),
        "due_date": data.get('due_date'),
        "priority": data.get('priority', 3),  # Default medium priority
        "status": data.get('status', 'pending'),
        "tags": data.get('tags', []),
        "created_at": datetime.now().isoformat()
    }
    
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route('/api/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    if task:
        return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    task = next((t for t in tasks if t['id'] == task_id), None)
    
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    # Update task fields
    for key in data:
        if key != 'id' and key != 'created_at':  # Don't allow changing id or creation timestamp
            task[key] = data[key]
    
    # Add completion timestamp if task is marked as completed
    if data.get('status') == 'completed' and task['status'] != 'completed':
        task['completed_at'] = datetime.now().isoformat()
    
    return jsonify(task)

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    initial_length = len(tasks)
    tasks = [t for t in tasks if t['id'] != task_id]
    
    if len(tasks) < initial_length:
        return jsonify({"message": "Task deleted successfully"})
    return jsonify({"error": "Task not found"}), 404

# User authentication routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check required fields
    if not data or not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if user already exists
    if any(u['username'] == data['username'] for u in users):
        return jsonify({"error": "Username already taken"}), 400
    
    if any(u['email'] == data['email'] for u in users):
        return jsonify({"error": "Email already registered"}), 400
    
    # Create new user
    new_user = {
        "id": str(uuid.uuid4()),
        "username": data['username'],
        "email": data['email'],
        "password_hash": data['password'],  # In a real app, hash the password
        "created_at": datetime.now().isoformat()
    }
    
    users.append(new_user)
    
    # Return user without password
    user_response = {**new_user}
    del user_response['password_hash']
    
    return jsonify(user_response), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Check required fields
    if not data or not all(k in data for k in ('username', 'password')):
        return jsonify({"error": "Missing username or password"}), 400
    
    # Find user by username
    user = next((u for u in users if u['username'] == data['username']), None)
    
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401
    
    # Check password (in a real app, verify hash)
    if user['password_hash'] != data['password']:
        return jsonify({"error": "Invalid username or password"}), 401
    
    # Return user without password
    user_response = {**user}
    del user_response['password_hash']
    
    return jsonify({
        "message": "Login successful",
        "user": user_response
    })

# Scheduling helper endpoint
@app.route('/api/schedule/suggestions', methods=['POST'])
def get_schedule_suggestions():
    data = request.get_json()
    
    if not data or not 'tasks' in data:
        return jsonify({"error": "Please provide tasks to schedule"}), 400
    
    # Get tasks to schedule (either IDs or task objects)
    tasks_to_schedule = []
    
    # If task IDs are provided
    if all(isinstance(t, str) for t in data['tasks']):
        for task_id in data['tasks']:
            task = next((t for t in tasks if t['id'] == task_id), None)
            if task:
                tasks_to_schedule.append(task)
    else:
        tasks_to_schedule = data['tasks']
    
    # Sort tasks by priority and due date
    def get_sort_key(task):
        priority = task.get('priority', 3)
        due_date = task.get('due_date', '9999-12-31')  # Default far future date
        return (priority, due_date)
    
    sorted_tasks = sorted(tasks_to_schedule, key=get_sort_key)
    
    return jsonify({
        "suggested_schedule": sorted_tasks,
        "scheduling_notes": "Tasks are arranged by priority (highest first) and then by due date."
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)