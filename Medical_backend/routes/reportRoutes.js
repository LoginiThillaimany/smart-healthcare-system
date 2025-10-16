const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

/**
 * Report Routes
 * RESTful API endpoints for Data Analysis & Reporting
 */

// Get dashboard statistics
router.get('/dashboard', reportController.getDashboardStatistics);

// Generate appointment summary report
router.post('/appointment-summary', reportController.generateAppointmentSummary);

// Generate revenue report
router.post('/revenue', reportController.generateRevenueReport);

// Get all reports (with filters)
router.get('/', reportController.getAllReports);

// Get report by ID
router.get('/:id', reportController.getReportById);

// Delete expired reports
router.delete('/cleanup', reportController.deleteExpiredReports);

module.exports = router;