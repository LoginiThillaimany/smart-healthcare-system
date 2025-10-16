const patientService = require('../services/patientService');

/**
 * Patient Controller
 * Handles HTTP requests for Patient Account & Medical Record Management
 * Follows MVC pattern and SOLID principles
 */
class PatientController {
  /**
   * Create new patient
   * POST /api/patients
   */
  async createPatient(req, res) {
    try {
      const patientData = req.body;

      // Validation
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender'];
      const missingFields = requiredFields.filter(field => !patientData[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      const patient = await patientService.createPatient(patientData);

      res.status(201).json({
        success: true,
        message: 'Patient registered successfully',
        data: patient
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all patients
   * GET /api/patients
   */
  async getAllPatients(req, res) {
    try {
      const filters = {
        email: req.query.email,
        healthCardNumber: req.query.healthCardNumber,
        isActive: req.query.isActive
      };

      const patients = await patientService.getAllPatients(filters);

      res.status(200).json({
        success: true,
        count: patients.length,
        data: patients
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get patient by ID
   * GET /api/patients/:id
   */
  async getPatientById(req, res) {
    try {
      const patient = await patientService.getPatientById(req.params.id);

      res.status(200).json({
        success: true,
        data: patient
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update patient
   * PUT /api/patients/:id
   */
  async updatePatient(req, res) {
    try {
      const patient = await patientService.updatePatient(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Patient updated successfully',
        data: patient
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Add medical history entry
   * POST /api/patients/:id/medical-history
   */
  async addMedicalHistory(req, res) {
    try {
      const { condition, treatment, doctor } = req.body;

      if (!condition || !treatment) {
        return res.status(400).json({
          success: false,
          message: 'Condition and treatment are required'
        });
      }

      const historyData = {
        date: new Date(),
        condition,
        treatment,
        doctor
      };

      const patient = await patientService.addMedicalHistory(
        req.params.id,
        historyData
      );

      res.status(200).json({
        success: true,
        message: 'Medical history added successfully',
        data: patient
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Add prescription
   * POST /api/patients/:id/prescriptions
   */
  async addPrescription(req, res) {
    try {
      const { medication, dosage, duration, doctor } = req.body;

      if (!medication || !dosage || !duration) {
        return res.status(400).json({
          success: false,
          message: 'Medication, dosage, and duration are required'
        });
      }

      const prescriptionData = {
        date: new Date(),
        medication,
        dosage,
        duration,
        doctor
      };

      const patient = await patientService.addPrescription(
        req.params.id,
        prescriptionData
      );

      res.status(200).json({
        success: true,
        message: 'Prescription added successfully',
        data: patient
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Deactivate patient account
   * POST /api/patients/:id/deactivate
   */
  async deactivatePatient(req, res) {
    try {
      const patient = await patientService.deactivatePatient(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Patient account deactivated successfully',
        data: patient
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Search patients
   * GET /api/patients/search
   */
  async searchPatients(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const patients = await patientService.searchPatients(query);

      res.status(200).json({
        success: true,
        count: patients.length,
        data: patients
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get patient statistics
   * GET /api/patients/statistics
   */
  async getPatientStatistics(req, res) {
    try {
      const statistics = await patientService.getPatientStatistics();

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
}

module.exports = new PatientController();
