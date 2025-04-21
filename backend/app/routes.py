from flask import Blueprint, request, jsonify, send_from_directory, current_app
import os
import uuid
from werkzeug.utils import secure_filename
from bson import ObjectId
from datetime import datetime

from .database import users_collection, events_collection
from .models import User, Event, Participant

main = Blueprint('main', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@main.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Find user by email
    user_data = users_collection.find_one({"email": email})
    
    if user_data and user_data['password'] == password:
        # Convert ObjectId to string for JSON serialization
        user_data['user_id'] = str(user_data['user_id'])
        
        # Remove password from response
        user_data.pop('password', None)
        
        return jsonify({'success': True, 'user': user_data})
    
    return jsonify({'error': 'Invalid email or password'}), 401

@main.route('/api/register', methods=['POST'])
def register():
    data = request.json
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    
    if not all([first_name, last_name, email, password]):
        return jsonify({'error': 'All fields are required'}), 400
    
    # Check if email already exists
    if users_collection.find_one({"email": email}):
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create new user
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password  # In a real app, this should be hashed
    )
    
    # Insert user into database
    result = users_collection.insert_one(new_user.to_dict())
    
    # Get the created user
    user_data = users_collection.find_one({"_id": result.inserted_id})
    user_data['user_id'] = str(user_data['user_id'])
    user_data.pop('password', None)
    
    return jsonify({'success': True, 'user': user_data}), 201

@main.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user_data = users_collection.find_one({"_id": ObjectId(user_id)})
        
        if user_data:
            user_data['user_id'] = str(user_data['user_id'])
            user_data.pop('password', None)
            return jsonify(user_data)
        
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/api/upload-profile-image', methods=['POST'])
def upload_profile_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    user_id = request.form.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    try:
        # Generate a unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{user_id}_{uuid.uuid4().hex}_{filename}"
        
        # Save the file
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        
        # Update user profile image in database
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"profile_image": unique_filename}}
        )
        
        return jsonify({
            'success': True,
            'image_url': f"/api/profile-image/{unique_filename}"
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/api/profile-image/<filename>')
def get_profile_image(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

# Event routes
@main.route('/api/events', methods=['GET'])
def get_events():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Find events for the user
        events = list(events_collection.find({"user_id": ObjectId(user_id)}))
        
        # Convert ObjectId to string for JSON serialization
        for event in events:
            event['event_id'] = str(event['event_id'])
            event['user_id'] = str(event['user_id'])
            # Convert datetime to ISO format string
            if 'date' in event:
                event['date'] = event['date'].isoformat()
        
        return jsonify(events)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/api/events', methods=['POST'])
def create_event():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Create new event
        new_event = Event.from_dict(data)
        new_event.user_id = ObjectId(user_id)
        
        # Insert event into database
        result = events_collection.insert_one(new_event.to_dict())
        
        # Get the created event
        event_data = events_collection.find_one({"_id": result.inserted_id})
        event_data['event_id'] = str(event_data['event_id'])
        event_data['user_id'] = str(event_data['user_id'])
        event_data['date'] = event_data['date'].isoformat()
        
        return jsonify({'success': True, 'event': event_data}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/api/events/<event_id>', methods=['GET'])
def get_event(event_id):
    try:
        event_data = events_collection.find_one({"_id": ObjectId(event_id)})
        
        if event_data:
            event_data['event_id'] = str(event_data['event_id'])
            event_data['user_id'] = str(event_data['user_id'])
            event_data['date'] = event_data['date'].isoformat()
            return jsonify(event_data)
        
        return jsonify({'error': 'Event not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.json
    
    try:
        # Update event in database
        result = events_collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": data}
        )
        
        if result.modified_count > 0:
            # Get the updated event
            event_data = events_collection.find_one({"_id": ObjectId(event_id)})
            event_data['event_id'] = str(event_data['event_id'])
            event_data['user_id'] = str(event_data['user_id'])
            event_data['date'] = event_data['date'].isoformat()
            
            return jsonify({'success': True, 'event': event_data})
        
        return jsonify({'error': 'Event not found or no changes made'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        result = events_collection.delete_one({"_id": ObjectId(event_id)})
        
        if result.deleted_count > 0:
            return jsonify({'success': True})
        
        return jsonify({'error': 'Event not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400 