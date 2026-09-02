import React, { useState } from 'react';
import { Calendar as CalIcon, Clock, ChevronLeft, ChevronRight, Plus, MapPin, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const ScheduleView = ({ todos = [], onOpenAddModal }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ 
      day: i, 
      isCurrentMonth: true, 
      isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
      isSelected: i === selectedDay 
    });
  }
  const remaining = 35 - calendarDays.length;
  for (let i = 1; i <= (remaining >= 0 ? remaining : 42 - calendarDays.length); i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  // Format real tasks from MongoDB into timetable agenda
  const userScheduledItems = todos.filter(t => t.dueDate).map((t, idx) => ({
    id: t._id || idx,
    title: t.title,
    time: t.time || '12:00',
    day: new Date(t.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    room: t.category === 'Academic' ? 'Lecture Hall A' : 'Robotics Studio',
    category: t.category,
    status: t.isCompleted ? 'Completed' : (t.status || 'Upcoming'),
    color: t.priority === 'Urgent' ? '#ec538c' : t.priority === 'High' ? '#f8ad38' : '#3fc7bb',
    dateNum: new Date(t.dueDate).getDate(),
    isReal: true,
  }));

  // Fallback initial timetable if user has no tasks yet
  const fallbackSchedule = [
    {
      id: '1',
      title: 'Robotics Workshop: Autonomous Navigation',
      time: '19:30 - 21:00',
      day: 'Upcoming Session',
      room: 'Robotics Lab 4B',
      category: 'Projects',
      status: 'Upcoming',
      color: '#3fc7bb',
      dateNum: 18,
    },
    {
      id: '2',
      title: 'Electronics Circuit Integration & Testing',
      time: '16:00 - 17:30',
      day: 'Upcoming Session',
      room: 'Hardware Studio 2',
      category: 'Academic',
      status: 'Upcoming',
      color: '#ec538c',
      dateNum: 19,
    },
    {
      id: '3',
      title: 'C++ Object-Oriented Software Design',
      time: '17:30 - 19:00',
      day: 'Upcoming Session',
      room: 'Computer Lab 101',
      category: 'Academic',
      status: 'Upcoming',
      color: '#f8ad38',
      dateNum: 20,
    },
  ];

  const displayAgenda = userScheduledItems.length > 0 ? userScheduledItems : fallbackSchedule;

  return (
    <div className="section-view-container">
      <div className="section-view-header">
        <div>
          <h2 className="section-main-heading">Class & Assignment Schedule</h2>
          <p className="section-sub-heading">Academic calendar, live lessons, laboratory hours, and deadlines</p>
        </div>

        {onOpenAddModal && (
          <button className="btn-pill btn-primary" onClick={onOpenAddModal} id="btn-schedule-new-task">
            <Plus size={15} />
            <span>Schedule New Task</span>
          </button>
        )}
      </div>

      <div className="schedule-full-layout">
        {/* Agenda Events List */}
        <div className="schedule-agenda-column">
          <h3 className="card-title" style={{ marginBottom: '14px' }}>Upcoming Timetable & Deadlines</h3>

          <div className="schedule-agenda-list">
            {displayAgenda.map((evt) => (
              <div key={evt.id} className="agenda-event-card" style={{ borderLeftColor: evt.color }}>
                <div className="agenda-time-box">
                  <span className="agenda-day-text">{evt.day}</span>
                  <span className="agenda-hours-text">
                    <Clock size={12} />
                    {evt.time}
                  </span>
                </div>

                <div className="agenda-details-box">
                  <div className="agenda-top-line">
                    <h4 className="agenda-title">{evt.title}</h4>
                    <span className="badge badge-category">{evt.status}</span>
                  </div>

                  <div className="agenda-meta-row">
                    <span className="agenda-location">
                      <MapPin size={12} />
                      {evt.room}
                    </span>
                    <span className="badge" style={{ background: '#f5edf2', color: '#624b5d', fontSize: '0.72rem' }}>
                      {evt.category}
                    </span>
                  </div>
                </div>

                {evt.isReal && (
                  <a
                    href={`/todo.html?todo_id=${evt.id}`}
                    className="pill-link-btn"
                    style={{ alignSelf: 'center' }}
                    title="View task detail page"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Side Panel */}
        <div className="schedule-side-calendar card-soft">
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
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="cal-weekday">{d}</span>
            ))}
          </div>

          <div className="calendar-grid-days">
            {calendarDays.slice(0, 35).map((d, idx) => (
              <button
                key={idx}
                type="button"
                className={`cal-day-cell ${!d.isCurrentMonth ? 'inactive' : ''} ${d.isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (d.isCurrentMonth) setSelectedDay(d.day);
                }}
                style={{
                  border: 'none',
                  cursor: d.isCurrentMonth ? 'pointer' : 'default',
                  background: d.isSelected ? '#624b5d' : 'transparent',
                  color: d.isSelected ? '#ffffff' : (!d.isCurrentMonth ? '#cfc2cc' : 'var(--text-primary)'),
                }}
              >
                <span>{d.day}</span>
              </button>
            ))}
          </div>

          <div className="calendar-legend-box" style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e7d8e3', fontSize: '0.78rem', color: '#7f6779' }}>
            <p>● Click on any calendar day to highlight. Scheduled tasks synchronize automatically from your database.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScheduleView;
