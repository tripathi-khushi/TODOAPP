import React from 'react';
import { MessageCircle, ChevronRight } from 'lucide-react';

export const LinkedTeachersCard = () => {
  const teachers = [
    {
      id: 1,
      name: 'Olivia Miller',
      role: 'Mentor & AI Specialist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Liam Garcia',
      role: 'Electronics Teacher',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Jackson Lopez',
      role: 'Robotics Lecturer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="card-soft teachers-widget-card">
      <div className="card-header-simple">
        <h3 className="card-title">Linked Teachers</h3>
      </div>

      <div className="teachers-list">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="teacher-item">
            <img src={teacher.avatar} alt={teacher.name} className="teacher-avatar" />
            <div className="teacher-info">
              <h5 className="teacher-name">{teacher.name}</h5>
              <p className="teacher-role">{teacher.role}</p>
            </div>
            <button 
              className="btn-icon teacher-chat-btn"
              onClick={() => alert(`Direct message channel with ${teacher.name}`)}
              title={`Message ${teacher.name}`}
            >
              <MessageCircle size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="card-footer-action">
        <a href="#teachers" className="card-see-more" onClick={(e) => e.preventDefault()}>
          <span>See more</span>
          <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
};
export default LinkedTeachersCard;
