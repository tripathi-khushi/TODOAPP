import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Plus, MapPin, ExternalLink } from 'lucide-react';

export const ScheduleView = ({ todos = [], onOpenAddModal }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 18)); // May 2026

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

  const scheduleEvents = [
    {
      id: 1,
      title: 'Robotics Lesson: Autonomous Navigation',
      time: '19:30 - 21:00',
      day: 'Monday, May 18',
      room: 'Robotics Lab 4B',
      instructor: 'Jackson Lopez',
      status: 'Upcoming',
      category: 'Projects',
      color: '#3fc7bb',
    },
    {
      id: 2,
      title: 'Electronics Lesson: Sensor Circuit Assembly',
      time: '16:00 - 17:30',
      day: 'Tuesday, May 19',
      room: 'Hardware Studio 2',
      instructor: 'Liam Garcia',
      status: 'Upcoming',
      category: 'Academic',
      color: '#ec538c',
    },
    {
      id: 3,
      title: 'C++ Lesson: Object-Oriented Design Patterns',
      time: '17:30 - 19:00',
      day: 'Wednesday, May 20',
      room: 'Computer Lab 101',
      instructor: 'Olivia Miller',
      status: 'Upcoming',
      category: 'Academic',
      color: '#f8ad38',
    },
    {
      id: 4,
      title: "The main event in your life 'Robot Fest'",
      time: '13:00 - 18:00',
      day: 'Friday, May 22',
      room: 'Grand Exhibition Arena',
      instructor: 'All Faculty Mentors',
      status: 'Major Event',
      category: 'Projects',
      color: '#8b5cf6',
    },
    {
      id: 5,
      title: 'Webinar of new tools in Minecraft Education',
      time: '17:00 - 18:30',
      day: 'Monday, May 25',
      room: 'Online Livestream',
      instructor: 'Guest Speaker & Jackson Lopez',
      status: 'Online',
      category: 'Personal',
      color: '#4f8bf9',
    },
  ];

  return (
    <div className="section-view-container">
      <div className="section-view-header">
        <div>
          <h2 className="section-main-heading">Class & Assignment Schedule</h2>
          <p className="section-sub-heading">Academic calendar, live lessons, laboratory hours, and events</p>
        </div>

        {onOpenAddModal && (
          <button className="btn-pill btn-primary" onClick={onOpenAddModal}>
            <Plus size={15} />
            <span>Schedule New Task</span>
          </button>
        )}
      </div>

      <div className="schedule-full-layout">
        {/* Agenda Events List */}
        <div className="schedule-agenda-column">
          <h3 className="card-title" style={{ marginBottom: '14px' }}>Upcoming Timetable</h3>

          <div className="schedule-agenda-list">
            {scheduleEvents.map((evt) => (
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
                    <span className="agenda-instructor">
                      Instructor: <strong>{evt.instructor}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Side Panel */}
        <div className="schedule-side-calendar card-soft">
          <div className="calendar-nav-header">
            <button className="cal-arrow-btn" onClick={prevMonth}><ChevronLeft size={14} /></button>
            <span className="cal-month-title">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <button className="cal-arrow-btn" onClick={nextMonth}><ChevronRight size={14} /></button>
          </div>

          <div className="calendar-grid-header">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="cal-weekday">{d}</span>
            ))}
          </div>

          <div className="calendar-grid-days">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <div 
                key={d} 
                className={`cal-day-cell ${[18, 19, 20, 22, 25].includes(d) ? 'selected' : ''}`}
                style={[18, 19, 20, 22, 25].includes(d) ? { background: '#624b5d', color: '#fff' } : {}}
              >
                <span>{d}</span>
              </div>
            ))}
          </div>

          <div className="calendar-legend-box" style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e7d8e3', fontSize: '0.78rem', color: '#7f6779' }}>
            <p>● Dates with colored badges indicate scheduled live lessons and submission deadlines.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScheduleView;
