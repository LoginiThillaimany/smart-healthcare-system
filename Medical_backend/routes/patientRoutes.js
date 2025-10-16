const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

/**
 * Patient Routes
 * RESTful API endpoints for Patient Account & Medical Record Management
 */

// Create new patient
router.post('/', patientController.createPatient);

// Get patient statistics
router.get('/statistics', patientController.getPatientStatistics);

// Search patients
router.get('/search', patientController.searchPatients);

// Get all patients (with filters)
router.get('/', patientController.getAllPatients);

// Get patient by ID
router.get('/:id', patientController.getPatientById);

// Update patient
router.put('/:id', patientController.updatePatient);

// Add medical history entry
router.post('/:id/medical-history', patientController.addMedicalHistory);

// Add prescription
router.post('/:id/prescriptions', patientController.addPrescription);

// Deactivate patient account
router.post('/:id/deactivate', patientController.deactivatePatient);

module.exports = router;