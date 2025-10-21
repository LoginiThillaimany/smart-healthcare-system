const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Patient = require('../models/Patient');

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'healthcare-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * @desc    Register new patient
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth, gender, address } = req.body;

    console.log('🚀 Registration attempt for email:', email);
    console.log('📝 Request body:', { ...req.body, password: '***' });

    // Enhanced input validation
    const requiredFields = { email, password, firstName, lastName, phone, dateOfBirth, gender };
    const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Password strength validation
    if (password.length < 8) {
      console.log('❌ Password too short');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      console.log('❌ Invalid phone format:', phone);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number'
      });
    }

    // Date of birth validation
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime()) || birthDate >= new Date()) {
      console.log('❌ Invalid date of birth:', dateOfBirth);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid date of birth in the past'
      });
    }

    // Check if user already exists
    console.log('🔍 Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please use a different email or try logging in.'
      });
    }

    // Check if patient already exists (additional safety check)
    const existingPatient = await Patient.findOne({ email: email.toLowerCase() });
    if (existingPatient) {
      console.log('❌ Patient already exists with email:', email);
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please use a different email or try logging in.'
      });
    }

    console.log('✅ Email is available, creating user account...');

    // Create user account
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      role: 'patient',
      isVerified: false // Will be verified via email
    });

    console.log('✅ User account created with ID:', user._id);

    // Generate unique health card number
    const healthCardNumber = `HC${Date.now()}${Math.floor(Math.random() * 1000)}`;
    console.log('🆔 Generated health card number:', healthCardNumber);

    // Create patient profile
    const patient = await Patient.create({
      userId: user._id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      dateOfBirth: birthDate,
      gender,
      address: address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Sri Lanka'
      },
      healthCardNumber
    });

    console.log('✅ Patient profile created with ID:', patient._id);

    // Generate token
    const token = generateToken(user._id);
    console.log('✅ JWT token generated');

    const responseData = {
      success: true,
      message: 'Registration successful! Welcome to our healthcare system.',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        patient: {
          id: patient._id,
          fullName: patient.fullName,
          healthCardNumber: patient.healthCardNumber,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          phone: patient.phone
        }
      }
    };

    console.log('✅ Registration successful for:', email);
    res.status(201).json(responseData);

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      console.error('❌ Duplicate key error on field:', field);
      
      return res.status(409).json({
        success: false,
        message: field === 'email' 
          ? 'Email already registered. Please use a different email or try logging in.'
          : `${field} already exists. Please use a different value.`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('❌ Validation error:', error.message);
      const validationErrors = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle other errors
    console.error('❌ Unexpected error during registration:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to server error. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Get patient data if user is a patient
    let patientData = null;
    if (user.role === 'patient') {
      patientData = await Patient.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        },
        patient: patientData ? {
          id: patientData._id,
          fullName: patientData.fullName,
          healthCardNumber: patientData.healthCardNumber
        } : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let profile = null;
    if (user.role === 'patient') {
      profile = await Patient.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

/**
 * @desc    Forgot password - send reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set expiry
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // In production, send email with reset token
    // For now, just return the token (NOT recommended in production!)
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    res.status(200).json({
      success: true,
      message: 'Password reset token sent',
      resetUrl // Remove this in production
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending reset token',
      error: error.message
    });
  }
};

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    // Hash token to compare
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      data: { token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Validate current password
    const isValid = await user.comparePassword(currentPassword);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      data: { token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
};
