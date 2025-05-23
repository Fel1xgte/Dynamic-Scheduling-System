from flask import Blueprint, request, jsonify, send_from_directory, current_app
import os
import uuid
from werkzeug.utils import secure_filename
from bson import ObjectId
from datetime import datetime

from .database import users_collection, events_collection
from .models import User, Event, Participant
from .auth import token_required, hash_password, verify_password, generate_token

main = Blueprint('main', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@main.route('/api/login', methods=['POST'])
def login():
    data = request.json
    identifier = data.get('identifier')  # This can be either username or email
    password = data.get('password')
    
    if not identifier or not password:
        return jsonify({'error': 'Username/email and password are required'}), 400
    
    # Try to find user by email first
    user_data = users_collection.find_one({"email": identifier})
    
    # If not found by email, try username
    if not user_data:
        user_data = users_collection.find_one({"username": identifier})
    
    if not user_data:
        return jsonify({'error': 'Invalid username/email or password'}), 401
    
    # Check if user has password_hash field
    if 'password_hash' not in user_data:
        return jsonify({'error': 'User account needs to be reset. Please contact support.'}), 401
    
    # Verify password
    if not verify_password(password, user_data['password_hash']):
        return jsonify({'error': 'Invalid username/email or password'}), 401
    
    # Generate token
    token = generate_token(str(user_data['_id']))
    
    # Convert ObjectId to string for JSON serialization
    user_data['user_id'] = str(user_data['_id'])
    
    # Remove sensitive data
    user_data.pop('password_hash', None)
    user_data.pop('_id', None)
    
    return jsonify({
        'success': True,
        'token': token,
        'user': user_data
    })

@main.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    first_name = data.get('first_name', '')  # Optional
    last_name = data.get('last_name', '')    # Optional
    
    if not email or not username or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    # Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({'error': 'Email already registered'}), 400
    
    if users_collection.find_one({"username": username}):
        return jsonify({'error': 'Username already taken'}), 400
    
    # Hash password
    password_hash = hash_password(password)
    
    # Create user
    user_data = {
        'email': email,
        'username': username,
        'first_name': first_name,
        'last_name': last_name,
        'password_hash': password_hash,
        'created_at': datetime.utcnow()
    }
    
    result = users_collection.insert_one(user_data)
    user_data['_id'] = str(result.inserted_id)
    
    return jsonify({
        'success': True,
        'message': 'Registration successful'
    }), 201

@main.route('/api/user/<user_id>', methods=['GET'])
@token_required
def get_user(user_id, **kwargs):
    try:
        user_data = users_collection.find_one({"_id": ObjectId(user_id)})
        
        if user_data:
            user_data['user_id'] = str(user_data['_id'])
            user_data.pop('password_hash', None)
            user_data.pop('_id', None)
            return jsonify(user_data)
        
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/api/upload-profile-image', methods=['POST'])
@token_required
def upload_profile_image(**kwargs):
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    user_id = kwargs['user_id']
    
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
@token_required
def get_events(**kwargs):
    user_id = kwargs['user_id']
    
    try:
        # Find events for the user
        events = list(events_collection.find({"user_id": ObjectId(user_id)}))
        
        # Convert ObjectId to string for JSON serialization
        for event in events:
            event['event_id'] = str(event['_id'])
            event['user_id'] = str(event['user_id'])
            # Convert datetime to ISO format string
            if 'date' in event:
                event['date'] = event['date'].isoformat()
            event.pop('_id', None)
        
        return jsonify(events)
    except Exception as e:
        print(f"Error in get_events: {str(e)}")  # Add logging
        return jsonify({'error': str(e)}), 400

@main.route('/api/events', methods=['POST'])
@token_required
def create_event(**kwargs):
    data = request.json
    user_id = kwargs['user_id']
    
    try:
        # Create new event
        event_data = {
            'user_id': ObjectId(user_id),
            'title': data.get('title'),
            'description': data.get('description', ''),
            'date': datetime.fromisoformat(data.get('date')),
            'time': data.get('time'),
            'priority': data.get('priority'),
            'category': data.get('category'),
            'created_at': datetime.utcnow()
        }
        
        # Insert event into database
        result = events_collection.insert_one(event_data)
        
        # Get the created event
        event_data = events_collection.find_one({"_id": result.inserted_id})
        event_data['event_id'] = str(event_data['_id'])
        event_data['user_id'] = str(event_data['user_id'])
        event_data['date'] = event_data['date'].isoformat()
        event_data.pop('_id', None)
        
        return jsonify({'success': True, 'event': event_data}), 201
    except Exception as e:
        print(f"Error in create_event: {str(e)}")  # Add logging
        return jsonify({'error': str(e)}), 400

@main.route('/api/events/<event_id>', methods=['GET'])
@token_required
def get_event(event_id, **kwargs):
    try:
        event_data = events_collection.find_one({"_id": ObjectId(event_id)})
        
        if not event_data:
            return jsonify({'error': 'Event not found'}), 404
            
        # Check if user owns the event
        if str(event_data['user_id']) != kwargs['user_id']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        event_data['event_id'] = str(event_data['_id'])
        event_data['user_id'] = str(event_data['user_id'])
        event_data['date'] = event_data['date'].isoformat()
        event_data.pop('_id', None)
        
        return jsonify(event_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/api/events/<event_id>', methods=['PUT'])
@token_required
def update_event(event_id, **kwargs):
    data = request.json
    
    try:
        event_data = events_collection.find_one({"_id": ObjectId(event_id)})
        
        if not event_data:
            return jsonify({'error': 'Event not found'}), 404
            
        # Check if user owns the event
        if str(event_data['user_id']) != kwargs['user_id']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update event
        result = events_collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": data}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'No changes made'}), 400
        
        # Get updated event
        updated_event = events_collection.find_one({"_id": ObjectId(event_id)})
        updated_event['event_id'] = str(updated_event['_id'])
        updated_event['user_id'] = str(updated_event['user_id'])
        updated_event['date'] = updated_event['date'].isoformat()
        updated_event.pop('_id', None)
            
        return jsonify({'success': True, 'event': updated_event})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@main.route('/api/events/<event_id>', methods=['DELETE'])
@token_required
def delete_event(event_id, **kwargs):
    try:
        event_data = events_collection.find_one({"_id": ObjectId(event_id)})
        
        if not event_data:
            return jsonify({'error': 'Event not found'}), 404
            
        # Check if user owns the event
        if str(event_data['user_id']) != kwargs['user_id']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Delete event
        result = events_collection.delete_one({"_id": ObjectId(event_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Failed to delete event'}), 400
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 400 