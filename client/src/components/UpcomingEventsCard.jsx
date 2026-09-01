import React from 'react';
import { ChevronRight, Calendar, Clock } from 'lucide-react';

export const UpcomingEventsCard = () => {
  const events = [
    {
      id: 1,
      title: "The main event in your life 'Robot Fest'",
      date: '22 May 2026',
      time: '13:00',
      iconUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Webinar of new tools in Minecraft Education',
      date: '25 May 2026',
      time: '17:00',
      iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="card-soft upcoming-events-card">
      <div className="card-header-simple">
        <h3 className="card-title">Upcoming events</h3>
      </div>

      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className="event-pill-item">
            <img src={event.iconUrl} alt="" className="event-icon-avatar" />
            <div className="event-details">
              <h5 className="event-title">{event.title}</h5>
              <div className="event-meta">
                <span className="event-date">
                  <Calendar size={11} />
                  {event.date}
                </span>
                <span className="event-time">
                  <Clock size={11} />
                  {event.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer-action">
        <a href="#events" className="card-see-more" onClick={(e) => e.preventDefault()}>
          <span>See more</span>
          <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
};
export default UpcomingEventsCard;
