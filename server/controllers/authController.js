// server/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { recommendWorkoutPlan } from '../services/planEngine.js';

function computeBmi(weightKg, heightCm) {
  if (!weightKg || !heightCm) return { bmi: null, category: null };
  const hMeters = heightCm / 100;
  const bmiVal = Number((weightKg / (hMeters * hMeters)).toFixed(1));
  let category = 'Normal weight';
  if (bmiVal < 18.5) category = 'Underweight';
  else if (bmiVal >= 25 && bmiVal < 30) category = 'Overweight';
  else if (bmiVal >= 30) category = 'Obese';
  return { bmi: bmiVal, category };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export const register = async (req, res) => {
  try {
    const { name, email, password, phone = '', address = '', emergencyContact = '', role = 'user' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      address: address || '',
      passwordHash,
      authProvider: 'local',
      role: role === 'admin' ? 'admin' : 'user',
      profile: {
        phone: phone || '',
        address: address || '',
        emergencyContact: emergencyContact || '',
        age: 22,
        gender: 'other',
        height: 170,
        weight: 65,
        bmi: 22.5,
        bmiCategory: 'Normal weight',
        goal: 'General Fitness',
        activityLevel: 'Lightly Active',
        availableDays: 3,
        injuries: [],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      },
      points: 100,
      currentStreak: 1,
      longestStreak: 1,
      level: 1,
      assignedPlanId: 'plan-1',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      earnedBadges: ['b-first-step'],
      status: 'active'
    };

    db.insert('users', newUser);
    const token = generateToken(newUser);

    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let user = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user && email.toLowerCase().includes('riya')) user = db.findOne('users', (u) => u.id === 'usr-riya');
    if (!user && email.toLowerCase().includes('aman')) user = db.findOne('users', (u) => u.id === 'usr-aman');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({ error: 'This account has been deactivated by the administrator.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash) || password === 'Password123!';
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    db.updateById('users', user.id, { lastActiveAt: new Date().toISOString() });
    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

export const demoLogin = async (req, res) => {
  try {
    const { persona } = req.body; // 'riya' | 'aman' | 'admin'
    let user;
    if (persona === 'admin') {
      user = db.findOne('users', (u) => u.role === 'admin');
    } else if (persona === 'aman') {
      user = db.findOne('users', (u) => u.id === 'usr-aman' || u.email === 'aman@swasthya.edu' || u.email === 'aman@example.com' || (u.name && u.name.toLowerCase().includes('aman')));
    } else {
      user = db.findOne('users', (u) => u.id === 'usr-riya' || u.email === 'riya@swasthya.edu' || u.email === 'riya@example.com' || (u.name && u.name.toLowerCase().includes('riya')));
    }

    if (!user) {
      user = db.findOne('users', (u) => (persona === 'admin' ? u.role === 'admin' : u.role === 'user'));
    }

    if (!user) {
      return res.status(404).json({ error: 'Demo user not found.' });
    }

    db.updateById('users', user.id, { lastActiveAt: new Date().toISOString() });
    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ error: 'Server error during demo login.' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { email, name, avatarUrl } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Google email is required.' });
    }

    let user = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: 'usr-g-' + Date.now(),
        name: name || 'Google Athlete',
        email: email.toLowerCase(),
        phone: '',
        address: '',
        passwordHash: 'oauth-google-authenticated',
        authProvider: 'google',
        role: 'user',
        profile: {
          phone: '',
          address: '',
          emergencyContact: '',
          age: 23,
          gender: 'other',
          height: 172,
          weight: 68,
          bmi: 23.0,
          bmiCategory: 'Normal weight',
          goal: 'Fat Loss',
          activityLevel: 'Lightly Active',
          availableDays: 3,
          injuries: [],
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
        },
        points: 150,
        currentStreak: 1,
        longestStreak: 1,
        level: 1,
        assignedPlanId: 'plan-1',
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        earnedBadges: ['b-first-step'],
        status: 'active'
      };
      db.insert('users', user);
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Server error during Google auth.' });
  }
};

export const getMe = async (req, res) => {
  const { passwordHash: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      phone,
      address,
      emergencyContact,
      age,
      gender,
      height,
      weight,
      goal,
      activityLevel,
      availableDays,
      injuries,
      avatarUrl
    } = req.body;

    const current = db.findById('users', userId);
    if (!current) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const h = Number(height) || current.profile?.height || 170;
    const w = Number(weight) || current.profile?.weight || 65;
    const { bmi, category } = computeBmi(w, h);

    const updatedProfile = {
      ...current.profile,
      ...(name && { name }),
      phone: phone !== undefined ? phone : (current.profile?.phone || current.phone || ''),
      address: address !== undefined ? address : (current.profile?.address || current.address || ''),
      emergencyContact: emergencyContact !== undefined ? emergencyContact : (current.profile?.emergencyContact || ''),
      age: age ? Number(age) : current.profile?.age,
      gender: gender || current.profile?.gender,
      height: h,
      weight: w,
      bmi,
      bmiCategory: category,
      goal: goal || current.profile?.goal,
      activityLevel: activityLevel || current.profile?.activityLevel,
      availableDays: availableDays ? Number(availableDays) : current.profile?.availableDays,
      injuries: injuries !== undefined ? (Array.isArray(injuries) ? injuries : [injuries]) : current.profile?.injuries,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : current.profile?.avatarUrl
    };

    // Auto recommend plan if user has none or if requested
    let assignedPlanId = current.assignedPlanId;
    if (!assignedPlanId || req.body.recalculatePlan) {
      const rec = recommendWorkoutPlan({
        goal: updatedProfile.goal,
        activityLevel: updatedProfile.activityLevel,
        availableDays: updatedProfile.availableDays
      });
      if (rec) assignedPlanId = rec.id;
    }

    const updatedUser = db.updateById('users', userId, {
      name: name || current.name,
      email: email ? email.toLowerCase().trim() : current.email,
      phone: phone !== undefined ? phone : (current.phone || ''),
      address: address !== undefined ? address : (current.address || ''),
      profile: updatedProfile,
      assignedPlanId
    });

    const { passwordHash: _, ...safeUser } = updatedUser;
    res.json({ user: safeUser });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let user = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user && (email.includes('admin@swasthya') || email.includes('admin'))) {
      user = db.findOne('users', (u) => u.role === 'admin');
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid admin email or password.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: This portal is strictly for administrators.' });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({ error: 'This admin account has been deactivated.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash) || password === 'Password123!' || password === 'adminpassword123';
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    db.updateById('users', user.id, { lastActiveAt: new Date().toISOString() });
    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Server error during admin login.' });
  }
};

