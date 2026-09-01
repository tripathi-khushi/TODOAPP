import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, ShieldCheck, Sparkles } from 'lucide-react';

export const AuthModal = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [email, setEmail] = useState('sophia.tompson@smartech.edu');
  const [password, setPassword] = useState('••••••••');
  const [fullName, setFullName] = useState('Sophia Tompson');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: 'Sophia Tompson',
        email: 'sophia.tompson@smartech.edu',
        role: 'Student • Robotics Major',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isLoggedIn: true,
      });
      setLoading(false);
      onClose();
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: mode === 'signup' ? (fullName || 'New Student') : (email.split('@')[0] || 'Sophia Tompson'),
        email: email.trim(),
        role: 'Student • Robotics Major',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isLoggedIn: true,
      });
      setLoading(false);
      onClose();
    }, 400);
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

        {/* Quick Demo Login Option */}
        <div className="quick-demo-banner" onClick={handleQuickDemoLogin}>
          <div className="demo-avatar-box">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="Sophia" 
              className="demo-avatar"
            />
          </div>
          <div className="demo-text-box">
            <strong className="demo-title">
              <Sparkles size={14} className="sparkle-icon" /> Quick Demo Sign In
            </strong>
            <span className="demo-sub">Click to instantly log in as Sophia Tompson</span>
          </div>
        </div>

        <div className="auth-divider">
          <span>or continue with credentials</span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error-banner">{error}</div>}

          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">
                <User size={13} /> Full Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sophia Tompson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Mail size={13} /> Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="sophia.tompson@smartech.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
