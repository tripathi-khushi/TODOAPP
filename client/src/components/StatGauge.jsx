import React from 'react';

export const StatGauge = ({ 
  attendance = 60, 
  homework = 90, 
  rating = 75,
  totalTasks = 0,
  completedTasks = 0
}) => {
  const calculateCircle = (percentage, radius = 34) => {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return { circumference, offset };
  };

  const attendanceCircle = calculateCircle(attendance);
  const homeworkCircle = calculateCircle(homework);
  const ratingCircle = calculateCircle(rating);

  return (
    <div className="stats-column-card">
      <div className="gauge-box" id="gauge-attendance">
        <span className="gauge-label">Attendance</span>
        <div className="gauge-svg-container">
          <svg width="90" height="90" viewBox="0 0 90 90" className="gauge-svg">
            <circle
              cx="45"
              cy="45"
              r="34"
              className="gauge-bg-circle"
              strokeWidth="7"
            />
            <circle
              cx="45"
              cy="45"
              r="34"
              className="gauge-progress-circle pink"
              strokeWidth="7"
              strokeDasharray={attendanceCircle.circumference}
              strokeDashoffset={attendanceCircle.offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="gauge-value-text">{attendance}%</div>
        </div>
      </div>

      <div className="gauge-box" id="gauge-homework">
        <span className="gauge-label">Homework</span>
        <div className="gauge-svg-container">
          <svg width="90" height="90" viewBox="0 0 90 90" className="gauge-svg">
            <circle
              cx="45"
              cy="45"
              r="34"
              className="gauge-bg-circle"
              strokeWidth="7"
            />
            <circle
              cx="45"
              cy="45"
              r="34"
              className="gauge-progress-circle cyan"
              strokeWidth="7"
              strokeDasharray={homeworkCircle.circumference}
              strokeDashoffset={homeworkCircle.offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="gauge-value-text">{homework}%</div>
        </div>
      </div>

      <div className="gauge-box" id="gauge-rating">
        <span className="gauge-label">Rating</span>
        <div className="gauge-svg-container">
          <svg width="90" height="90" viewBox="0 0 90 90" className="gauge-svg">
            <circle
              cx="45"
              cy="45"
              r="34"
              className="gauge-bg-circle"
              strokeWidth="7"
            />
            <circle
              cx="45"
              cy="45"
              r="34"
              className="gauge-progress-circle amber"
              strokeWidth="7"
              strokeDasharray={ratingCircle.circumference}
              strokeDashoffset={ratingCircle.offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="gauge-value-text">{rating}%</div>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="stats-summary-footer" style={{ textAlign: 'center', paddingTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>{completedTasks} of {totalTasks} tasks completed</span>
        </div>
      )}
    </div>
  );
};

export default StatGauge;
