import React from 'react';
import '../styles/Calendar.css';

const Calendar = ({ tasks = [] }) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Function to get tasks for a specific day
  const getTasksForDay = (day) => {
    return tasks.filter(task => task.day === day);
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = 42; // 6 rows × 7 columns

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDay(day);
      const hasTasks = dayTasks.length > 0;
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${day === currentDay ? 'active' : ''} ${hasTasks ? 'has-tasks' : ''}`}
        >
          <div className="day-number">{day}</div>
          {hasTasks && (
            <div className="day-tasks">
              {dayTasks.slice(0, 2).map(task => (
                <div 
                  key={task.id} 
                  className={`task-dot task-${task.priority}`}
                  title={task.title}
                ></div>
              ))}
              {dayTasks.length > 2 && (
                <div className="more-tasks">+{dayTasks.length - 2}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Add remaining empty cells to complete the grid
    const remainingDays = totalDays - (firstDayOfMonth + daysInMonth);
    for (let i = 0; i < remainingDays; i++) {
      days.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
    }

    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="weekday">Su</div>
        <div className="weekday">Mo</div>
        <div className="weekday">Tu</div>
        <div className="weekday">We</div>
        <div className="weekday">Th</div>
        <div className="weekday">Fr</div>
        <div className="weekday">Sa</div>
      </div>
      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar; 