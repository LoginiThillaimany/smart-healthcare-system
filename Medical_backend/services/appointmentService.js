const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const AuditLog = require('../models/AuditLog');

/**
 * Appointment Service
 * Business logic for Appointment Scheduling & Management
 * Implements Repository Pattern and SOLID principles
 */
class AppointmentService {
  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment details
   * @returns {Promise<Appointment>}
   */
  async createAppointment(appointmentData) {
    try {
      // Validate patient exists
      const patient = await Patient.findById(appointmentData.patient);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Validate doctor exists and is active
      const doctor = await Doctor.findById(appointmentData.doctor);
      if (!doctor || !doctor.isActive) {
        throw new Error('Doctor not found or inactive');
      }

      // Create appointment
      const appointment = new Appointment(appointmentData);
      await appointment.save();

      // Log the action
      await AuditLog.logAction({
        action: 'Appointment Created',
        performedBy: {
          userId: appointmentData.patient,
          userType: 'Patient',
          userName: patient.fullName
        },
        entityType: 'Appointment',
        entityId: appointment._id,
        details: {
          doctorId: doctor._id,
          doctorName: doctor.fullName,
          appointmentDate: appointment.appointmentDate,
          timeSlot: appointment.timeSlot
        },
        severity: 'Low',
        status: 'Success'
      });

      // Populate for return
      await appointment.populate('patient doctor');
      
      return appointment;
    } catch (error) {
      // Log error
      if (appointmentData.patient) {
        await AuditLog.logAction({
          action: 'Appointment Created',
          performedBy: {
            userId: appointmentData.patient,
            userType: 'Patient'
          },
          entityType: 'Appointment',
          details: appointmentData,
          severity: 'Medium',
          status: 'Failed',
          errorMessage: error.message
        });
      }
      throw error;
    }
  }

  /**
   * Get all appointments with optional filters
   * @param {Object} filters - Query filters
   * @returns {Promise<Array<Appointment>>}
   */
  async getAllAppointments(filters = {}) {
    const query = {};
    
    if (filters.patient) query.patient = filters.patient;
    if (filters.doctor) query.doctor = filters.doctor;
    if (filters.status) query.status = filters.status;
    if (filters.startDate || filters.endDate) {
      query.appointmentDate = {};
      if (filters.startDate) query.appointmentDate.$gte = new Date(filters.startDate);
      if (filters.endDate) query.appointmentDate.$lte = new Date(filters.endDate);
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email phone healthCardNumber')
      .populate('doctor', 'firstName lastName specialty consultationFee')
      .sort({ appointmentDate: -1 });

    return appointments;
  }

  /**
   * Get appointment by ID
   * @param {String} appointmentId
   * @returns {Promise<Appointment>}
   */
  async getAppointmentById(appointmentId) {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient', 'firstName lastName email phone healthCardNumber dateOfBirth gender')
        .populate('doctor', 'firstName lastName specialty consultationFee phone email hospitalAffiliation')
        .populate({
          path: 'payment',
          select: 'amount status paymentMethod transactionId',
          strictPopulate: false
        });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      return appointment;
    } catch (error) {
      // If it's a validation error or populate error, throw meaningful message
      if (error.name === 'CastError') {
        throw new Error('Invalid appointment ID format');
      }
      throw error;
    }
  }

