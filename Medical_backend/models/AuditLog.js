const mongoose = require('mongoose');

/**
 * AuditLog Model
 * Tracks all system actions for security and compliance
 * Part of: Data Analysis & Reporting use case
 */
const auditLogSchema = new mongoose.Schema({
  // Action Details
  action: {
    type: String,
    required: [true, 'Action type is required'],
    enum: [
      'Appointment Created',
      'Appointment Updated',
      'Appointment Cancelled',
      'Patient Created',
      'Patient Updated',
      'Payment Processed',
      'Payment Refunded',
      'Medical Record Accessed',
      'Medical Record Updated',
      'Report Generated',
      'User Login',
      'User Logout',
      'System Configuration Changed'
    ]
  },
  
  // User Information
  performedBy: {
    userId: String,
    userType: {
      type: String,
      enum: ['Patient', 'Doctor', 'Admin', 'System']
    },
    userName: String
  },
  
  // Related Entities
  entityType: {
    type: String,
    enum: ['Appointment', 'Patient', 'Doctor', 'Payment', 'MedicalRecord']
  },
  entityId: mongoose.Schema.Types.ObjectId,
  
  // Details
  details: mongoose.Schema.Types.Mixed,
  
  // Change Tracking
  changesBefore: mongoose.Schema.Types.Mixed,
  changesAfter: mongoose.Schema.Types.Mixed,
  
  // System Info
  ipAddress: String,
  userAgent: String,
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  
  // Severity Level
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  
  // Status
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Warning'],
    default: 'Success'
  },
  
  errorMessage: String
}, {
  timestamps: false // We use custom timestamp field
});

// Indexes for querying
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ 'performedBy.userId': 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });

// Static method to log action
auditLogSchema.statics.logAction = async function(data) {
  const log = new this(data);
  await log.save();
  return log;
};

// Static method to get audit trail for an entity
auditLogSchema.statics.getEntityAuditTrail = async function(entityType, entityId) {
  return await this.find({ entityType, entityId })
    .sort({ timestamp: -1 })
    .limit(50);
};

// Static method to get user activity
auditLogSchema.statics.getUserActivity = async function(userId, startDate, endDate) {
  const query = { 'performedBy.userId': userId };
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }
  
  return await this.find(query).sort({ timestamp: -1 });
};

module.exports = mongoose.model('AuditLog', auditLogSchema);