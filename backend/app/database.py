from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variable
MONGO_URI = os.getenv('MONGO_URI')
DB_NAME = os.getenv('DB_NAME', 'dynamic_scheduling')

# Create MongoDB client
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db.users
events_collection = db.events

def init_db():
    """Initialize the database with required indexes and collections."""
    # Create indexes
    users_collection.create_index('email', unique=True)
    users_collection.create_index('username', unique=True)
    events_collection.create_index([('user_id', 1), ('date', 1)])
    events_collection.create_index('date')
    
    # Check if we need to insert initial data
    if users_collection.count_documents({}) == 0:
        # Insert a default user for testing
        users_collection.insert_one({
            'email': 'test@example.com',
            'password': 'password123',  # In production, this should be hashed
            'name': 'Test User',
            'profile_image': None
        })

    # Check if we need to create a demo user
    if users_collection.count_documents({}) == 0:
        from .models import User
        demo_user = User(
            first_name="Demo",
            last_name="User",
            email="demo@example.com",
            password="password"  # In a real app, this should be hashed
        )
        users_collection.insert_one(demo_user.to_dict())
        print("Created demo user")

# User operations
def create_user(username, email, password_hash):
    """Create a new user in the database."""
    user_data = {
        'username': username,
        'email': email,
        'password_hash': password_hash,
        'created_at': datetime.utcnow()
    }
    result = users_collection.insert_one(user_data)
    user_data['_id'] = result.inserted_id
    return user_data

def get_user_by_email(email):
    """Get a user by email."""
    return users_collection.find_one({'email': email})

def get_user_by_id(user_id):
    """Get a user by ID."""
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    return users_collection.find_one({'_id': user_id})

# Event operations
def create_event(event_data):
    """Create a new event in the database."""
    result = events_collection.insert_one(event_data)
    event_data['_id'] = result.inserted_id
    return event_data

def get_events_by_user(user_id, start_date=None, end_date=None):
    """Get events for a user within a date range."""
    query = {'user_id': user_id}
    if start_date and end_date:
        query['date'] = {'$gte': start_date, '$lte': end_date}
    return list(events_collection.find(query).sort('date', 1))

def get_event_by_id(event_id):
    """Get an event by ID."""
    if isinstance(event_id, str):
        event_id = ObjectId(event_id)
    return events_collection.find_one({'_id': event_id})

def update_event(event_id, update_data):
    """Update an event."""
    if isinstance(event_id, str):
        event_id = ObjectId(event_id)
    result = events_collection.update_one(
        {'_id': event_id},
        {'$set': update_data}
    )
    return result.modified_count > 0

def delete_event(event_id):
    """Delete an event."""
    if isinstance(event_id, str):
        event_id = ObjectId(event_id)
    result = events_collection.delete_one({'_id': event_id})
    return result.deleted_count > 0 