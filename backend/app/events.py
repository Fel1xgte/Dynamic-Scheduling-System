from datetime import datetime
from .database import (
    create_event,
    get_events_by_user,
    get_event_by_id,
    update_event,
    delete_event
)

def create_new_event(user_id, title, description, date, time, priority, category):
    """Create a new event for a user."""
    event_data = {
        'user_id': user_id,
        'title': title,
        'description': description,
        'date': date,
        'time': time,
        'priority': priority,
        'category': category,
        'created_at': datetime.utcnow()
    }
    return create_event(event_data)

def get_user_events(user_id, start_date=None, end_date=None):
    """Get all events for a user, optionally filtered by date range."""
    events = get_events_by_user(user_id)
    
    if start_date and end_date:
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        events = [
            event for event in events
            if start <= datetime.fromisoformat(event['date']) <= end
        ]
    
    return events

def get_single_event(event_id):
    """Get a single event by ID."""
    return get_event_by_id(event_id)

def modify_event(event_id, user_id, updates):
    """Update an existing event."""
    event = get_event_by_id(event_id)
    if not event:
        return None, "Event not found"
    
    if event['user_id'] != user_id:
        return None, "Unauthorized"
    
    # Update only provided fields
    for key, value in updates.items():
        if key in event:
            event[key] = value
    
    updated_event = update_event(event_id, event)
    return updated_event, None

def remove_event(event_id, user_id):
    """Delete an event."""
    event = get_event_by_id(event_id)
    if not event:
        return "Event not found"
    
    if event['user_id'] != user_id:
        return "Unauthorized"
    
    delete_event(event_id)
    return None 