// client/src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Phone,
  MapPin,
  X,
  Plus
} from 'lucide-react';

export const AuthPage = ({ initialRole = 'user', onRoleChange }) => {
  const [role, setRole] = useState(initialRole); // 'user' | 'admin'
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot_password'
  const [step, setStep] = useState('request'); // 'request' | 'reset' for forgot password

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Google Account Chooser Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [isEnteringCustomGoogle, setIsEnteringCustomGoogle] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const {
    login,
    register,
    googleLogin,
    adminLogin,
    adminRegister,
    adminGoogleLogin,
    forgotPassword,
    resetPassword
  } = useAuth();

  const { showToast } = useToast();

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setMode('login');
    setStep('request');
    if (onRoleChange) onRoleChange(newRole);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          showToast({
            type: 'error',
            title: 'Password Mismatch',
            message: 'Passwords do not match. Please re-enter.'
          });
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          showToast({
            type: 'error',
            title: 'Password Too Short',
            message: 'Password must be at least 6 characters.'
          });
          setLoading(false);
          return;
        }

        if (role === 'admin') {
          await adminRegister(name, email, password, phone, address);
        } else {
          await register(name, email, password, phone, address);
        }
      } else {
        // Sign In
        if (role === 'admin') {
          await adminLogin(email, password);
        } else {
          await login(email, password);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Real Google Accounts remembered on this browser/device (No fake samples)
  const [browserGoogleAccounts, setBrowserGoogleAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem('swasthya_browser_google_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const saveAccountToBrowser = (acc) => {
    try {
      const filtered = browserGoogleAccounts.filter(
        (a) => a.email.toLowerCase() !== acc.email.toLowerCase()
      );
      const updated = [acc, ...filtered];
      setBrowserGoogleAccounts(updated);
      localStorage.setItem('swasthya_browser_google_accounts', JSON.stringify(updated));
      localStorage.setItem('swasthya_last_google_email', acc.email);
    } catch (e) {}
  };

  const removeAccountFromBrowser = (emailToRemove, e) => {
    if (e) e.stopPropagation();
    try {
      const updated = browserGoogleAccounts.filter(
        (a) => a.email.toLowerCase() !== emailToRemove.toLowerCase()
      );
      setBrowserGoogleAccounts(updated);
      localStorage.setItem('swasthya_browser_google_accounts', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleSelectGoogleAccount = async (acc) => {
    setLoading(true);
    setShowGoogleModal(false);
    saveAccountToBrowser(acc);
    try {
      if (role === 'admin') {
        await adminGoogleLogin(acc.email, acc.name, acc.avatarUrl);
      } else {
        await googleLogin(acc.email, acc.name, acc.avatarUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!customGoogleEmail) return;
    setLoading(true);
    setShowGoogleModal(false);
    const chosenEmail = customGoogleEmail.trim().toLowerCase();
    const chosenName = customGoogleName.trim() || chosenEmail.split('@')[0];
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(chosenEmail)}`;

    const newAcc = {
      name: chosenName,
      email: chosenEmail,
      avatarUrl,
      badge: 'Signed in on this browser'
    };
    saveAccountToBrowser(newAcc);

    try {
      if (role === 'admin') {
        await adminGoogleLogin(chosenEmail, chosenName, avatarUrl);
      } else {
        await googleLogin(chosenEmail, chosenName, avatarUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Step 1: Request Code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast({
        type: 'error',
        title: 'Email Required',
        message: 'Please enter your registered email address.'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setGeneratedCode(res.resetCode);
      setResetCodeInput(res.resetCode); // auto-fill for instant seamless verification
      setStep('reset');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Step 2: Confirm Reset
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast({
        type: 'error',
        title: 'Password Mismatch',
        message: 'New passwords do not match. Please verify.'
      });
      return;
    }

    if (newPassword.length < 6) {
      showToast({
        type: 'error',
        title: 'Password Too Short',
        message: 'Password must be at least 6 characters.'
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email,
        resetCode: resetCodeInput,
        newPassword
      });
      setPassword(newPassword);
      setMode('login');
      setStep('request');
      setGeneratedCode('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isThemeAdmin = role === 'admin';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      background: isThemeAdmin
        ? 'radial-gradient(circle at 50% 20%, #0f172a 0%, #020617 100%)'
        : 'radial-gradient(circle at 50% 20%, #0b1528 0%, #020617 100%)'
    }}>
      {/* Dynamic Glowing Auras */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: isThemeAdmin ? '60%' : '20%',
        width: '450px',
        height: '450px',
        background: isThemeAdmin
          ? 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, transparent 70%)',
        pointerEvents: 'none',
        transition: 'all 0.5s ease'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: isThemeAdmin ? '60%' : '20%',
        width: '450px',
        height: '450px',
        background: isThemeAdmin
          ? 'radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
        transition: 'all 0.5s ease'
      }} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '38px 34px',
        position: 'relative',
        zIndex: 10,
        borderColor: isThemeAdmin ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)',
        boxShadow: isThemeAdmin
          ? '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.15)'
          : '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.15)',
        transition: 'all 0.3s ease'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: isThemeAdmin
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isThemeAdmin
              ? '0 8px 24px rgba(245, 158, 11, 0.4)'
              : '0 8px 24px rgba(16, 185, 129, 0.4)',
            marginBottom: '12px'
          }}>
            {isThemeAdmin ? (
              <ShieldCheck size={30} color="#ffffff" />
            ) : (
              <HeartPulse size={30} color="#ffffff" />
            )}
          </div>
          <h1 style={{
            fontSize: '1.9rem',
            color: '#f8fafc',
            marginBottom: '4px',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em'
          }}>
            SWASTHYA
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            {isThemeAdmin
              ? 'Administrative & Platform Oversight Portal'
              : 'Personalized Fitness, Yoga & Wellness Platform'}
          </p>
        </div>

        {/* 1. TOP OPTIONS: LOG IN AS USER OR ADMIN */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid var(--border-glass-bright)',
          borderRadius: '14px',
          padding: '6px',
          marginBottom: '22px'
        }}>
          <button
            type="button"
            onClick={() => handleRoleSwitch('user')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 12px',
              borderRadius: '10px',
              border: role === 'user' ? '1px solid rgba(16, 185, 129, 0.6)' : '1px solid transparent',
              background: role === 'user'
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)'
                : 'transparent',
              color: role === 'user' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: role === 'user' ? '0 4px 14px rgba(16, 185, 129, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <User size={17} color={role === 'user' ? 'var(--emerald-primary)' : 'currentColor'} />
            <span>Log in as User</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 12px',
              borderRadius: '10px',
              border: role === 'admin' ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid transparent',
              background: role === 'admin'
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.2) 100%)'
                : 'transparent',
              color: role === 'admin' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: role === 'admin' ? '0 4px 14px rgba(245, 158, 11, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={17} color={role === 'admin' ? 'var(--amber-primary)' : 'currentColor'} />
            <span>Log in as Admin</span>
          </button>
        </div>

        {/* FORGOT PASSWORD VIEW */}
        {mode === 'forgot_password' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setStep('request'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem'
                }}
              >
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '20px',
                background: isThemeAdmin ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: isThemeAdmin ? '#fbbf24' : 'var(--emerald-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '8px'
              }}>
                <KeyRound size={13} />
                <span>Account Recovery</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '6px' }}>
                Reset Your Password
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.45 }}>
                {step === 'request'
                  ? `Enter your registered ${isThemeAdmin ? 'administrator' : 'user'} email to receive a password reset verification code.`
                  : 'Enter the 6-digit verification code below along with your new password.'}
              </p>
            </div>

            {step === 'request' ? (
              <form onSubmit={handleRequestCode} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Registered Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="email"
                      required
                      placeholder={isThemeAdmin ? 'admin@swasthya.edu' : 'athlete@swasthya.edu'}
                      className="input-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: isThemeAdmin ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : undefined
                  }}
                >
                  <span>{loading ? 'Generating Code...' : 'Send Verification Code'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Instant Verification Code Helper Banner */}
                {generatedCode && (
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <CheckCircle2 size={18} color="var(--emerald-primary)" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.82rem', color: '#a7f3d0' }}>
                      Verification code generated: <strong style={{ color: '#ffffff', letterSpacing: '0.08em', fontSize: '0.95rem' }}>{generatedCode}</strong>
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 123456"
                    className="input-field"
                    value={resetCodeInput}
                    onChange={(e) => setResetCodeInput(e.target.value)}
                    style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.1rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      className="input-field"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ paddingLeft: '38px', paddingRight: '38px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-type new password"
                      className="input-field"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: isThemeAdmin ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : undefined
                  }}
                >
                  <span>{loading ? 'Updating Password...' : 'Reset Password & Sign In'}</span>
                  <CheckCircle2 size={16} />
                </button>
              </form>
            )}
          </div>
        ) : (
          /* REGULAR LOGIN & SIGN UP VIEW */
          <div>
            {/* 2. SUB OPTIONS: SIGN IN VS SIGN UP (CREATE ACCOUNT) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  padding: '9px',
                  border: 'none',
                  borderRadius: '8px',
                  background: mode === 'login'
                    ? (isThemeAdmin ? 'var(--amber-primary)' : 'var(--emerald-primary)')
                    : 'transparent',
                  color: mode === 'login' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{
                  padding: '9px',
                  border: 'none',
                  borderRadius: '8px',
                  background: mode === 'signup'
                    ? (isThemeAdmin ? 'var(--amber-primary)' : 'var(--emerald-primary)')
                    : 'transparent',
                  color: mode === 'signup' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Sign Up (Create Account)
              </button>
            </div>

            {/* Email + Password Form */}
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {isThemeAdmin ? 'Administrator Full Name' : 'Full Name'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      required
                      placeholder={isThemeAdmin ? 'e.g. Dr. Rajesh Sharma' : 'e.g. Riya Sharma'}
                      className="input-field"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {isThemeAdmin ? 'Administrator Official Email' : 'Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="email"
                    required
                    placeholder={isThemeAdmin ? 'admin@swasthya.edu' : 'athlete@campus.edu'}
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              {/* Personal Details at registration: Phone & Address */}
              {mode === 'signup' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Phone Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        className="input-field"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ paddingLeft: '38px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Residential Address / Campus Hostel Location
                    </label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hostel 4, Room 204, North Campus, New Delhi"
                        className="input-field"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ paddingLeft: '38px' }}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {isThemeAdmin ? 'Master Password' : 'Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot_password'); setStep('request'); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isThemeAdmin ? '#fbbf24' : 'var(--emerald-primary)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter your password"
                      className="input-field"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>
              )}

              {mode === 'signup' && isThemeAdmin && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                    <KeyRound size={14} /> Master Clearance Key (Optional Verification)
                  </label>
                  <input
                    type="password"
                    placeholder="SWASTHYA-SECURE-2026"
                    className="input-field"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '6px',
                  fontSize: '0.95rem',
                  background: isThemeAdmin ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : undefined,
                  boxShadow: isThemeAdmin ? '0 4px 18px rgba(245, 158, 11, 0.35)' : undefined
                }}
              >
                <span>
                  {mode === 'signup'
                    ? (isThemeAdmin ? 'Register Administrator Account' : 'Create User Account & Start')
                    : (isThemeAdmin ? 'Sign In as Administrator' : 'Sign In as User')}
                </span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Google OAuth SSO Section (Opens Account Chooser) */}
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => { setShowGoogleModal(true); setIsEnteringCustomGoogle(false); }}
                disabled={loading}
                className="btn-secondary"
                style={{
                  width: '100%',
                  padding: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  borderColor: isThemeAdmin ? 'rgba(245, 158, 11, 0.3)' : undefined
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>
                  {isThemeAdmin
                    ? 'Admin Google Workspace SSO'
                    : 'Continue with Google'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* GOOGLE ACCOUNT CHOOSER MODAL */}
      {showGoogleModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#182234',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '440px',
            padding: '28px 24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(66, 133, 244, 0.25)',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>
                    Choose an account
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    to continue to <strong style={{ color: '#38bdf8' }}>SWASTHYA</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Account List */}
            {!isEnteringCustomGoogle ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {browserGoogleAccounts.length > 0 ? (
                  browserGoogleAccounts.map((acc, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectGoogleAccount(acc)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      className="hover-bg"
                    >
                      <img
                        src={acc.avatarUrl}
                        alt={acc.name}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid rgba(66, 133, 244, 0.5)'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f8fafc' }}>
                          {acc.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {acc.email}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '2px' }}>
                          {acc.badge || 'Logged in on this browser'}
                        </div>
                      </div>

                      {/* Remove account from browser button */}
                      <button
                        type="button"
                        title="Remove from this device"
                        onClick={(e) => removeAccountFromBrowser(acc.email, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255, 255, 255, 0.15)'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(66, 133, 244, 0.15)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      marginBottom: '10px'
                    }}>
                      <Mail size={22} />
                    </div>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.92rem', marginBottom: '4px' }}>
                      No Google accounts currently saved in this browser
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                      Add your Google account below to sign in and save it to this device.
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEnteringCustomGoogle(true)}
                      className="btn-primary"
                      style={{
                        padding: '10px 18px',
                        fontSize: '0.85rem',
                        background: 'linear-gradient(135deg, #4285F4 0%, #1a73e8 100%)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Plus size={16} />
                      <span>Add Google Account</span>
                    </button>
                  </div>
                )}

                {/* Option to add an account if some accounts exist */}
                {browserGoogleAccounts.length > 0 && (
                  <div
                    onClick={() => setIsEnteringCustomGoogle(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px dashed rgba(255, 255, 255, 0.25)',
                      cursor: 'pointer',
                      marginTop: '4px',
                      background: 'rgba(66, 133, 244, 0.05)'
                    }}
                    className="hover-bg"
                  >
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(66, 133, 244, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8'
                    }}>
                      <Plus size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                        Add an account / Use another account
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Sign in with any Gmail or Google Workspace ID
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Custom Google Email Form */
              <form onSubmit={handleCustomGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Enter your Google Workspace or Gmail account:
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Google Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com"
                      className="input-field"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Display Name (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      placeholder="e.g. Alex Yadav"
                      className="input-field"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEnteringCustomGoogle(false)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    Back to Accounts
                  </button>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      flex: 1.4,
                      padding: '10px',
                      background: 'linear-gradient(135deg, #4285F4 0%, #1a73e8 100%)'
                    }}
                  >
                    Continue with Google
                  </button>
                </div>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              To continue, Google will share your name, email address, and profile picture with SWASTHYA.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
