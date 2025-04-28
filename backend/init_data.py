from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime
from app.models import User, Event, Participant

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variable
MONGO_URI = os.getenv('MONGO_URI')
DB_NAME = os.getenv('DB_NAME', 'dynamic_scheduling')

def init_test_data():
    """Initialize test data in MongoDB"""
    try:
        # Create MongoDB client
        client = MongoClient(MONGO_URI)
        
        # Test the connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # Get database
        db = client[DB_NAME]
        print(f"✅ Successfully accessed database: {DB_NAME}")
        
        # Create test users
        print("\nCreating test users...")
        users = [
            User(
                first_name="John",
                last_name="Doe",
                email="john@example.com",
                password_hash="hashed_password_1"
            ),
            User(
                first_name="Jane",
                last_name="Smith",
                email="jane@example.com",
                password_hash="hashed_password_2"
            )
        ]
        
        # Insert users
        user_ids = []
        for user in users:
            result = db.users.insert_one(user.to_dict())
            user_ids.append(result.inserted_id)
            print(f"✅ Created user: {user.first_name} {user.last_name}")
        
        # Create test events
        print("\nCreating test events...")
        events = [
            Event(
                title="Team Meeting",
                description="Weekly team sync",
                date=datetime.utcnow(),
                time="10:00",
                priority=1,
                category="Work",
                user_id=user_ids[0]
            ),
            Event(
                title="Project Review",
                description="Review project progress",
                date=datetime.utcnow(),
                time="14:00",
                priority=2,
                category="Work",
                user_id=user_ids[1]
            )
        ]
        
        # Insert events
        for event in events:
            result = db.events.insert_one(event.to_dict())
            print(f"✅ Created event: {event.title}")
            
            # Add participants to events
            participants = [
                Participant(
                    name="Alice",
                    email="alice@example.com",
                    role="Attendee"
                ),
                Participant(
                    name="Bob",
                    email="bob@example.com",
                    role="Presenter"
                )
            ]
            
            # Update event with participants
            db.events.update_one(
                {"_id": result.inserted_id},
                {"$set": {"participants": [p.to_dict() for p in participants]}}
            )
            print(f"✅ Added participants to event: {event.title}")
        
        print("\n✅ Test data initialization complete!")
        return True
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Initializing test data in MongoDB...")
    init_test_data() 