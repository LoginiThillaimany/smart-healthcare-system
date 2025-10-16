const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

/**
 * Appointment Routes
 * RESTful API endpoints for Appointment Scheduling & Management
 */

// Create new appointment
router.post('/', appointmentController.createAppointment);

// Get all appointments (with filters)
router.get('/', appointmentController.getAllAppointments);

// Get appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Update appointment
router.put('/:id', appointmentController.updateAppointment);

// Cancel appointment
router.post('/:id/cancel', appointmentController.cancelAppointment);

// Reschedule appointment
router.post('/:id/reschedule', appointmentController.rescheduleAppointment);

// Get upcoming appointments for a patient
router.get('/patient/:patientId/upcoming', appointmentController.getUpcomingAppointments);

// Get appointment history for a patient
router.get('/patient/:patientId/history', appointmentController.getAppointmentHistory);

// Get doctor's schedule
router.get('/doctor/:doctorId/schedule', appointmentController.getDoctorSchedule);

// Delete appointment (admin only)
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;