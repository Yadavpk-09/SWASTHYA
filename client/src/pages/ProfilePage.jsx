// client/src/pages/ProfilePage.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  User,
  Scale,
  Award,
  HeartPulse,
  Shield,
  Save,
  Sparkles,
  RefreshCw,
  Camera,
  Upload,
  Trash2,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Flame,
  Zap,
  Activity
} from 'lucide-react';

export const ProfilePage = ({ setActiveTab }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  // Personal Information
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || user?.profile?.phone || '');
  const [address, setAddress] = useState(user?.address || user?.profile?.address || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.profile?.emergencyContact || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatarUrl || '');

  // Biometrics & Fitness
  const [age, setAge] = useState(user?.profile?.age || 22);
  const [gender, setGender] = useState(user?.profile?.gender || 'female');
  const [height, setHeight] = useState(user?.profile?.height || 165);
  const [weight, setWeight] = useState(user?.profile?.weight || 64);
  const [goal, setGoal] = useState(user?.profile?.goal || 'Fat Loss');
  const [activityLevel, setActivityLevel] = useState(user?.profile?.activityLevel || 'Lightly Active');
  const [availableDays, setAvailableDays] = useState(user?.profile?.availableDays || 3);
  const [injuries, setInjuries] = useState(user?.profile?.injuries?.join(', ') || '');
  
  // Custom URL input toggle
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Live BMI calculation
  const hMeters = Number(height) / 100;
  const liveBmi = hMeters > 0 ? Number((Number(weight) / (hMeters * hMeters)).toFixed(1)) : 22.0;
  let bmiCat = 'Normal weight';
  let bmiColor = 'var(--emerald-primary)';
  if (liveBmi < 18.5) {
    bmiCat = 'Underweight';
    bmiColor = '#38bdf8';
  } else if (liveBmi >= 25 && liveBmi < 30) {
    bmiCat = 'Overweight';
    bmiColor = '#f59e0b';
  } else if (liveBmi >= 30) {
    bmiCat = 'Obese';
    bmiColor = '#ef4444';
  }

  const avatarPresets = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  ];

  // Handle local device image file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({
        type: 'error',
        title: 'Invalid File',
        message: 'Please choose an image file (PNG, JPG, WEBP).'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Image size should be less than 5MB.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result);
      showToast({
        type: 'info',
        title: 'Photo Selected',
        message: 'Photo preview loaded. Click "Save Changes" to save permanently.'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast({
      type: 'info',
      title: 'Photo Removed',
      message: 'Profile photo cleared. Click "Save Changes" to apply.'
    });
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setAvatarUrl(customUrl.trim());
    setCustomUrl('');
    setShowUrlInput(false);
    showToast({
      type: 'info',
      title: 'Photo URL Applied',
      message: 'Preview updated. Click "Save Changes" to save.'
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const injuriesList = injuries.trim()
        ? injuries.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await updateProfile({
        name,
        email,
        phone,
        address,
        emergencyContact,
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        goal,
        activityLevel,
        availableDays: Number(availableDays),
        injuries: injuriesList,
        avatarUrl,
        recalculatePlan: true
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1050px', margin: '0 auto' }}>
      {/* Top Banner Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-primary)', marginBottom: '8px' }}>
          <User size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Account Management & Biometrics
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#f8fafc' }}>
          User Profile & Personal Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Manage your personal details, profile picture, contact credentials, and health metrics. 
          Your workout and diet targets dynamically adapt to changes made here.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '26px' }}>
        {/* Left Column: Comprehensive Edit Form */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            
            {/* SECTION 1: PROFILE PHOTO MANAGEMENT */}
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--emerald-primary)" />
                <span>Profile Photo</span>
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {/* Photo Preview Container */}
                <div style={{ position: 'relative' }}>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile preview"
                      style={{
                        width: '94px',
                        height: '94px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid var(--emerald-primary)',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '94px',
                      height: '94px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
                      border: '2px dashed var(--emerald-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--emerald-primary)',
                      fontWeight: 800,
                      fontSize: '1.8rem',
                      letterSpacing: '1px'
                    }}>
                      {getInitials(name)}
                    </div>
                  )}

                  {/* Camera icon badge */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload photo from device"
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--emerald-primary)',
                      border: '2px solid #0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
                    }}
                  >
                    <Upload size={15} />
                  </button>
                </div>

                {/* Photo Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Hidden input for local file selection */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Upload size={14} />
                      <span>Upload Photo</span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        style={{
                          padding: '8px 14px',
                          fontSize: '0.82rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          color: '#f87171',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Remove Photo</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ImageIcon size={14} />
                      <span>Image URL</span>
                    </button>
                  </div>

                  {/* URL Input Drawer */}
                  {showUrlInput && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        className="input-field"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCustomUrl}
                        className="btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {/* Preset Avatars Bar */}
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Or select a curated persona avatar:
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {avatarPresets.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Preset avatar ${idx + 1}`}
                          onClick={() => setAvatarUrl(url)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: avatarUrl === url ? '2px solid var(--emerald-primary)' : '1px solid var(--border-glass)',
                            transform: avatarUrl === url ? 'scale(1.12)' : 'scale(1)',
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: PERSONAL & CONTACT INFORMATION */}
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} color="var(--emerald-primary)" />
                <span>Personal & Registration Details</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Full Name & Email */}
                <div className="grid-2col-responsive">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="email"
                        required
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Emergency Contact */}
                <div className="grid-2col-responsive">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Phone Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="input-field"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Emergency Contact / Guardian
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="text"
                        placeholder="e.g. +91 98765 00001 (Parent)"
                        className="input-field"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Address / Campus Residence */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Residential Address / Campus Hostel Location
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      placeholder="e.g. Hostel 4, Room 204, North Campus, New Delhi"
                      className="input-field"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ paddingLeft: '36px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: BIOMETRIC ANTHROPOMETRICS & SCHEDULE */}
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartPulse size={20} color="var(--emerald-primary)" />
                <span>Biometrics & Routine Scheduling</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="grid-4col-responsive">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Age
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="14"
                      max="90"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Gender
                    </label>
                    <select
                      className="input-field"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      min="100"
                      max="230"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      min="30"
                      max="250"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Primary Goal
                    </label>
                    <select
                      className="input-field"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    >
                      <option value="Fat Loss">Fat Loss & Toning</option>
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="General Fitness">General Fitness</option>
                      <option value="Flexibility & Yoga">Flexibility & Yoga</option>
                      <option value="Strength">Strength & Power</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Activity Level
                    </label>
                    <select
                      className="input-field"
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)}
                    >
                      <option value="Sedentary">Sedentary</option>
                      <option value="Lightly Active">Lightly Active</option>
                      <option value="Moderately Active">Moderately Active</option>
                      <option value="Very Active">Very Active</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Days / Week
                    </label>
                    <select
                      className="input-field"
                      value={availableDays}
                      onChange={(e) => setAvailableDays(e.target.value)}
                    >
                      <option value={3}>3 Days/wk</option>
                      <option value={4}>4 Days/wk</option>
                      <option value={5}>5 Days/wk</option>
                      <option value={6}>6 Days/wk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Medical Constraints / Injuries (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mild lower back tightness, Knee soreness, None"
                    className="input-field"
                    value={injuries}
                    onChange={(e) => setInjuries(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                padding: '14px',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Save size={18} />
              <span>{loading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Analytics & Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Live BMI Summary Card */}
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.85rem' }}>
              <Scale size={16} /> Live Body Mass Index (BMI)
            </div>

            <div style={{
              fontSize: '3.4rem',
              fontWeight: 800,
              color: bmiColor,
              fontFamily: 'var(--font-heading)',
              lineHeight: 1,
              margin: '10px 0'
            }}>
              {liveBmi}
            </div>

            <div style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.06)',
              color: bmiColor,
              marginBottom: '16px',
              border: `1px solid ${bmiColor}40`
            }}>
              {bmiCat}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Calculated using Mifflin-St Jeor biometric standards based on height ({height} cm) and weight ({weight} kg).
            </p>
          </div>

          {/* Gamification & Membership Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="var(--amber-primary)" />
              <span>Athletic Standing</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={18} color="#ef4444" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Consistency Streak</span>
                </div>
                <span style={{ fontWeight: 700, color: '#fca5a5' }}>{user?.currentStreak || 1} Days</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="#f59e0b" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total XP Points</span>
                </div>
                <span style={{ fontWeight: 700, color: '#fcd34d' }}>{user?.points || 0} pts</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} color="var(--cyan-accent)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Account Role</span>
                </div>
                <span style={{ fontWeight: 700, color: '#67e8f9', textTransform: 'capitalize' }}>
                  {user?.role === 'admin' ? 'Administrator' : 'Student Athlete'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveTab('assessment')}
                className="btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Sparkles size={14} color="var(--emerald-primary)" />
                <span>Retake Requirement Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
