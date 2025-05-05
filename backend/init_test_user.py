import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import users_collection
from app.auth import hash_password
from datetime import datetime

def init_test_user():
    # Create test user with hashed password
    password_hash = hash_password('test123')
    test_user = {
        'email': 'test2@example.com',
        'password_hash': password_hash,
        'username': 'testuser2',
        'name': 'Test User',
        'profile_image': None,
        'created_at': datetime.utcnow()
    }
    
    # Insert test user
    result = users_collection.insert_one(test_user)
    print(f"Created test user with ID: {result.inserted_id}")
    print("Test user credentials:")
    print("Email: test2@example.com")
    print("Password: test123")

if __name__ == '__main__':
    init_test_user() 