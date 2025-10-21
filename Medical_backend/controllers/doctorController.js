const Doctor = require('../models/Doctor');
const User = require('../models/User');

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

      // Normalize values
      const email = String(doctorData.email).toLowerCase().trim();
      const licenseNumber = String(doctorData.licenseNumber).trim();

      // Basic validations
      const phone = String(doctorData.phone).trim();
      const phoneOk = /^(\+94|0)\d{9}$/.test(phone);
      if (!phoneOk) {
        return res.status(400).json({ success: false, message: 'Invalid phone format. Use +94XXXXXXXXX or 0XXXXXXXXX' });
      }

      // Uniqueness checks
      const emailExistsInUsers = await User.findOne({ email });
      const emailExistsInDoctors = await Doctor.findOne({ email });
      if (emailExistsInUsers || emailExistsInDoctors) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
      const licenseExists = await Doctor.findOne({ licenseNumber });
      if (licenseExists) {
        return res.status(409).json({ success: false, message: 'License number already in use' });
      }

      // Create linked user with role 'doctor'. Password = licenseNumber
      const user = await User.create({
        email,
        password: licenseNumber,
        role: 'doctor',
        isVerified: true,
      });

      const doctor = new Doctor({
        ...doctorData,
        email,
        phone,
        licenseNumber,
        userId: user._id,
      });
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
      const existing = await Doctor.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }

      const updates = { ...req.body };
      let emailChanged = false;
      let licenseChanged = false;

      if (updates.email && updates.email.toLowerCase().trim() !== existing.email) {
        const newEmail = updates.email.toLowerCase().trim();
        const emailInUse = await Doctor.findOne({ email: newEmail });
        const emailInUsers = await User.findOne({ email: newEmail });
        if ((emailInUse && String(emailInUse._id) !== String(existing._id)) || emailInUsers) {
          return res.status(409).json({ success: false, message: 'Email already in use' });
        }
        updates.email = newEmail;
        emailChanged = true;
      }

      if (updates.phone) {
        const phoneOk = /^(\+94|0)\d{9}$/.test(String(updates.phone).trim());
        if (!phoneOk) return res.status(400).json({ success: false, message: 'Invalid phone format' });
      }

      if (updates.licenseNumber && updates.licenseNumber.trim() !== existing.licenseNumber) {
        const lic = updates.licenseNumber.trim();
        const licInUse = await Doctor.findOne({ licenseNumber: lic });
        if (licInUse && String(licInUse._id) !== String(existing._id)) {
          return res.status(409).json({ success: false, message: 'License number already in use' });
        }
        updates.licenseNumber = lic;
        licenseChanged = true;
      }

      const doctor = await Doctor.findByIdAndUpdate(existing._id, updates, { new: true, runValidators: true });

      // Sync linked user
      if (doctor.userId) {
        const user = await User.findById(doctor.userId).select('+password');
        if (user) {
          if (emailChanged) user.email = doctor.email;
          if (licenseChanged && updates.licenseNumber) user.password = updates.licenseNumber;
          await user.save();
        }
      }

      res.status(200).json({ success: true, message: 'Doctor updated successfully', data: doctor });
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
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }

      if (doctor.userId) {
        await User.findByIdAndDelete(doctor.userId);
      }
      await doctor.deleteOne();

      res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new DoctorController();
