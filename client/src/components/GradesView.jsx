import React from 'react';
import { Award, TrendingUp, CheckCircle, Star, FileText } from 'lucide-react';

export const GradesView = () => {
  const gradesList = [
    {
      id: 1,
      assignment: 'Homework 15: Autonomous Rover PID Controller',
      course: 'Robotics & Autonomous Navigation',
      score: 98,
      maxScore: 100,
      grade: 'A+',
      instructor: 'Jackson Lopez',
      date: 'May 16, 2026',
      feedback: 'Flawless closed-loop calibration. Obstacle avoidance latency was under 20ms.',
    },
    {
      id: 2,
      assignment: 'Homework 10: 4-Bit ALU Logic Breadboard',
      course: 'Electronics & Sensor Engineering',
      score: 95,
      maxScore: 100,
      grade: 'A',
      instructor: 'Liam Garcia',
      date: 'May 12, 2026',
      feedback: 'Very tidy wiring layout. Truth table validation matched all test vectors.',
    },
    {
      id: 3,
      assignment: 'C++ Abstract Factory & Memory Profiling',
      course: 'C++ & Object-Oriented Software',
      score: 100,
      maxScore: 100,
      grade: 'A+',
      instructor: 'Olivia Miller',
      date: 'May 08, 2026',
      feedback: 'Perfect smart pointer management. Zero memory leaks on Valgrind audit.',
    },
    {
      id: 4,
      assignment: 'Linear Regression & Cost Function Notebook',
      course: 'Machine Learning & Neural Networks',
      score: 94,
      maxScore: 100,
      grade: 'A',
      instructor: 'Olivia Miller',
      date: 'May 02, 2026',
      feedback: 'Well-documented loss plots and accurate gradient descent convergence.',
    },
    {
      id: 5,
      assignment: 'Electronics Sensor Telemetry Lab Report',
      course: 'Electronics & Sensor Engineering',
      score: 89,
      maxScore: 100,
      grade: 'B+',
      instructor: 'Liam Garcia',
      date: 'April 27, 2026',
      feedback: 'Good analysis of temperature sensor thermistor curve; add more detail on ADC quantization error.',
    },
  ];

  return (
    <div className="section-view-container">
      <div className="section-view-header">
        <div>
          <h2 className="section-main-heading">Academic Grades & Performance</h2>
          <p className="section-sub-heading">Transcript, assignment marks, and instructor feedback for Sophia Tompson</p>
        </div>
      </div>

      {/* Top GPA & Summary Metrics */}
      <div className="grades-summary-grid">
        <div className="grade-metric-card highlight">
          <div className="grade-metric-icon">
            <Award size={24} color="#ffffff" />
          </div>
          <div className="grade-metric-info">
            <span className="grade-metric-label">Cumulative GPA</span>
            <h3 className="grade-metric-val">3.92 <span>/ 4.0</span></h3>
            <span className="grade-metric-sub">Dean's Honor List • Top 3%</span>
          </div>
        </div>

        <div className="grade-metric-card">
          <div className="grade-metric-icon secondary">
            <TrendingUp size={22} color="#3fc7bb" />
          </div>
          <div className="grade-metric-info">
            <span className="grade-metric-label">Average Score</span>
            <h3 className="grade-metric-val">95.2%</h3>
            <span className="grade-metric-sub">+3.4% from last semester</span>
          </div>
        </div>

        <div className="grade-metric-card">
          <div className="grade-metric-icon tertiary">
            <CheckCircle size={22} color="#ec538c" />
          </div>
          <div className="grade-metric-info">
            <span className="grade-metric-label">Completed Tasks</span>
            <h3 className="grade-metric-val">18 / 20</h3>
            <span className="grade-metric-sub">90% Homework submission rate</span>
          </div>
        </div>
      </div>

      {/* Detailed Assignments Breakdown Table */}
      <div className="card-soft grades-table-card">
        <h3 className="card-title" style={{ marginBottom: '16px' }}>Recent Assignment & Exam Results</h3>
        <div className="grades-table-wrapper">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Assignment / Task</th>
                <th>Course</th>
                <th>Instructor</th>
                <th>Date</th>
                <th>Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {gradesList.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="assignment-cell">
                      <FileText size={15} className="assignment-icon" />
                      <div>
                        <strong>{item.assignment}</strong>
                        <p className="assignment-feedback">"{item.feedback}"</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-category">{item.course}</span></td>
                  <td>{item.instructor}</td>
                  <td>{item.date}</td>
                  <td><strong>{item.score}</strong> / {item.maxScore}</td>
                  <td>
                    <span className={`grade-pill ${item.grade.startsWith('A') ? 'grade-a' : 'grade-b'}`}>
                      {item.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default GradesView;
