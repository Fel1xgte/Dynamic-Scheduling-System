# Dynamic Scheduling Design

## Overview of Project

This project is a smart scheduling tool that helps users manage their time more efficiently. It resolves conflicts, ranks tasks based on priority, and uses NLP to extract tasks from user input and provide scheduling suggestions. The goal is to make scheduling intuitive and effortless, allowing users to focus on what matters most.

## Tech Stack

- **Frontend:** React.js, CSS, MUI  
- **Backend:** Flask (Python)  
- **Database:** MongoDB  
- **Authentication:** Firebase

## Setup Instructions

### Backend Setup

1. **Create and activate a virtual environment:**

```bash
cd backend
python -m venv venv

# On macOS/Linux
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

## 2. Install dependencies:

```
pip install flask flask-cors
```

## 3. Run the backend server:

```
python app.py
```
The backend server will run on http://localhost:5000

### Frontend Setup

## 1. Install dependencies:

```
cd frontend
npm install
```

## 2. Run the frontend development server:

```
npm start
```
The frontend will run on http://localhost:3000

## Using the Application

### Login Credentials

Use the following credentials to log in:

Username: admin

Password: password123

## Architecture

### How It Works

1. **User Input:** Users enter tasks or events through the frontend.  
2. **Data Processing:** The backend extracts relevant details using NLP, ranks tasks based on priority, and resolves conflicts.  
3. **Storage & Retrieval:** Processed events are stored in MongoDB and retrieved when needed.  
4. **Suggestions & Updates:** The system provides optimized scheduling suggestions and updates the user's calendar.

## Key Components

### Frontend

- User interface for adding and managing tasks  
- Integration with Google Calendar  
- User authentication (Firebase)  
- Display of optimized schedules  

### Backend

- Handles API requests and task processing  
- Uses NLP to extract and rank tasks  
- Resolves scheduling conflicts  
- Connects with MongoDB for storage  

### Database (MongoDB)

- Stores user profiles, events, and scheduling preferences  
- Keeps a history of changes for tracking

## Wireframe

Link to our Figma Wireframe: 

<img width="482" alt="Screenshot 2025-03-31 at 7 17 44 PM" src="https://github.com/user-attachments/assets/2083de92-6dfa-4a14-bb86-3a4f79408648" />


https://www.figma.com/design/QuG2TkOvMMlQ7weMrOqUkn/Dynamic-Scheduling-Tool?node-id=0-1&p=f&t=aUObLjbO1UEJQVmK-0

