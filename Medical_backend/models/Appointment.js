const mongoose = require('mongoose');

/**
 * Appointment Model
 * Represents an appointment booking in the system
 * Part of: Appointment Scheduling & Management use case
 */
const appointmentSchema = new mongoose.Schema({
  // Patient and Doctor References
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient reference is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor reference is required']
  },
  
  // Appointment Details
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(v) {
        return v >= new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  
  // Appointment Information
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    minlength: [10, 'Please provide detailed reason (min 10 characters)']
  },
  symptoms: [String],
  appointmentType: {
    type: String,
    enum: ['Consultation', 'Follow-up', 'Emergency', 'Checkup'],
    default: 'Consultation'
  },
  
  // Status Management
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled', 'No-Show'],
    default: 'Scheduled'
  },
  
  // Cancellation Info
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: {
    type: String,
    enum: ['Patient', 'Doctor', 'Admin']
  },
  
  // Medical Notes (filled after appointment)
  diagnosis: String,
  prescription: String,
  notes: String,
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  
  // Payment Link
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  
  // Notification Status
  notificationSent: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  
  // System Fields
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });

// Compound index to prevent double booking
appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'Cancelled' } } }
);

// Pre-save validation: Check slot availability
appointmentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('doctor') || this.isModified('appointmentDate') || this.isModified('timeSlot')) {
    const Doctor = mongoose.model('Doctor');
    const doctor = await Doctor.findById(this.doctor);
    
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    
    try {
      const availableSlots = doctor.getAvailableSlots(this.appointmentDate);
      const slotAvailable = availableSlots.some(slot => slot.time === this.timeSlot);
      
      if (!slotAvailable && this.status !== 'Cancelled') {
        throw new Error('Selected time slot is not available');
      }
    } catch (error) {
      throw new Error(`Slot validation failed: ${error.message}`);
    }
  }
  next();
});

// Post-save: Book the slot in doctor's schedule
appointmentSchema.post('save', async function(doc) {
  if (doc.status === 'Scheduled' || doc.status === 'Confirmed') {
    const Doctor = mongoose.model('Doctor');
    const doctor = await Doctor.findById(doc.doctor);
    
    try {
      await doctor.bookSlot(doc.appointmentDate, doc.timeSlot);
    } catch (error) {
      console.error('Error booking slot:', error.message);
    }
  }
});

// Method to cancel appointment
appointmentSchema.methods.cancel = async function(reason, cancelledBy) {
  this.status = 'Cancelled';
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;
  
  // Free up the slot in doctor's schedule
  const Doctor = mongoose.model('Doctor');
  const doctor = await Doctor.findById(this.doctor);
  const dateStr = this.appointmentDate.toISOString().split('T')[0];
  const daySchedule = doctor.schedule.find(
    s => s.date.toISOString().split('T')[0] === dateStr
  );
  
  if (daySchedule) {
    const slot = daySchedule.slots.find(s => s.time === this.timeSlot);
    if (slot) {
      slot.isAvailable = true;
      await doctor.save();
    }
  }
  
  await this.save();
  return this;
};

// Method to reschedule appointment
appointmentSchema.methods.reschedule = async function(newDate, newTimeSlot) {
  // Free up old slot
  await this.cancel('Rescheduled', 'Patient');
  
  // Create new appointment
  const NewAppointment = mongoose.model('Appointment');
  const newAppointment = new NewAppointment({
    patient: this.patient,
    doctor: this.doctor,
    appointmentDate: newDate,
    timeSlot: newTimeSlot,
    reason: this.reason,
    symptoms: this.symptoms,
    appointmentType: this.appointmentType
  });
  
  await newAppointment.save();
  return newAppointment;
};

appointmentSchema.set('toJSON', { virtuals: true });
appointmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Appointment', appointmentSchema);