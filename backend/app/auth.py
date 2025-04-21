import jwt
import bcrypt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from .database import get_user_by_email, create_user

# Load environment variables
load_dotenv()

# Get JWT secret from environment variable or use default
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DELTA = timedelta(days=1)

def hash_password(password):
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def verify_password(password, password_hash):
    """Verify a password against its hash."""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash)

def generate_token(user_id):
    """Generate a JWT token for a user."""
    payload = {
        'user_id': str(user_id),
        'exp': datetime.utcnow() + JWT_EXPIRATION_DELTA
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token):
    """Verify a JWT token and return the user ID if valid."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def register_user(username, email, password):
    """Register a new user."""
    # Check if user already exists
    if get_user_by_email(email):
        return None, "Email already registered"
    
    # Hash password and create user
    password_hash = hash_password(password)
    user = create_user(username, email, password_hash)
    
    # Generate token
    token = generate_token(user['_id'])
    return token, None

def login_user(email, password):
    """Login a user and return a token if successful."""
    user = get_user_by_email(email)
    if not user:
        return None, "User not found"
    
    if not verify_password(password, user['password_hash']):
        return None, "Invalid password"
    
    token = generate_token(user['_id'])
    return token, None 