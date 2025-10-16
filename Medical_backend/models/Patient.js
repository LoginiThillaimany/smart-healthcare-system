const mongoose = require('mongoose');
const validator = require('validator');

/**
 * Patient Model
 * Represents a patient in the healthcare system
 * Part of: Patient Account & Medical Record Management use case
 */
const patientSchema = new mongoose.Schema({
  // User Reference (for authentication)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for now, for backward compatibility
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^\+?[\d\s-()]+$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(v) {
        return v < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  
  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'Sri Lanka' }
  },
  
  // Digital Health Card
  healthCardNumber: {
    type: String,
    unique: true,
    required: true
  },
  qrCode: {
    type: String, // Base64 encoded QR code
    default: null
  },
  profilePhoto: {
    type: String, // URL to photo
    default: null
  },
  
  // Medical Information
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  allergies: [String],
  chronicConditions: [String],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  
  // Insurance Information
  insurance: {
    provider: String,
    policyNumber: String,
    coverageType: {
      type: String,
      enum: ['Government', 'Private', 'None'],
      default: 'None'
    },
    validUntil: Date
  },
  
  // Medical Records
  medicalHistory: [{
    date: Date,
    condition: String,
    treatment: String,
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
  }],
  
  prescriptions: [{
    date: Date,
    medication: String,
    dosage: String,
    duration: String,
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
  }],
  
  // System Fields
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
patientSchema.index({ email: 1 });
patientSchema.index({ healthCardNumber: 1 });
patientSchema.index({ lastName: 1, firstName: 1 });

// Generate unique health card number before save
patientSchema.pre('save', async function(next) {
  if (!this.healthCardNumber) {
    this.healthCardNumber = `HC${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  this.lastUpdated = Date.now();
  next();
});

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
patientSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Ensure virtuals are included in JSON
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);