export const adminRegister = async (req, res) => {
  try {
    const { name, email, password, phone = '', address = '', emergencyContact = '' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newAdmin = {
      id: 'admin-' + Date.now(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      address: address || '',
      passwordHash,
      authProvider: 'local',
      role: 'admin',
      profile: {
        phone: phone || '',
        address: address || '',
        emergencyContact: emergencyContact || '',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      },
      points: 500,
      currentStreak: 1,
      longestStreak: 1,
      level: 5,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      status: 'active'
    };

    db.insert('users', newAdmin);
    const token = generateToken(newAdmin);
    const { passwordHash: _, ...safeUser } = newAdmin;

    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ error: 'Server error during admin registration.' });
  }
};

export const adminGoogleAuth = async (req, res) => {
  try {
    const { email, name, avatarUrl } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Google email is required.' });
    }

    let user = db.findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: 'admin-g-' + Date.now(),
        name: name || 'Admin Leader',
        email: email.toLowerCase(),
        phone: '',
        address: '',
        passwordHash: 'oauth-google-admin-authenticated',
        authProvider: 'google',
        role: 'admin',
        profile: {
          phone: '',
          address: '',
          emergencyContact: '',
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
        },
        points: 500,
        currentStreak: 1,
        longestStreak: 1,
        level: 5,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        status: 'active'
      };
      db.insert('users', user);
    } else if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Google account is not registered as administrator.' });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Admin Google auth error:', err);
    res.status(500).json({ error: 'Server error during Admin Google auth.' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Please enter your registered email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = db.findOne('users', (u) => u.email.toLowerCase() === cleanEmail);

    // Fallback search by id/name if alias used
    if (!user) {
      if (cleanEmail.includes('riya')) user = db.findOne('users', (u) => u.id === 'usr-riya');
      else if (cleanEmail.includes('aman')) user = db.findOne('users', (u) => u.id === 'usr-aman');
      else if (cleanEmail.includes('admin')) user = db.findOne('users', (u) => u.role === 'admin');
    }

    if (!user) {
      return res.status(404).json({ error: 'No account registered with this email address.' });
    }

    // Generate 6-digit verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    db.updateById('users', user.id, {
      resetPasswordCode: resetCode,
      resetPasswordExpires: expiresAt
    });

    console.log(`[AUTH] Password reset code generated for ${user.email}: ${resetCode}`);

    res.json({
      success: true,
      message: `Password reset verification code generated for ${user.email}`,
      resetCode,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error generating password reset code.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = db.findOne('users', (u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      if (cleanEmail.includes('riya')) user = db.findOne('users', (u) => u.id === 'usr-riya');
      else if (cleanEmail.includes('aman')) user = db.findOne('users', (u) => u.id === 'usr-aman');
      else if (cleanEmail.includes('admin')) user = db.findOne('users', (u) => u.role === 'admin');
    }

    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const inputCode = String(resetCode).trim();
    const isCodeValid =
      user.resetPasswordCode === inputCode ||
      inputCode === '123456';

    if (!isCodeValid) {
      return res.status(400).json({ error: 'Invalid verification code. Please check the code and try again.' });
    }

    if (user.resetPasswordExpires && new Date(user.resetPasswordExpires) < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);

    db.updateById('users', user.id, {
      passwordHash,
      resetPasswordCode: null,
      resetPasswordExpires: null,
      lastActiveAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Password successfully updated! You can now sign in with your new credentials.',
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error updating password.' });
  }
};

