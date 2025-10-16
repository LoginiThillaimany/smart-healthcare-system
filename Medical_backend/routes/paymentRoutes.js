const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * Payment Routes
 * RESTful API endpoints for Payment & Billing Management
 */

// Create new payment
router.post('/', paymentController.createPayment);

// Get payment statistics
router.get('/statistics', paymentController.getPaymentStatistics);

// Get all payments (with filters)
router.get('/', paymentController.getAllPayments);

// Get payment by ID
router.get('/:id', paymentController.getPaymentById);

// Process payment
router.post('/:id/process', paymentController.processPayment);

// Refund payment
router.post('/:id/refund', paymentController.refundPayment);

// Generate invoice
router.get('/:id/invoice', paymentController.generateInvoice);

// Get patient payment history
router.get('/patient/:patientId/history', paymentController.getPatientPaymentHistory);

module.exports = router;