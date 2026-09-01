import React, { useState, useEffect } from 'react';
import { User, Bell, Database, Save, CheckCircle2, LogIn, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const SettingsView = ({ 
  currentUser, 
  onUpdateUser, 
  onOpenAuthModal,
  onShowToast 
}) => {
  const isLoggedIn = Boolean(currentUser && currentUser.isLoggedIn);

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');
  const [avatar, setAvatar] = useState('');

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lessonAlerts, setLessonAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state whenever currentUser changes from database
  useEffect(() => {
    if (currentUser && currentUser.isLoggedIn) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
      setStudentId(currentUser.studentId || '');
      setMajor(currentUser.major || 'General Studies');
      setAvatar(currentUser.avatar || '');
    } else {
      setProfileName('');
      setProfileEmail('');
      setStudentId('');
      setMajor('');
      setAvatar('');
    }
  }, [currentUser]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    if (!profileName.trim()) {
      if (onShowToast) onShowToast('Profile name cannot be empty', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const res = await api.updateProfile({
        name: profileName.trim(),
        email: profileEmail.trim(),
        studentId: studentId.trim(),
        major: major.trim(),
        avatar: avatar,
      });

      if (res.success && res.user) {
        if (onUpdateUser) {
          onUpdateUser(res.user);
        }
        setSavedSuccess(true);
        if (onShowToast) onShowToast('Profile saved to database successfully!', 'success');
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving profile to database:', err);
      if (onShowToast) onShowToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="section-view-container">
      <div className="section-view-header">
        <div>
          <h2 className="section-main-heading">Settings & Preferences</h2>
          <p className="section-sub-heading">Manage student profile, notifications, and system settings</p>
        </div>
      </div>

      {!isLoggedIn ? (
        <div className="empty-state-box" style={{ padding: '48px 32px', background: '#ffffff', border: '1px solid rgba(220, 200, 215, 0.6)' }}>
          <User size={48} color="#8c7185" />
          <h3 className="empty-state-title">Guest Profile</h3>
          <p className="empty-state-desc" style={{ maxWidth: '420px' }}>
            You are currently viewing the application as a Guest. Log in or create an account to store and manage your personal student records and tasks in the database.
          </p>
          <button 
            className="btn-pill btn-primary"
            onClick={onOpenAuthModal}
            id="btn-settings-login-prompt"
          >
            <LogIn size={16} />
            <span>Sign In / Create Account</span>
          </button>
        </div>
      ) : (
        <div className="settings-cards-grid">
          {/* Profile Card */}
          <div className="card-soft settings-card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} />
              Student Profile Information (Database)
            </h3>

            <div className="settings-profile-header">
              <img 
                src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                alt={profileName} 
                className="settings-avatar-img"
              />
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{profileName}</h4>
                <p style={{ fontSize: '0.8rem', color: '#7f6779' }}>Student ID: {studentId || 'N/A'}</p>
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
                  placeholder="Enter full name"
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
                  placeholder="name@example.com"
                  required
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
                  placeholder="e.g. Robotics & AI Engineering"
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
                  placeholder="e.g. ST-2026-1001"
                  id="settings-studentid-input"
                />
              </div>

              <button 
                type="submit" 
                className="btn-pill btn-primary" 
                style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                disabled={isSaving}
                id="btn-save-settings"
              >
                {isSaving ? (
                  <span>Saving to Database...</span>
                ) : savedSuccess ? (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Saved in Database!</span>
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
                Database & Session Info
              </h4>

              <div className="system-health-box">
                <div className="health-item">
                  <span>Database:</span>
                  <strong>MongoDB / Mongoose</strong>
                </div>
                <div className="health-item">
                  <span>Active User:</span>
                  <strong style={{ color: '#8c7185' }}>{currentUser.name}</strong>
                </div>
                <div className="health-item">
                  <span>User ID:</span>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>{currentUser._id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SettingsView;
