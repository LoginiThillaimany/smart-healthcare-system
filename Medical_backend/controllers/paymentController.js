const paymentService = require('../services/paymentService');

/**
 * Payment Controller
 * Handles HTTP requests for Payment & Billing Management
 * Follows MVC pattern and SOLID principles
 */
class PaymentController {
  /**
   * Create new payment
   * POST /api/payments
   */
  async createPayment(req, res) {
    try {
      const paymentData = req.body;

      // Validation
      const requiredFields = ['patient', 'appointment', 'consultationFee', 'paymentMethod'];
      const missingFields = requiredFields.filter(field => !paymentData[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      const payment = await paymentService.createPayment(paymentData);

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Process payment
   * POST /api/payments/:id/process
   */
  async processPayment(req, res) {
    try {
      const payment = await paymentService.processPayment(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get payment by ID
   * GET /api/payments/:id
   */
  async getPaymentById(req, res) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all payments
   * GET /api/payments
   */
  async getAllPayments(req, res) {
    try {
      const filters = {
        patient: req.query.patient,
        status: req.query.status,
        paymentMethod: req.query.paymentMethod,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const payments = await paymentService.getAllPayments(filters);

      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Refund payment
   * POST /api/payments/:id/refund
   */
  async refundPayment(req, res) {
    try {
      const { amount, reason } = req.body;

      if (!amount || !reason) {
        return res.status(400).json({
          success: false,
          message: 'Refund amount and reason are required'
        });
      }

      const payment = await paymentService.refundPayment(
        req.params.id,
        amount,
        reason
      );

      res.status(200).json({
        success: true,
        message: 'Payment refunded successfully',
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get patient payment history
   * GET /api/payments/patient/:patientId/history
   */
  async getPatientPaymentHistory(req, res) {
    try {
      const payments = await paymentService.getPatientPaymentHistory(
        req.params.patientId
      );

      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get payment statistics
   * GET /api/payments/statistics
   */
  async getPaymentStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const statistics = await paymentService.getPaymentStatistics(
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null
      );

      res.status(200).json({
        success: true,
        data: statistics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Generate invoice
   * GET /api/payments/:id/invoice
   */
  async generateInvoice(req, res) {
    try {
      const invoice = await paymentService.generateInvoice(req.params.id);

      res.status(200).json({
        success: true,
        data: invoice
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new PaymentController();
