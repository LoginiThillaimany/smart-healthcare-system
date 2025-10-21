const appointmentService = require('../services/appointmentService');

/**
 * Appointment Controller
 * Handles HTTP requests for Appointment Scheduling & Management
 * Follows MVC pattern and SOLID principles
 */
class AppointmentController {
  /**
   * Create new appointment
   * POST /api/appointments
   */
  async createAppointment(req, res) {
    try {
      const appointmentData = req.body;
      
      // Validation
      if (!appointmentData.patient || !appointmentData.doctor) {
        return res.status(400).json({
          success: false,
          message: 'Patient and Doctor are required'
        });
      }

      if (!appointmentData.appointmentDate || !appointmentData.timeSlot) {
        return res.status(400).json({
          success: false,
          message: 'Appointment date and time slot are required'
        });
      }

      if (!appointmentData.reason || appointmentData.reason.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a detailed reason (minimum 10 characters)'
        });
      }

      const appointment = await appointmentService.createAppointment(appointmentData);

      res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all appointments
   * GET /api/appointments
   */
  async getAllAppointments(req, res) {
    try {
      const filters = {
        patient: req.query.patient,
        doctor: req.query.doctor,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const appointments = await appointmentService.getAllAppointments(filters);

      res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch appointments. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get appointment by ID
   * GET /api/appointments/:id
   */
  async getAppointmentById(req, res) {
    try {
      const appointment = await appointmentService.getAppointmentById(req.params.id);

      res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      console.error('Error fetching appointment by ID:', error);
      const statusCode = error.message.includes('Invalid') ? 400 : 404;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Update appointment
   * PUT /api/appointments/:id
   */
  async updateAppointment(req, res) {
    try {
      const appointment = await appointmentService.updateAppointment(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Appointment updated successfully',
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Cancel appointment
   * POST/PUT /api/appointments/:id/cancel
   */
  async cancelAppointment(req, res) {
    try {
      // Support both "reason" and "cancellationReason" field names
      const { reason, cancellationReason, cancelledBy } = req.body;
      const cancelReason = reason || cancellationReason;

      if (!cancelReason) {
        return res.status(400).json({
          success: false,
          message: 'Cancellation reason is required'
        });
      }

      const appointment = await appointmentService.cancelAppointment(
        req.params.id,
        cancelReason,
        cancelledBy || 'Patient'
      );

      res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully',
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Reschedule appointment
   * POST /api/appointments/:id/reschedule
   */
  async rescheduleAppointment(req, res) {
    try {
      const { newDate, newTimeSlot } = req.body;

      if (!newDate || !newTimeSlot) {
        return res.status(400).json({
          success: false,
          message: 'New date and time slot are required'
        });
      }

      const appointment = await appointmentService.rescheduleAppointment(
        req.params.id,
        new Date(newDate),
        newTimeSlot
      );

      res.status(200).json({
        success: true,
        message: 'Appointment rescheduled successfully',
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get upcoming appointments for patient
   * GET /api/appointments/patient/:patientId/upcoming
   */
  async getUpcomingAppointments(req, res) {
    try {
      const appointments = await appointmentService.getUpcomingAppointments(
        req.params.patientId
      );

      res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get appointment history for patient
   * GET /api/appointments/patient/:patientId/history
   */
  async getAppointmentHistory(req, res) {
    try {
      const appointments = await appointmentService.getAppointmentHistory(
        req.params.patientId
      );

      res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get doctor's schedule
   * GET /api/appointments/doctor/:doctorId/schedule
   */
  async getDoctorSchedule(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date is required'
        });
      }

      const schedule = await appointmentService.getDoctorSchedule(
        req.params.doctorId,
        new Date(date)
      );

      res.status(200).json({
        success: true,
        data: schedule
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete appointment (admin only)
   * DELETE /api/appointments/:id
   */
  async deleteAppointment(req, res) {
    try {
      await appointmentService.deleteAppointment(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Appointment deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AppointmentController();
