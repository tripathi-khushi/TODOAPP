import React, { useState, useEffect, useRef } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, AlertCircle, CheckCircle2, RotateCw, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import { api } from '../services/api';

export const AuthModal = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [signupStep, setSignupStep] = useState('form'); // 'form' or 'otp'

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('Robotics & AI Engineering');

  // OTP State (6 individual digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [devCodeHint, setDevCodeHint] = useState('');
  const otpInputsRef = useRef([]);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 60-second Resend countdown timer
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Reset states when switching mode or opening
  useEffect(() => {
    setError('');
    setSuccessMessage('');
    setDevCodeHint('');
    if (!isOpen) {
      setSignupStep('form');
      setOtpDigits(['', '', '', '', '', '']);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  // Handle standard Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login(email.trim(), password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send 6-digit OTP code to email
  const handleSendSignupOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setDevCodeHint('');

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const res = await api.sendSignupOtp({
        name: fullName.trim(),
        email: email.trim(),
        password: password,
        studentId: studentId.trim() || undefined,
        major: major.trim() || 'General Studies',
      });

      if (res.success) {
        setSignupStep('otp');
        setResendCooldown(60);
        setSuccessMessage(res.message || `Verification code sent to ${email.trim()}`);
        
        if (res.devCode) {
          setDevCodeHint(res.devCode);
        }

        // Focus first OTP box
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 100);
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP code and proceed to dashboard
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the full 6-digit verification code');
      return;
    }

    try {
      setLoading(true);
      const res = await api.verifySignupOtp(email.trim(), fullOtp);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    try {
      setLoading(true);
      setError('');
      const res = await api.resendOtp(email.trim());
      if (res.success) {
        setResendCooldown(60);
        setSuccessMessage('A fresh 6-digit verification code has been sent!');
        if (res.devCode) {
          setDevCodeHint(res.devCode);
        }
        setOtpDigits(['', '', '', '', '', '']);
        otpInputsRef.current[0]?.focus();
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit box input
  const handleDigitChange = (index, value) => {
    // Only allow numeric
    const cleanVal = value.replace(/[^0-9]/g, '');

    // Handle paste of full 6-digit code
    if (cleanVal.length > 1) {
      const pastedDigits = cleanVal.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pastedDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pastedDigits.length, 5);
      otpInputsRef.current[nextIdx]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (cleanVal && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation in OTP boxes
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Quick fill helper when devCode is active
  const handleQuickFillDevCode = () => {
    if (devCodeHint) {
      const digits = devCodeHint.split('');
      setOtpDigits(digits);
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

        {/* Tab Switcher (Visible when not in OTP step) */}
        {signupStep !== 'otp' && (
          <div className="auth-tab-switch">
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
              id="tab-btn-login"
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); setSuccessMessage(''); }}
              id="tab-btn-signup"
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Notification / Error Banners */}
        {error && (
          <div className="form-error-banner" style={{ marginTop: '12px' }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e6f4ea', color: '#137333', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, marginTop: '12px' }}>
            <CheckCircle2 size={15} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ========================================================
            VIEW 1: SIGN IN MODE
           ======================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="modal-form" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email-input">
                <Mail size={13} /> Email Address <span className="req-star">*</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="login-email-input"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password-input">
                <Lock size={13} /> Password <span className="req-star">*</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="login-password-input"
              />
            </div>

            <button
              type="submit"
              className="btn-pill btn-primary auth-submit-btn"
              disabled={loading}
              id="btn-login-submit"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================
            VIEW 2: CREATE ACCOUNT - STEP 1 (FORM)
           ======================================================== */}
        {mode === 'signup' && signupStep === 'form' && (
          <form onSubmit={handleSendSignupOtp} className="modal-form" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name-input">
                <User size={13} /> Full Name <span className="req-star">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Khushi Tripathi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                id="signup-name-input"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email-input">
                <Mail size={13} /> Email Address <span className="req-star">*</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="signup-email-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password-input">
                <Lock size={13} /> Password <span className="req-star">*</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="signup-password-input"
              />
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label">Degree / Major</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Robotics & AI"
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

            <button
              type="submit"
              className="btn-pill btn-primary auth-submit-btn"
              disabled={loading}
              id="btn-send-otp-submit"
            >
              {loading ? (
                <span>Sending Verification Code...</span>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Send Verification Code</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================
            VIEW 3: CREATE ACCOUNT - STEP 2 (OTP VERIFICATION)
           ======================================================== */}
        {mode === 'signup' && signupStep === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="modal-form" style={{ marginTop: '14px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ebdce5', color: '#624b5d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Enter Verification Code</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                We sent a 6-digit code to <strong style={{ color: '#624b5d' }}>{email}</strong>
              </p>
            </div>

            {/* Dev Code Helper Banner */}
            {devCodeHint && (
              <div 
                onClick={handleQuickFillDevCode}
                style={{
                  background: 'linear-gradient(135deg, #f7edf4, #ebdce5)',
                  border: '1.5px dashed #a85597',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  margin: '8px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                title="Click to auto-fill"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <KeyRound size={16} color="#a85597" />
                  <span style={{ fontSize: '0.8rem', color: '#3d2839', fontWeight: 600 }}>
                    Terminal Code: <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#624b5d', letterSpacing: '2px' }}>{devCodeHint}</strong>
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#624b5d', color: '#ffffff', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  Auto-fill
                </span>
              </div>
            )}

            {/* 6-Digit OTP Boxes */}
            <div className="otp-inputs-grid" style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '14px 0' }}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  className="otp-digit-box"
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  style={{
                    width: '46px',
                    height: '52px',
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    color: '#624b5d',
                    background: '#ffffff',
                    border: digit ? '2px solid #8c7185' : '1.5px solid rgba(220, 200, 215, 0.8)',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(90, 60, 80, 0.05)',
                  }}
                  id={`otp-box-${idx}`}
                />
              ))}
            </div>

            <button
              type="submit"
              className="btn-pill btn-primary auth-submit-btn"
              disabled={loading || otpDigits.join('').length !== 6}
              id="btn-verify-otp-submit"
            >
              {loading ? (
                <span>Verifying & Creating Account...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Verify & Open Dashboard</span>
                </>
              )}
            </button>

            {/* Resend Code & Back Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.8rem' }}>
              <button
                type="button"
                onClick={() => { setSignupStep('form'); setError(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8c7185', fontWeight: 600 }}
                id="btn-change-email"
              >
                <ArrowLeft size={14} />
                <span>Edit details</span>
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: resendCooldown > 0 ? '#b09fab' : '#624b5d',
                  fontWeight: 700,
                  cursor: resendCooldown > 0 ? 'default' : 'pointer',
                }}
                id="btn-resend-otp"
              >
                <RotateCw size={13} className={loading ? 'animate-spin' : ''} />
                <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default AuthModal;
