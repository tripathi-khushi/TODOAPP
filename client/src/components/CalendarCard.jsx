import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowUpRight, Calendar as CalIcon } from 'lucide-react';

export const CalendarCard = ({ scheduleItems = [] }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());

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

  // Generate calendar grid for current selected month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // 0 is Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];
  // Previous month padding
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const isSelected = i === selectedDay;
    calendarDays.push({ 
      day: i, 
      isCurrentMonth: true, 
      isToday, 
      isSelected 
    });
  }
  // Next month padding
  const remaining = 35 - calendarDays.length;
  for (let i = 1; i <= (remaining >= 0 ? remaining : 42 - calendarDays.length); i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  // Real or Fallback Schedule items
  const defaultSchedule = [
    { dateNum: '18', title: 'Robotics Kinematics & Lab', time: '19:30', id: '1' },
    { dateNum: '19', title: 'Electronics Sensor Circuit', time: '16:00', id: '2' },
    { dateNum: '20', title: 'C++ Design Assignment', time: '17:30', id: '3' },
  ];

  const items = scheduleItems.length > 0 ? scheduleItems.map((item, idx) => ({
    dateNum: item.dueDate ? new Date(item.dueDate).getDate().toString().padStart(2, '0') : '01',
    title: item.title,
    time: item.time || '12:00',
    id: item._id || idx,
  })) : defaultSchedule;

  return (
    <div className="card-soft schedule-widget-card">
      <div className="card-header-simple" style={{ marginBottom: '12px' }}>
        <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalIcon size={18} />
          My schedule
        </h3>
        <span style={{ fontSize: '0.78rem', color: '#8c7185', fontWeight: 600 }}>
          {monthNames[month]} {year}
        </span>
      </div>

      <div className="schedule-layout-grid">
        {/* Left: Interactive Calendar */}
        <div className="calendar-box">
          <div className="calendar-nav-header">
            <button className="cal-arrow-btn" onClick={prevMonth} title="Previous Month" id="btn-prev-month">
              <ChevronLeft size={14} />
            </button>
            <span className="cal-month-title">{monthNames[month]} {year}</span>
            <button className="cal-arrow-btn" onClick={nextMonth} title="Next Month" id="btn-next-month">
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
              <button
                key={index}
                type="button"
                className={`cal-day-cell ${!d.isCurrentMonth ? 'inactive' : ''} ${d.isSelected ? 'selected' : ''} ${d.isToday ? 'today-ring' : ''}`}
                onClick={() => {
                  if (d.isCurrentMonth) {
                    setSelectedDay(d.day);
                  }
                }}
                style={{
                  border: 'none',
                  cursor: d.isCurrentMonth ? 'pointer' : 'default',
                  background: d.isSelected ? '#624b5d' : 'transparent',
                  color: d.isSelected ? '#ffffff' : (!d.isCurrentMonth ? '#cfc2cc' : 'var(--text-primary)'),
                }}
                title={d.isCurrentMonth ? `${monthNames[month]} ${d.day}, ${year}` : ''}
              >
                <span>{d.day}</span>
              </button>
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
                  title="View Task Details"
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
