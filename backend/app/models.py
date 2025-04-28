from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self, first_name, last_name, email, password_hash):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password_hash = password_hash
        self.created_at = datetime.utcnow()
        self.profile_image = None

    def to_dict(self):
        return {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'password_hash': self.password_hash,
            'created_at': self.created_at,
            'profile_image': self.profile_image
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=data.get('email'),
            password_hash=data.get('password_hash')
        )

class Participant:
    def __init__(self, name, email, role):
        self.name = name
        self.email = email
        self.role = role

    def to_dict(self):
        return {
            'name': self.name,
            'email': self.email,
            'role': self.role
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data.get('name'),
            email=data.get('email'),
            role=data.get('role')
        )

class Event:
    def __init__(self, title, description, date, time, priority, category, user_id):
        self.title = title
        self.description = description
        self.date = date
        self.time = time
        self.priority = priority
        self.category = category
        self.user_id = user_id
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
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
            title=data.get('title'),
            description=data.get('description'),
            date=data.get('date'),
            time=data.get('time'),
            priority=data.get('priority'),
            category=data.get('category'),
            user_id=data.get('user_id')
        ) 