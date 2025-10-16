const mongoose = require('mongoose');

/**
 * Payment Model
 * Represents payment transactions in the system
 * Part of: Payment & Billing Management use case
 */
const paymentSchema = new mongoose.Schema({
  // Transaction Information
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  
  // References
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  
  // Payment Breakdown
  consultationFee: {
    type: Number,
    required: true
  },
  serviceFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Insurance', 'Digital Wallet'],
    required: true
  },
  
  // Card/Payment Details (encrypted in production)
  paymentDetails: {
    cardLastFour: String,
    cardType: String,
    bankName: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'Partially Refunded'],
    default: 'Pending'
  },
  
  // Receipt Information
  receiptNumber: {
    type: String,
    unique: true
  },
  invoiceUrl: String,
  
  // Refund Information
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  refundDate: Date,
  
  // Insurance Details
  insuranceProvider: String,
  insuranceClaimNumber: String,
  insuranceCoverageAmount: Number,
  
  // Timestamps
  paymentDate: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  
  // Additional Info
  notes: String,
  billingAddress: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ patient: 1, paymentDate: -1 });
paymentSchema.index({ appointment: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ receiptNumber: 1 });

// Pre-save: Generate transaction and receipt numbers
paymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
  }
  if (!this.receiptNumber && this.status === 'Completed') {
    this.receiptNumber = `RCP${Date.now()}${Math.floor(Math.random() * 10000)}`;
    this.completedAt = new Date();
  }
  next();
});

// Method to process payment
paymentSchema.methods.processPayment = async function() {
  this.status = 'Processing';
  await this.save();
  
  // Simulate payment processing (integrate with payment gateway in production)
  return new Promise((resolve) => {
    setTimeout(() => {
      this.status = 'Completed';
      this.completedAt = new Date();
      this.save();
      resolve(this);
    }, 1000);
  });
};

// Method to refund payment
paymentSchema.methods.refund = async function(amount, reason) {
  if (this.status !== 'Completed') {
    throw new Error('Can only refund completed payments');
  }
  
  if (amount > (this.amount - this.refundAmount)) {
    throw new Error('Refund amount exceeds available amount');
  }
  
  this.refundAmount += amount;
  this.refundReason = reason;
  this.refundDate = new Date();
  
  if (this.refundAmount >= this.amount) {
    this.status = 'Refunded';
  } else {
    this.status = 'Partially Refunded';
  }
  
  await this.save();
  return this;
};

// Virtual for net amount
paymentSchema.virtual('netAmount').get(function() {
  return this.amount - this.refundAmount;
});

paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Payment', paymentSchema);
