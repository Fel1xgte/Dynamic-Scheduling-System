from flask import Flask, jsonify, request
from datetime import datetime
import json
import uuid
from flask_cors import CORS
from app.database import init_db, create_user, get_user_by_email, create_event, get_events_by_user, get_event_by_id, update_event, delete_event
from app.auth import hash_password, verify_password, generate_token, verify_token
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize database
init_db()

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
    # Get token from header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Get date range from query parameters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Get events
    events = get_events_by_user(user_id, start_date, end_date)
    
    # Convert ObjectId to string for JSON serialization
    for event in events:
        event['_id'] = str(event['_id'])
        event['user_id'] = str(event['user_id'])
    
    return jsonify(events)

@app.route('/api/events', methods=['POST'])
def add_event():
    # Get token from header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    data = request.json
    title = data.get('title')
    description = data.get('description')
    date = data.get('date')
    time = data.get('time')
    priority = data.get('priority')
    category = data.get('category')
    
    if not all([title, date, time, priority, category]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create event
    event_data = {
        'user_id': user_id,
        'title': title,
        'description': description,
        'date': date,
        'time': time,
        'priority': priority,
        'category': category
    }
    
    event = create_event(event_data)
    
    # Convert ObjectId to string for JSON serialization
    event['_id'] = str(event['_id'])
    event['user_id'] = str(event['user_id'])
    
    return jsonify(event), 201

@app.route('/api/events/<event_id>', methods=['GET'])
def get_event(event_id):
    # Get token from header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Get event
    event = get_event_by_id(event_id)
    
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    # Check if user owns the event
    if str(event['user_id']) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Convert ObjectId to string for JSON serialization
    event['_id'] = str(event['_id'])
    event['user_id'] = str(event['user_id'])
    
    return jsonify(event)

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event_route(event_id):
    # Get token from header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Get event
    event = get_event_by_id(event_id)
    
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    # Check if user owns the event
    if str(event['user_id']) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Get update data
    data = request.json
    
    # Update event
    success = update_event(event_id, data)
    
    if not success:
        return jsonify({'error': 'Failed to update event'}), 500
    
    # Get updated event
    updated_event = get_event_by_id(event_id)
    
    # Convert ObjectId to string for JSON serialization
    updated_event['_id'] = str(updated_event['_id'])
    updated_event['user_id'] = str(updated_event['user_id'])
    
    return jsonify(updated_event)

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event_route(event_id):
    # Get token from header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    # Get event
    event = get_event_by_id(event_id)
    
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    # Check if user owns the event
    if str(event['user_id']) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Delete event
    success = delete_event(event_id)
    
    if not success:
        return jsonify({'error': 'Failed to delete event'}), 500
    
    return jsonify({'message': 'Event deleted successfully'})

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
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not all([username, email, password]):
        return jsonify({'error': 'All fields are required'}), 400
    
    # Check if user already exists
    if get_user_by_email(email):
        return jsonify({'error': 'Email already registered'}), 409
    
    # Hash password and create user
    password_hash = hash_password(password)
    user = create_user(username, email, password_hash)
    
    # Generate token
    token = generate_token(user['_id'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email']
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Get user by email
    user = get_user_by_email(email)
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Verify password
    if not verify_password(password, user['password_hash']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Generate token
    token = generate_token(user['_id'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email']
        }
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