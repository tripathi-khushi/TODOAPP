import React, { useState, useEffect } from 'react';
import { User, Bell, Database, Save, Sparkles, CheckCircle2, Shield } from 'lucide-react';

export const SettingsView = ({ 
  currentUser, 
  onUpdateUser, 
  onSeedData, 
  isSeeding = false, 
  onShowToast 
}) => {
  const [profileName, setProfileName] = useState(currentUser?.name || 'Khushi Tripathi');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'khushi.tripathi@smartech.edu');
  const [studentId, setStudentId] = useState(currentUser?.studentId || 'ST-2026-8941');
  const [major, setMajor] = useState(currentUser?.major || 'Robotics & AI Engineering');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lessonAlerts, setLessonAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever currentUser changes (e.g. on login/switch)
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
      if (currentUser.studentId) setStudentId(currentUser.studentId);
      if (currentUser.major) setMajor(currentUser.major);
      if (currentUser.avatar) setAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      if (onShowToast) onShowToast('Profile name cannot be empty', 'error');
      return;
    }

    const updatedUser = {
      ...(currentUser || {}),
      name: profileName.trim(),
      email: profileEmail.trim(),
      studentId: studentId.trim(),
      major: major.trim(),
      avatar: avatar,
      isLoggedIn: true,
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setSavedSuccess(true);
    if (onShowToast) onShowToast(`Profile updated for ${updatedUser.name}!`, 'success');
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
              src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
              alt={profileName} 
              className="settings-avatar-img"
            />
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{profileName || 'Student Name'}</h4>
              <p style={{ fontSize: '0.8rem', color: '#7f6779' }}>Student ID: {studentId}</p>
              <span className="badge badge-category" style={{ marginTop: '4px' }}>
                {major}
              </span>
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
                placeholder="e.g. Khushi Tripathi"
                required
                id="settings-name-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institutional Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={profileEmail} 
                onChange={(e) => setProfileEmail(e.target.value)} 
                placeholder="khushi.tripathi@smartech.edu"
                id="settings-email-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Degree Track / Major</label>
              <input 
                type="text" 
                className="form-input" 
                value={major} 
                onChange={(e) => setMajor(e.target.value)} 
                id="settings-major-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Student Identification Number</label>
              <input 
                type="text" 
                className="form-input" 
                value={studentId} 
                onChange={(e) => setStudentId(e.target.value)} 
                id="settings-studentid-input"
              />
            </div>

            <button 
              type="submit" 
              className="btn-pill btn-primary" 
              style={{ alignSelf: 'flex-start', marginTop: '8px' }}
              id="btn-save-settings"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Profile Changes</span>
                </>
              )}
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
              <div className="health-item">
                <span>Active User:</span>
                <strong style={{ color: '#8c7185' }}>{currentUser?.name || 'Guest'}</strong>
              </div>
            </div>

            {onSeedData && (
              <button 
                className="btn-pill btn-secondary" 
                onClick={onSeedData} 
                disabled={isSeeding}
                style={{ marginTop: '16px', width: '100%' }}
                id="btn-settings-seed"
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
