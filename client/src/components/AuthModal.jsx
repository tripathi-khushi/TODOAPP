import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const AuthModal = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('Robotics & AI Engineering');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      if (mode === 'signup') {
        if (!fullName.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }

        const res = await api.register({
          name: fullName.trim(),
          email: email.trim(),
          password: password,
          studentId: studentId.trim() || undefined,
          major: major.trim() || 'General Studies',
        });

        if (res.success && res.user) {
          onLoginSuccess(res.user);
          onClose();
        }
      } else {
        // Sign In
        const res = await api.login(email.trim(), password);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
          onClose();
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container auth-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="auth-brand-logo">
            <span className="brand-text">Smar<span>t</span>ech</span>
          </div>
          <button className="btn-icon modal-close-btn" onClick={onClose} id="btn-close-auth-modal">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-switch">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
            id="tab-btn-login"
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
            id="tab-btn-signup"
          >
            <UserPlus size={15} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="modal-form" style={{ marginTop: '8px' }}>
          {error && (
            <div className="form-error-banner">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name Field (Sign Up mode) */}
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-name-input">
                <User size={13} /> Full Name <span className="req-star">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                id="auth-name-input"
                autoFocus
              />
            </div>
          )}

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="auth-email-input">
              <Mail size={13} /> Email Address <span className="req-star">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="auth-email-input"
              autoFocus={mode === 'login'}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="auth-password-input">
                <Lock size={13} /> Password <span className="req-star">*</span>
              </label>
            </div>
            <input
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="auth-password-input"
            />
          </div>

          {/* Major and Student ID (Sign Up mode) */}
          {mode === 'signup' && (
            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label">Degree / Major</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student ID (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ST-2026-1001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-pill btn-primary auth-submit-btn"
            disabled={loading}
            id="btn-auth-submit"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn size={16} />
                <span>Sign In to Dashboard</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Create Student Account</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AuthModal;
