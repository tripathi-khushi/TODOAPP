import React, { useState } from 'react';
import { User, Bell, Database, Shield, Save, Sparkles, Check } from 'lucide-react';

export const SettingsView = ({ onSeedData, isSeeding = false, onShowToast }) => {
  const [profileName, setProfileName] = useState('Sophia Tompson');
  const [profileEmail, setProfileEmail] = useState('sophia.tompson@smartech.edu');
  const [studentId, setStudentId] = useState('ST-2026-8941');
  const [major, setMajor] = useState('Robotics & AI Engineering');

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lessonAlerts, setLessonAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    if (onShowToast) onShowToast('Settings and profile saved successfully!', 'success');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="section-view-container">
      <div className="section-view-header">
        <div>
          <h2 className="section-main-heading">Settings & Preferences</h2>
          <p className="section-sub-heading">Manage student profile, notifications, and system settings</p>
        </div>
      </div>

      <div className="settings-cards-grid">
        {/* Profile Card */}
        <div className="card-soft settings-card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} />
            Student Profile Information
          </h3>

          <div className="settings-profile-header">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
              alt="Sophia" 
              className="settings-avatar-img"
            />
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{profileName}</h4>
              <p style={{ fontSize: '0.8rem', color: '#7f6779' }}>Student ID: {studentId}</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="settings-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institutional Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={profileEmail} 
                onChange={(e) => setProfileEmail(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Degree Track / Major</label>
              <input 
                type="text" 
                className="form-input" 
                value={major} 
                onChange={(e) => setMajor(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn-pill btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
              <Save size={15} />
              <span>{savedSuccess ? 'Saved!' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Notifications & System Preferences */}
        <div className="card-soft settings-card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} />
            Notification Preferences
          </h3>

          <div className="settings-toggle-list">
            <div className="settings-toggle-row">
              <div>
                <strong className="toggle-title">Assignment Due Date Reminders</strong>
                <p className="toggle-desc">Receive popups and alerts 24 hours before deadlines</p>
              </div>
              <input 
                type="checkbox" 
                className="custom-toggle" 
                checked={notificationsEnabled} 
                onChange={() => setNotificationsEnabled(!notificationsEnabled)} 
              />
            </div>

            <div className="settings-toggle-row">
              <div>
                <strong className="toggle-title">Live Lesson & Workshop Alerts</strong>
                <p className="toggle-desc">Notify 15 minutes before scheduled lessons</p>
              </div>
              <input 
                type="checkbox" 
                className="custom-toggle" 
                checked={lessonAlerts} 
                onChange={() => setLessonAlerts(!lessonAlerts)} 
              />
            </div>

            <div className="settings-toggle-row">
              <div>
                <strong className="toggle-title">Daily Morning Digest</strong>
                <p className="toggle-desc">Summary of today's schedule and open tasks</p>
              </div>
              <input 
                type="checkbox" 
                className="custom-toggle" 
                checked={dailyDigest} 
                onChange={() => setDailyDigest(!dailyDigest)} 
              />
            </div>
          </div>

          {/* Database & Architecture Info */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #ebdce5' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={16} />
              Backend & System Health
            </h4>

            <div className="system-health-box">
              <div className="health-item">
                <span>Architecture:</span>
                <strong>Multi-Page React (MPA)</strong>
              </div>
              <div className="health-item">
                <span>Backend Server:</span>
                <strong>Express.js (:5000)</strong>
              </div>
              <div className="health-item">
                <span>Database:</span>
                <strong>MongoDB / Mongoose</strong>
              </div>
            </div>

            {onSeedData && (
              <button 
                className="btn-pill btn-secondary" 
                onClick={onSeedData} 
                disabled={isSeeding}
                style={{ marginTop: '16px', width: '100%' }}
              >
                <Sparkles size={15} />
                <span>{isSeeding ? 'Resetting Demo Data...' : 'Reset & Re-seed Sample Tasks'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsView;
