const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

/**
 * Doctor Routes
 * RESTful API endpoints for Doctor Management
 */

// Create new doctor
router.post('/', doctorController.createDoctor);

// Get all doctors (with filters)
router.get('/', doctorController.getAllDoctors);

// Get doctor by ID
router.get('/:id', doctorController.getDoctorById);

// Update doctor
router.put('/:id', doctorController.updateDoctor);

// Get available slots for a doctor
router.get('/:id/slots', doctorController.getAvailableSlots);

// Add schedule for a doctor
router.post('/:id/schedule', doctorController.addSchedule);

// Delete doctor
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;
