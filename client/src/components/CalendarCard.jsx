import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowUpRight } from 'lucide-react';

export const CalendarCard = ({ scheduleItems = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 18)); // May 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar grid for month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // 0 is Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Previous month padding
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true, isSelected: i === 18 && month === 4 });
  }
  // Next month padding
  const remaining = 35 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  // Sample or API fallback schedule items matching reference
  const defaultSchedule = [
    { dateNum: '18', title: 'Robotics lesson', time: '19:30', id: '1' },
    { dateNum: '19', title: 'Electronics lesson', time: '16:00', id: '2' },
    { dateNum: '20', title: 'C++ lesson', time: '17:30', id: '3' },
  ];

  const items = scheduleItems.length > 0 ? scheduleItems.map((item, idx) => ({
    dateNum: new Date(item.dueDate).getDate().toString().padStart(2, '0'),
    title: item.title,
    time: item.time || '12:00',
    id: item._id || idx,
  })) : defaultSchedule;

  return (
    <div className="card-soft schedule-widget-card">
      <h3 className="card-title">My schedule</h3>

      <div className="schedule-layout-grid">
        {/* Left: Mini Interactive Calendar */}
        <div className="calendar-box">
          <div className="calendar-nav-header">
            <button className="cal-arrow-btn" onClick={prevMonth} title="Previous Month">
              <ChevronLeft size={14} />
            </button>
            <span className="cal-month-title">{monthNames[month]} {year}</span>
            <button className="cal-arrow-btn" onClick={nextMonth} title="Next Month">
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="calendar-grid-header">
            {daysOfWeek.map((d) => (
              <span key={d} className="cal-weekday">{d}</span>
            ))}
          </div>

          <div className="calendar-grid-days">
            {calendarDays.slice(0, 35).map((d, index) => (
              <div 
                key={index} 
                className={`cal-day-cell ${!d.isCurrentMonth ? 'inactive' : ''} ${d.isSelected ? 'selected' : ''}`}
              >
                <span>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Lesson & Task Pills */}
        <div className="schedule-pills-list">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="schedule-pill-item">
              <div className="date-badge-box">
                <span className="date-number">{item.dateNum}</span>
              </div>
              <div className="pill-content">
                <h5 className="pill-title">{item.title}</h5>
                <span className="pill-time">
                  <Clock size={12} />
                  {item.time}
                </span>
              </div>
              {item.id && typeof item.id === 'string' && item.id.length > 10 && (
                <a 
                  href={`/todo.html?todo_id=${item.id}`} 
                  className="pill-link-btn"
                  title="View Todo Details"
                >
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CalendarCard;
