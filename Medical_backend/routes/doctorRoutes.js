const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

/**
 * Doctor Routes
 * RESTful API endpoints for Doctor Management
 */

// Create new doctor (admin/manager only)
router.post('/', protect, authorize('admin', 'manager'), doctorController.createDoctor);

// Get all doctors (with filters)
router.get('/', doctorController.getAllDoctors);

// Get doctor by ID
router.get('/:id', doctorController.getDoctorById);

// Update doctor (admin/manager only)
router.put('/:id', protect, authorize('admin', 'manager'), doctorController.updateDoctor);

// Get available slots for a doctor
router.get('/:id/slots', doctorController.getAvailableSlots);

// Add schedule for a doctor (admin/manager only)
router.post('/:id/schedule', protect, authorize('admin', 'manager'), doctorController.addSchedule);

// Delete doctor (admin/manager only)
router.delete('/:id', protect, authorize('admin', 'manager'), doctorController.deleteDoctor);

module.exports = router;
