# Dynamic Scheduling Design

## Overview of Project

This project is a smart scheduling tool that helps users manage their time more efficiently. It resolves conflicts, ranks tasks based on priority, and uses NLP to extract tasks from user input and provide scheduling suggestions. The goal is to make scheduling intuitive and effortless, allowing users to focus on what matters most.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, MUI  
- **Backend:** Flask (Python)  
- **Database:** MongoDB  
- **Authentication:** Firebase  

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

https://www.figma.com/design/QuG2TkOvMMlQ7weMrOqUkn/Dynamic-Scheduling-Tool?node-id=0-1&p=f&t=aUObLjbO1UEJQVmK-0

