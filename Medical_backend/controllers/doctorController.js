const Doctor = require('../models/Doctor');

/**
 * Doctor Controller
 * Handles HTTP requests for Doctor management
 * Follows MVC pattern and SOLID principles
 */
class DoctorController {
  /**
   * Create new doctor
   * POST /api/doctors
   */
  async createDoctor(req, res) {
    try {
      const doctorData = req.body;

      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'specialty', 'licenseNumber', 'consultationFee'];
      const missingFields = requiredFields.filter(field => !doctorData[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      const doctor = new Doctor(doctorData);
      await doctor.save();

      res.status(201).json({
        success: true,
        message: 'Doctor created successfully',
        data: doctor
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all doctors
   * GET /api/doctors
   */
  async getAllDoctors(req, res) {
    try {
      const { specialty, isActive } = req.query;
      const query = {};

      if (specialty) query.specialty = specialty;
      if (isActive !== undefined) query.isActive = isActive === 'true';

      const doctors = await Doctor.find(query).sort({ lastName: 1 });

      res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get doctor by ID
   * GET /api/doctors/:id
   */
  async getDoctorById(req, res) {
    try {
      const doctor = await Doctor.findById(req.params.id);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.status(200).json({
        success: true,
        data: doctor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update doctor
   * PUT /api/doctors/:id
   */
  async updateDoctor(req, res) {
    try {
      const doctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Doctor updated successfully',
        data: doctor
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get available slots for a doctor
   * GET /api/doctors/:id/slots
   */
  async getAvailableSlots(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date is required'
        });
      }

      const doctor = await Doctor.findById(req.params.id);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      const availableSlots = doctor.getAvailableSlots(new Date(date));

      res.status(200).json({
        success: true,
        data: {
          doctor: {
            id: doctor._id,
            name: doctor.fullName,
            specialty: doctor.specialty
          },
          date,
          slots: availableSlots
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Add schedule for a doctor
   * POST /api/doctors/:id/schedule
   */
  async addSchedule(req, res) {
    try {
      const { date, slots } = req.body;

      if (!date || !slots || !Array.isArray(slots)) {
        return res.status(400).json({
          success: false,
          message: 'Date and slots array are required'
        });
      }

      const doctor = await Doctor.findById(req.params.id);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      const scheduleEntry = {
        date: new Date(date),
        slots: slots.map(time => ({ time, isAvailable: true }))
      };

      doctor.schedule.push(scheduleEntry);
      await doctor.save();

      res.status(200).json({
        success: true,
        message: 'Schedule added successfully',
        data: doctor
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete doctor
   * DELETE /api/doctors/:id
   */
  async deleteDoctor(req, res) {
    try {
      const doctor = await Doctor.findByIdAndDelete(req.params.id);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Doctor deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new DoctorController();
