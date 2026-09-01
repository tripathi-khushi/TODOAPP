import React from 'react';
import { GraduationCap, BookOpen, Clock, User, CheckCircle2, ArrowRight } from 'lucide-react';

export const ClassesView = ({ onSelectCategory, onNavigateToMessages }) => {
  const classesList = [
    {
      id: 'robotics',
      title: 'Robotics & Autonomous Navigation',
      code: 'ROB-301',
      teacher: 'Jackson Lopez',
      teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      nextLesson: 'Today at 19:30',
      progress: 85,
      completedLessons: 17,
      totalLessons: 20,
      description: 'Covers tracked chassis mechanics, ultrasonic telemetry, gyro stabilization, and closed-loop PID control.',
      category: 'Projects',
      color: '#3fc7bb',
    },
    {
      id: 'electronics',
      title: 'Electronics & Sensor Engineering',
      code: 'ELC-204',
      teacher: 'Liam Garcia',
      teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      nextLesson: 'Tomorrow at 16:00',
      progress: 70,
      completedLessons: 14,
      totalLessons: 20,
      description: 'Analog and digital circuit analysis, operational amplifiers, breadboard prototyping, and logic ICs.',
      category: 'Academic',
      color: '#ec538c',
    },
    {
      id: 'cpp',
      title: 'C++ & Object-Oriented Software',
      code: 'CS-402',
      teacher: 'Olivia Miller',
      teacherAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      nextLesson: 'May 20 at 17:30',
      progress: 90,
      completedLessons: 18,
      totalLessons: 20,
      description: 'Modern C++ memory management, smart pointers, RAII idioms, design patterns, and Valgrind memory profiling.',
      category: 'Academic',
      color: '#f8ad38',
    },
    {
      id: 'ai',
      title: 'Machine Learning & Neural Networks',
      code: 'AI-501',
      teacher: 'Olivia Miller',
      teacherAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      nextLesson: 'May 22 at 10:30',
      progress: 60,
      completedLessons: 12,
      totalLessons: 20,
      description: 'Supervised learning algorithms, regression models, loss functions, and hands-on PyTorch / Jupyter projects.',
      category: 'Academic',
      color: '#8b5cf6',
    },
  ];

  return (
    <div className="section-view-container">
      <div className="section-view-header">
        <div>
          <h2 className="section-main-heading">My Classes & Curriculum</h2>
          <p className="section-sub-heading">Enrolled STEM & Computer Science courses for Spring Semester 2026</p>
        </div>
      </div>

      <div className="classes-cards-grid">
        {classesList.map((course) => (
          <div key={course.id} className="class-course-card">
            <div className="class-card-top">
              <div className="class-code-badge" style={{ borderColor: course.color, color: course.color }}>
                {course.code}
              </div>
              <span className="badge badge-category">{course.category}</span>
            </div>

            <h3 className="class-card-title">{course.title}</h3>
            <p className="class-card-desc">{course.description}</p>

            <div className="class-teacher-row">
              <img src={course.teacherAvatar} alt={course.teacher} className="class-teacher-avatar" />
              <div className="class-teacher-info">
                <span className="teacher-label">Instructor</span>
                <span className="teacher-fullname">{course.teacher}</span>
              </div>
              {onNavigateToMessages && (
                <button
                  className="btn-icon class-msg-btn"
                  onClick={() => onNavigateToMessages(course.teacher)}
                  title={`Chat with ${course.teacher}`}
                >
                  <User size={14} />
                </button>
              )}
            </div>

            <div className="class-progress-section">
              <div className="class-progress-labels">
                <span>Progress: {course.completedLessons}/{course.totalLessons} lessons</span>
                <span style={{ fontWeight: 700, color: course.color }}>{course.progress}%</span>
              </div>
              <div className="class-progress-track">
                <div 
                  className="class-progress-bar" 
                  style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                />
              </div>
            </div>

            <div className="class-card-footer">
              <div className="class-next-schedule">
                <Clock size={13} />
                <span>Next: {course.nextLesson}</span>
              </div>

              {onSelectCategory && (
                <button
                  className="class-view-tasks-btn"
                  onClick={() => onSelectCategory(course.category)}
                  title="Filter Todos for this course"
                >
                  <span>View Tasks</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ClassesView;
