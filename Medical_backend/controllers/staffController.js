const Staff = require('../models/Staff');
const User = require('../models/User');

// Create Staff and linked User (password = NIC)
exports.createStaff = async (req, res) => {
  try {
    const { firstName, lastName, email, nic, phone, department, position } = req.body;

    if (!firstName || !lastName || !email || !nic || !phone || !department || !position) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const existingStaff = await Staff.findOne({ $or: [{ email: email.toLowerCase() }, { nic }] });
    if (existingStaff) {
      return res.status(409).json({ success: false, message: 'Staff with same email or NIC already exists' });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password: nic,
      role: 'staff',
      isVerified: true,
    });

    const staff = await Staff.create({
      firstName, lastName, email: email.toLowerCase(), nic, phone, department, position, userId: user._id,
    });

    return res.status(201).json({ success: true, data: staff });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create staff', error: err.message });
  }
};

// Get all staff
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: staff });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch staff', error: err.message });
  }
};

// Get single staff
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    return res.json({ success: true, data: staff });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch staff', error: err.message });
  }
};

// Update staff (and sync user email/password if email/NIC changed)
exports.updateStaff = async (req, res) => {
  try {
    const { firstName, lastName, email, nic, phone, department, position, isActive } = req.body;
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    // Email uniqueness check if changed
    if (email && email.toLowerCase() !== staff.email) {
      const emailExists = await Staff.findOne({ email: email.toLowerCase() });
      if (emailExists) return res.status(409).json({ success: false, message: 'Email already in use' });
    }
    // NIC uniqueness check if changed
    if (nic && nic !== staff.nic) {
      const nicExists = await Staff.findOne({ nic });
      if (nicExists) return res.status(409).json({ success: false, message: 'NIC already in use' });
    }

    // Update staff
    staff.firstName = firstName ?? staff.firstName;
    staff.lastName = lastName ?? staff.lastName;
    staff.email = email ? email.toLowerCase() : staff.email;
    staff.nic = nic ?? staff.nic;
    staff.phone = phone ?? staff.phone;
    staff.department = department ?? staff.department;
    staff.position = position ?? staff.position;
    if (typeof isActive === 'boolean') {
      staff.isActive = isActive;
      staff.endDate = isActive ? null : (staff.endDate || new Date());
    }

    await staff.save();

    // Sync User
    if (staff.userId) {
      const user = await User.findById(staff.userId).select('+password');
      if (user) {
        if (email && email.toLowerCase() !== user.email) user.email = email.toLowerCase();
        if (nic && nic !== staff.nic) user.password = nic; // if NIC changed; note we already set staff.nic above
        await user.save();
      }
    }

    return res.json({ success: true, data: staff });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update staff', error: err.message });
  }
};

// Delete staff (and linked user)
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    if (staff.userId) {
      await User.findByIdAndDelete(staff.userId);
    }
    await staff.deleteOne();

    return res.json({ success: true, message: 'Staff deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete staff', error: err.message });
  }
};
