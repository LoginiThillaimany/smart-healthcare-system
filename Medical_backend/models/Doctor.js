const mongoose = require('mongoose');

/**
 * Doctor Model
 * Represents a doctor in the healthcare system
 * Part of: Appointment Scheduling & Management use case
 */
const doctorSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  // Link to user account (for login)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  phone: {
    type: String,
    required: true
  },
  
  // Professional Information
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    enum: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General', 'Oncology', 'Psychiatry']
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  qualification: {
    degree: String,
    institution: String,
    yearGraduated: Number
  },
  experienceYears: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // Availability Schedule
  schedule: [{
    date: {
      type: Date,
      required: true
    },
    slots: [{
      time: String,
      isAvailable: { type: Boolean, default: true }
    }]
  }],
  
  // Work Information
  department: String,
  consultationFee: {
    type: Number,
    required: true,
    min: 0
  },
  hospitalAffiliation: String,
  
  // Ratings and Reviews
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  
  // System Fields
  isActive: {
    type: Boolean,
    default: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ lastName: 1, firstName: 1 });
doctorSchema.index({ licenseNumber: 1 });

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
  return `Dr. ${this.firstName} ${this.lastName}`;
});

// Method to get available slots for a specific date
doctorSchema.methods.getAvailableSlots = function(date) {
  const dateStr = date.toISOString().split('T')[0];
  const daySchedule = this.schedule.find(
    s => s.date.toISOString().split('T')[0] === dateStr
  );
  
  if (!daySchedule) return [];
  return daySchedule.slots.filter(slot => slot.isAvailable);
};

// Method to book a slot
doctorSchema.methods.bookSlot = async function(date, time) {
  const dateStr = date.toISOString().split('T')[0];
  const daySchedule = this.schedule.find(
    s => s.date.toISOString().split('T')[0] === dateStr
  );
  
  if (!daySchedule) {
    throw new Error('No schedule found for this date');
  }
  
  const slot = daySchedule.slots.find(s => s.time === time);
  if (!slot || !slot.isAvailable) {
    throw new Error('Slot not available');
  }
  
  slot.isAvailable = false;
  await this.save();
  return slot;
};

doctorSchema.set('toJSON', { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Doctor', doctorSchema);