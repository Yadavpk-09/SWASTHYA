// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setAuthToken, getAuthToken } from '../services/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getAuthToken());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCurrentUser = useCallback(async () => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      setUser(res.user);
      if (res.user?.role === 'admin') {
        setActiveTab('admin');
      } else if (res.user?.isNewUser || res.user?.hasCompletedAssessment === false) {
        // If new user has not completed assessment, direct to My Swasthya Plan
        setActiveTab('assessment');
      } else {
        setActiveTab('dashboard');
      }
    } catch (err) {
      console.warn('Session expired or server unavailable:', err.message);
      setAuthToken(null);
      setTokenState(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    try {
      const res = await api.auth.login({ email, password });
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      // Existing user logging in: lands directly on dashboard (or admin)
      if (res.user?.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
      showToast({
        type: 'success',
        title: 'Welcome Back!',
        message: `Logged in as ${res.user.name}`
      });
      return res.user;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Authentication Failed',
        message: err.message || 'Invalid credentials'
      });
      throw err;
    }
  };

  const sendRegistrationOtp = async (details) => {
    try {
      const res = await api.auth.sendRegistrationOtp(details);
      showToast({
        type: 'success',
        title: 'Verification OTP Sent',
        message: `A 6-digit OTP has been sent to ${res.email}.`
      });
      return res;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Could Not Send OTP',
        message: err.message || 'Failed to send verification OTP'
      });
      throw err;
    }
  };

  const register = async (name, email, password, phone = '', address = '', role = 'user', otp = '') => {
    try {
      const res = await api.auth.register({ name, email, password, phone, address, role, otp });
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      // New user creating their account: lands directly on "My Swasthya Plan" to generate future plan & goals!
      if (res.user?.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('assessment');
      }
      showToast({
        type: 'success',
        title: 'Account Created!',
        message: `Welcome to SWASTHYA, ${res.user.name}! Please set up your personalized fitness & yoga plan.`
      });
      return res.user;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Registration Failed',
        message: err.message || 'Could not register'
      });
      throw err;
    }
  };

  const demoLogin = async (persona) => {
    try {
      const res = await api.auth.demoLogin(persona);
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      // Existing demo persona lands on dashboard (or admin)
      if (res.user?.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
      showToast({
        type: 'success',
        title: 'Demo Persona Active',
        message: `Logged in as ${res.user.name} (${res.user.role})`
      });
      return res.user;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Demo Login Failed',
        message: err.message
      });
      throw err;
    }
  };

  const googleLogin = async (email, name, avatarUrl) => {
    try {
      const res = await api.auth.googleLogin({ email, name, avatarUrl });
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      // New Google signups land on assessment; existing Google users land on dashboard
      const isNew = res.isNewUser || res.user?.isNewUser || res.user?.hasCompletedAssessment === false;
      if (res.user?.role === 'admin') {
        setActiveTab('admin');
      } else if (isNew) {
        setActiveTab('assessment');
      } else {
        setActiveTab('dashboard');
      }
      showToast({
        type: 'success',
        title: isNew ? 'Welcome to SWASTHYA!' : 'Google OAuth Connected',
        message: isNew ? `Account created for ${res.user.name}! Let's generate your personal plan.` : `Signed in as ${res.user.name}`
      });
      return res.user;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Google Sign-In Failed',
        message: err.message
      });
      throw err;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
    setActiveTab('dashboard');
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely signed out.'
    });
  };

  const adminLogin = async (email, password) => {
    try {
      const res = await api.auth.adminLogin({ email, password });
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      setActiveTab('admin');
      showToast({
        type: 'success',
        title: 'Admin Access Granted',
        message: `Welcome to SWASTHYA Admin Console, ${res.user.name}`
      });
      return res.user;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Admin Auth Failed',
        message: err.message || 'Invalid administrator credentials'
      });
      throw err;
    }
  };

  const adminRegister = async (name, email, password, phone = '', address = '', otp = '') => {
    try {
      const res = await api.auth.adminRegister({ name, email, password, phone, address, otp });
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      setActiveTab('admin');
      showToast({
        type: 'success',
        title: 'Admin Account Created',
        message: `Administrative credentials established for ${res.user.name}`
      });
      return res.user;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Admin Setup Failed',
        message: err.message || 'Could not register administrator'
      });
      throw err;
    }
  };

  const adminGoogleLogin = async (email, name, avatarUrl) => {
    try {
      const res = await api.auth.adminGoogleLogin({ email, name, avatarUrl });
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      setActiveTab('admin');
      showToast({
        type: 'success',
        title: 'Admin OAuth Verified',
        message: `Admin session started as ${res.user.name}`
      });
      return res.user;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Admin Sign-In Failed',
        message: err.message
      });
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.auth.updateProfile(profileData);
      setUser(res.user);
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your health metrics and fitness plan have been updated.'
      });
      return res.user;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message
      });
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await api.auth.forgotPassword(email);
      showToast({
        type: 'info',
        title: 'Reset Code Sent',
        message: res.message || 'Verification code generated'
      });
      return res;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Reset Request Failed',
        message: err.message || 'Could not process password reset'
      });
      throw err;
    }
  };

  const resetPassword = async (payload) => {
    try {
      const res = await api.auth.resetPassword(payload);
      showToast({
        type: 'success',
        title: 'Password Updated!',
        message: res.message || 'You can now sign in with your new password.'
      });
      return res;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Reset Failed',
        message: err.message || 'Could not reset password'
      });
      throw err;
    }
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        activeTab,
        setActiveTab,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        sendRegistrationOtp,
        demoLogin,
        googleLogin,
        adminLogin,
        adminRegister,
        adminGoogleLogin,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile,
        updateUserState,
        refreshUser: fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
