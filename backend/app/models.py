from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self, username, email, password_hash, created_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.created_at = created_at if created_at else datetime.utcnow()
    
    def to_dict(self):
        return {
            '_id': self._id,
            'username': self.username,
            'email': self.email,
            'password_hash': self.password_hash,
            'created_at': self.created_at
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            _id=data.get('_id'),
            username=data.get('username'),
            email=data.get('email'),
            password_hash=data.get('password_hash'),
            created_at=data.get('created_at')
        )

class Participant:
    def __init__(self, name="", email=""):
        self.name = name
        self.email = email
    
    def to_dict(self):
        return {
            "name": self.name,
            "email": self.email
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data.get("name", ""),
            email=data.get("email", "")
        )

class Event:
    def __init__(self, title, description, date, time, priority, category, user_id, created_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.title = title
        self.description = description
        self.date = date
        self.time = time
        self.priority = priority
        self.category = category
        self.user_id = user_id
        self.created_at = created_at if created_at else datetime.utcnow()
    
    def to_dict(self):
        return {
            '_id': self._id,
            'title': self.title,
            'description': self.description,
            'date': self.date,
            'time': self.time,
            'priority': self.priority,
            'category': self.category,
            'user_id': self.user_id,
            'created_at': self.created_at
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            _id=data.get('_id'),
            title=data.get('title'),
            description=data.get('description'),
            date=data.get('date'),
            time=data.get('time'),
            priority=data.get('priority'),
            category=data.get('category'),
            user_id=data.get('user_id'),
            created_at=data.get('created_at')
        ) 