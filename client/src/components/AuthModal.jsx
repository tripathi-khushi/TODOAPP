import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, Sparkles, Check } from 'lucide-react';

export const AuthModal = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [fullName, setFullName] = useState('Khushi Tripathi');
  const [email, setEmail] = useState('khushi.tripathi@smartech.edu');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (name, emailAddr, role, avatarUrl) => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: name,
        email: emailAddr,
        role: role,
        studentId: 'ST-2026-8941',
        major: 'Robotics & AI Engineering',
        avatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isLoggedIn: true,
      });
      setLoading(false);
      onClose();
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let computedName = fullName.trim();
    if (!computedName) {
      // Fallback name from email if empty
      const username = email.split('@')[0];
      computedName = username
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Student User';
    }

    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: computedName,
        email: email.trim() || 'student@smartech.edu',
        role: 'Student • Robotics Major',
        studentId: 'ST-2026-8941',
        major: 'Robotics & AI Engineering',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isLoggedIn: true,
      });
      setLoading(false);
      onClose();
    }, 300);
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

        {/* Quick Profiles Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          <div 
            className="quick-demo-banner" 
            onClick={() => handleQuickLogin(
              'Khushi Tripathi',
              'khushi.tripathi@smartech.edu',
              'Student • Robotics Major',
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            )}
            id="quick-login-khushi"
          >
            <div className="demo-avatar-box">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Khushi Tripathi" 
                className="demo-avatar"
              />
            </div>
            <div className="demo-text-box">
              <strong className="demo-title">
                <Sparkles size={14} className="sparkle-icon" /> Sign In as Khushi Tripathi
              </strong>
              <span className="demo-sub">Click to authenticate as Khushi Tripathi</span>
            </div>
          </div>

          <div 
            className="quick-demo-banner" 
            style={{ background: '#f5edf2', borderColor: '#d1b8c9' }}
            onClick={() => handleQuickLogin(
              'Sophia Tompson',
              'sophia.tompson@smartech.edu',
              'Demo Student • AI Major',
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
            )}
            id="quick-login-sophia"
          >
            <div className="demo-avatar-box">
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" 
                alt="Sophia Tompson" 
                className="demo-avatar"
              />
            </div>
            <div className="demo-text-box">
              <strong className="demo-title">
                <User size={14} /> Sign In as Sophia Tompson
              </strong>
              <span className="demo-sub">Demo student profile</span>
            </div>
          </div>
        </div>

        <div className="auth-divider">
          <span>or customize credentials</span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error-banner">{error}</div>}

          {/* Full Name Field */}
          <div className="form-group">
            <label className="form-label">
              <User size={13} /> Full Name
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Khushi Tripathi"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              id="auth-fullname-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={13} /> Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="khushi.tripathi@smartech.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="auth-email-input"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">
                <Lock size={13} /> Password
              </label>
              {mode === 'login' && (
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your email.'); }} style={{ fontSize: '0.75rem', color: '#8c7185', fontWeight: 600 }}>
                  Forgot Password?
                </a>
              )}
            </div>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="auth-password-input"
            />
          </div>

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
                <span>Sign In as {fullName || 'Student'}</span>
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
