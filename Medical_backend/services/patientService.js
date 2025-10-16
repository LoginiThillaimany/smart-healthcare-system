const Patient = require('../models/Patient');
const AuditLog = require('../models/AuditLog');

/**
 * Patient Service
 * Business logic for Patient Account & Medical Record Management
 * Implements Repository Pattern and SOLID principles
 */
class PatientService {
  /**
   * Create a new patient
   * @param {Object} patientData
   * @returns {Promise<Patient>}
   */
  async createPatient(patientData) {
    try {
      // Check if email already exists
      const existingPatient = await Patient.findOne({ email: patientData.email });
      if (existingPatient) {
        throw new Error('Email already registered');
      }

      const patient = new Patient(patientData);
      await patient.save();

      // Log action
      await AuditLog.logAction({
        action: 'Patient Created',
        performedBy: {
          userId: patient._id.toString(),
          userType: 'Patient',
          userName: patient.fullName
        },
        entityType: 'Patient',
        entityId: patient._id,
        severity: 'Low',
        status: 'Success'
      });

      return patient;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all patients with optional filters
   * @param {Object} filters
   * @returns {Promise<Array<Patient>>}
   */
  async getAllPatients(filters = {}) {
    const query = {};
    
    if (filters.email) query.email = filters.email;
    if (filters.healthCardNumber) query.healthCardNumber = filters.healthCardNumber;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const patients = await Patient.find(query).sort({ registrationDate: -1 });
    return patients;
  }

  /**
   * Get patient by ID
   * @param {String} patientId
   * @returns {Promise<Patient>}
   */
  async getPatientById(patientId) {
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Log access
    await AuditLog.logAction({
      action: 'Medical Record Accessed',
      performedBy: {
        userId: patientId,
        userType: 'Patient'
      },
      entityType: 'Patient',
      entityId: patientId,
      severity: 'Low',
      status: 'Success'
    });

    return patient;
  }

  /**
   * Update patient information
   * @param {String} patientId
   * @param {Object} updateData
   * @returns {Promise<Patient>}
   */
  async updatePatient(patientId, updateData) {
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      throw new Error('Patient not found');
    }

    const oldData = patient.toObject();

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== '_id' && key !== 'healthCardNumber') {
        patient[key] = updateData[key];
      }
    });

    await patient.save();

    // Log update
    await AuditLog.logAction({
      action: 'Patient Updated',
      performedBy: {
        userId: patientId,
        userType: 'Patient',
        userName: patient.fullName
      },
      entityType: 'Patient',
      entityId: patient._id,
      changesBefore: oldData,
      changesAfter: patient.toObject(),
      severity: 'Low',
      status: 'Success'
    });

    return patient;
  }

  /**
   * Add medical history entry
   * @param {String} patientId
   * @param {Object} historyData
   * @returns {Promise<Patient>}
   */
  async addMedicalHistory(patientId, historyData) {
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      throw new Error('Patient not found');
    }

    patient.medicalHistory.push(historyData);
    await patient.save();

    // Log update
    await AuditLog.logAction({
      action: 'Medical Record Updated',
      performedBy: {
        userId: historyData.doctor ? historyData.doctor.toString() : 'System',
        userType: 'Doctor'
      },
      entityType: 'Patient',
      entityId: patient._id,
      details: { historyAdded: historyData },
      severity: 'Medium',
      status: 'Success'
    });

    return patient;
  }

  /**
   * Add prescription
   * @param {String} patientId
   * @param {Object} prescriptionData
   * @returns {Promise<Patient>}
   */
  async addPrescription(patientId, prescriptionData) {
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      throw new Error('Patient not found');
    }

    patient.prescriptions.push(prescriptionData);
    await patient.save();

    // Log update
    await AuditLog.logAction({
      action: 'Medical Record Updated',
      performedBy: {
        userId: prescriptionData.doctor ? prescriptionData.doctor.toString() : 'System',
        userType: 'Doctor'
      },
      entityType: 'Patient',
      entityId: patient._id,
      details: { prescriptionAdded: prescriptionData },
      severity: 'Medium',
      status: 'Success'
    });

    return patient;
  }

  /**
   * Deactivate patient account
   * @param {String} patientId
   * @returns {Promise<Patient>}
   */
  async deactivatePatient(patientId) {
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      throw new Error('Patient not found');
    }

    patient.isActive = false;
    await patient.save();

    // Log action
    await AuditLog.logAction({
      action: 'Patient Updated',
      performedBy: {
        userId: patientId,
        userType: 'Patient'
      },
      entityType: 'Patient',
      entityId: patient._id,
      details: { action: 'Account deactivated' },
      severity: 'Medium',
      status: 'Success'
    });

    return patient;
  }

  /**
   * Search patients
   * @param {String} searchTerm
   * @returns {Promise<Array<Patient>>}
   */
  async searchPatients(searchTerm) {
    const patients = await Patient.find({
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { healthCardNumber: { $regex: searchTerm, $options: 'i' } }
      ],
      isActive: true
    }).limit(20);

    return patients;
  }

  /**
   * Get patient statistics
   * @returns {Promise<Object>}
   */
  async getPatientStatistics() {
    const totalPatients = await Patient.countDocuments();
    const activePatients = await Patient.countDocuments({ isActive: true });
    const patientsByGender = await Patient.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);
    const patientsByBloodType = await Patient.aggregate([
      { $group: { _id: '$bloodType', count: { $sum: 1 } } }
    ]);

    return {
      total: totalPatients,
      active: activePatients,
      byGender: patientsByGender,
      byBloodType: patientsByBloodType
    };
  }
}

module.exports = new PatientService();