  /**
   * Update appointment
   * @param {String} appointmentId
   * @param {Object} updateData
   * @returns {Promise<Appointment>}
   */
  async updateAppointment(appointmentId, updateData) {
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Store old data for audit
    const oldData = appointment.toObject();

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        appointment[key] = updateData[key];
      }
    });

    await appointment.save();

    // Log the update
    await AuditLog.logAction({
      action: 'Appointment Updated',
      performedBy: {
        userId: appointment.patient.toString(),
        userType: 'Patient'
      },
      entityType: 'Appointment',
      entityId: appointment._id,
      changesBefore: oldData,
      changesAfter: appointment.toObject(),
      severity: 'Low',
      status: 'Success'
    });

    await appointment.populate('patient doctor');
    return appointment;
  }

  /**
   * Cancel appointment
   * @param {String} appointmentId
   * @param {String} reason
   * @param {String} cancelledBy
   * @returns {Promise<Appointment>}
   */
  async cancelAppointment(appointmentId, reason, cancelledBy) {
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'Cancelled') {
      throw new Error('Appointment is already cancelled');
    }

    if (appointment.status === 'Completed') {
      throw new Error('Cannot cancel a completed appointment');
    }

    await appointment.cancel(reason, cancelledBy);

    // Log the cancellation
    await AuditLog.logAction({
      action: 'Appointment Cancelled',
      performedBy: {
        userId: appointment.patient.toString(),
        userType: cancelledBy
      },
      entityType: 'Appointment',
      entityId: appointment._id,
      details: {
        reason,
        cancelledBy
      },
      severity: 'Medium',
      status: 'Success'
    });

    await appointment.populate('patient doctor');
    return appointment;
  }

  /**
   * Reschedule appointment
   * @param {String} appointmentId
   * @param {Date} newDate
   * @param {String} newTimeSlot
   * @returns {Promise<Appointment>}
   */
  async rescheduleAppointment(appointmentId, newDate, newTimeSlot) {
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const newAppointment = await appointment.reschedule(newDate, newTimeSlot);

    // Log the reschedule
    await AuditLog.logAction({
      action: 'Appointment Updated',
      performedBy: {
        userId: appointment.patient.toString(),
        userType: 'Patient'
      },
      entityType: 'Appointment',
      entityId: newAppointment._id,
      details: {
        oldAppointmentId: appointmentId,
        oldDate: appointment.appointmentDate,
        oldTimeSlot: appointment.timeSlot,
        newDate,
        newTimeSlot
      },
      severity: 'Low',
      status: 'Success'
    });

    await newAppointment.populate('patient doctor');
    return newAppointment;
  }

  /**
   * Get upcoming appointments for a patient
   * @param {String} patientId
   * @returns {Promise<Array<Appointment>>}
   */
  async getUpcomingAppointments(patientId) {
    const appointments = await Appointment.find({
      patient: patientId,
      appointmentDate: { $gte: new Date() },
      status: { $in: ['Scheduled', 'Confirmed'] }
    })
      .populate('doctor', 'firstName lastName specialty consultationFee')
      .sort({ appointmentDate: 1 });

    return appointments;
  }

  /**
   * Get appointment history for a patient
   * @param {String} patientId
   * @returns {Promise<Array<Appointment>>}
   */
  async getAppointmentHistory(patientId) {
    const appointments = await Appointment.find({
      patient: patientId,
      status: { $in: ['Completed', 'Cancelled', 'No-Show'] }
    })
      .populate('doctor', 'firstName lastName specialty')
      .sort({ appointmentDate: -1 });

    return appointments;
  }

  /**
   * Get doctor's schedule for a specific date
   * @param {String} doctorId
   * @param {Date} date
   * @returns {Promise<Object>}
   */
  async getDoctorSchedule(doctorId, date) {
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const availableSlots = doctor.getAvailableSlots(date);
    
    return {
      doctor: {
        id: doctor._id,
        name: doctor.fullName,
        specialty: doctor.specialty,
        consultationFee: doctor.consultationFee
      },
      date,
      availableSlots
    };
  }

  /**
   * Delete appointment (admin only)
   * @param {String} appointmentId
   * @returns {Promise<void>}
   */
  async deleteAppointment(appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    await Appointment.findByIdAndDelete(appointmentId);

    // Log deletion
    await AuditLog.logAction({
      action: 'Appointment Cancelled',
      performedBy: {
        userType: 'Admin'
      },
      entityType: 'Appointment',
      entityId: appointmentId,
      details: appointment.toObject(),
      severity: 'High',
      status: 'Success'
    });
  }
}

module.exports = new AppointmentService();
