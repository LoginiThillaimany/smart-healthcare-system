const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const AuditLog = require('../models/AuditLog');

/**
 * Payment Service
 * Business logic for Payment & Billing Management
 * Implements Repository Pattern and SOLID principles
 */
class PaymentService {
  /**
   * Create a new payment
   * @param {Object} paymentData
   * @returns {Promise<Payment>}
   */
  async createPayment(paymentData) {
    try {
      // Validate appointment exists
      const appointment = await Appointment.findById(paymentData.appointment);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Check if payment already exists for this appointment
      const existingPayment = await Payment.findOne({ 
        appointment: paymentData.appointment,
        status: { $ne: 'Failed' }
      });
      
      if (existingPayment) {
        throw new Error('Payment already exists for this appointment');
      }

      // Calculate total amount
      const amount = paymentData.consultationFee + 
                    (paymentData.serviceFee || 0) + 
                    (paymentData.tax || 0) - 
                    (paymentData.discount || 0);

      const payment = new Payment({
        ...paymentData,
        amount
      });

      await payment.save();

      // Update appointment with payment reference
      appointment.payment = payment._id;
      await appointment.save();

      // Log action
      await AuditLog.logAction({
        action: 'Payment Processed',
        performedBy: {
          userId: paymentData.patient,
          userType: 'Patient'
        },
        entityType: 'Payment',
        entityId: payment._id,
        details: {
          amount: payment.amount,
          paymentMethod: payment.paymentMethod
        },
        severity: 'Medium',
        status: 'Success'
      });

      return payment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process payment
   * @param {String} paymentId
   * @returns {Promise<Payment>}
   */
  async processPayment(paymentId) {
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'Pending') {
      throw new Error('Payment cannot be processed');
    }

    try {
      await payment.processPayment();
      
      // Log success
      await AuditLog.logAction({
        action: 'Payment Processed',
        performedBy: {
          userType: 'System'
        },
        entityType: 'Payment',
        entityId: payment._id,
        details: {
          amount: payment.amount,
          status: 'Completed'
        },
        severity: 'Low',
        status: 'Success'
      });

      return payment;
    } catch (error) {
      payment.status = 'Failed';
      await payment.save();
      
      // Log failure
      await AuditLog.logAction({
        action: 'Payment Processed',
        performedBy: {
          userType: 'System'
        },
        entityType: 'Payment',
        entityId: payment._id,
        severity: 'High',
        status: 'Failed',
        errorMessage: error.message
      });

      throw error;
    }
  }

  /**
   * Get payment by ID
   * @param {String} paymentId
   * @returns {Promise<Payment>}
   */
  async getPaymentById(paymentId) {
    const payment = await Payment.findById(paymentId)
      .populate('patient', 'firstName lastName email healthCardNumber')
      .populate({
        path: 'appointment',
        populate: { path: 'doctor', select: 'firstName lastName specialty' }
      });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  /**
   * Get all payments with filters
   * @param {Object} filters
   * @returns {Promise<Array<Payment>>}
   */
  async getAllPayments(filters = {}) {
    const query = {};
    
    if (filters.patient) query.patient = filters.patient;
    if (filters.status) query.status = filters.status;
    if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod;
    if (filters.startDate || filters.endDate) {
      query.paymentDate = {};
      if (filters.startDate) query.paymentDate.$gte = new Date(filters.startDate);
      if (filters.endDate) query.paymentDate.$lte = new Date(filters.endDate);
    }

    const payments = await Payment.find(query)
      .populate('patient', 'firstName lastName email')
      .populate('appointment', 'appointmentDate timeSlot')
      .sort({ paymentDate: -1 });

    return payments;
  }

  /**
   * Refund payment
   * @param {String} paymentId
   * @param {Number} amount
   * @param {String} reason
   * @returns {Promise<Payment>}
   */
  async refundPayment(paymentId, amount, reason) {
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }

    await payment.refund(amount, reason);

    // Log refund
    await AuditLog.logAction({
      action: 'Payment Refunded',
      performedBy: {
        userType: 'Admin'
      },
      entityType: 'Payment',
      entityId: payment._id,
      details: {
        refundAmount: amount,
        reason
      },
      severity: 'High',
      status: 'Success'
    });

    return payment;
  }

  /**
   * Get patient payment history
   * @param {String} patientId
   * @returns {Promise<Array<Payment>>}
   */
  async getPatientPaymentHistory(patientId) {
    const payments = await Payment.find({ patient: patientId })
      .populate('appointment', 'appointmentDate timeSlot')
      .sort({ paymentDate: -1 });

    return payments;
  }

  /**
   * Get payment statistics
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Object>}
   */
  async getPaymentStatistics(startDate, endDate) {
    const matchQuery = { status: 'Completed' };
    if (startDate || endDate) {
      matchQuery.paymentDate = {};
      if (startDate) matchQuery.paymentDate.$gte = startDate;
      if (endDate) matchQuery.paymentDate.$lte = endDate;
    }

    const stats = await Payment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalRefunds: { $sum: '$refundAmount' },
          transactionCount: { $sum: 1 },
          avgTransactionValue: { $avg: '$amount' }
        }
      }
    ]);

    const byPaymentMethod = await Payment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    return {
      summary: stats[0] || {
        totalRevenue: 0,
        totalRefunds: 0,
        transactionCount: 0,
        avgTransactionValue: 0
      },
      byPaymentMethod
    };
  }

  /**
   * Generate invoice for payment
   * @param {String} paymentId
   * @returns {Promise<Object>}
   */
  async generateInvoice(paymentId) {
    const payment = await Payment.findById(paymentId)
      .populate('patient')
      .populate({
        path: 'appointment',
        populate: { path: 'doctor' }
      });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'Completed') {
      throw new Error('Can only generate invoice for completed payments');
    }

    // In production, this would generate a PDF and upload to cloud storage
    const invoice = {
      invoiceNumber: payment.receiptNumber,
      issueDate: payment.completedAt,
      patient: {
        name: payment.patient.fullName,
        email: payment.patient.email,
        healthCard: payment.patient.healthCardNumber
      },
      appointment: {
        doctor: payment.appointment.doctor.fullName,
        date: payment.appointment.appointmentDate,
        time: payment.appointment.timeSlot
      },
      charges: {
        consultationFee: payment.consultationFee,
        serviceFee: payment.serviceFee,
        tax: payment.tax,
        discount: payment.discount,
        total: payment.amount
      },
      payment: {
        method: payment.paymentMethod,
        transactionId: payment.transactionId,
        date: payment.paymentDate
      }
    };

    return invoice;
  }
}

module.exports = new PaymentService();
