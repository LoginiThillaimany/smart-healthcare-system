/*
  Dev seed script to create an admin user and a doctor user if they don't exist.
  Usage:
    NODE_ENV=development node scripts/seed-admin-doctor.js
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

dotenv.config();

async function connect() {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_system';
  await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 5,
    family: 4,
  });
  console.log('✅ Connected to MongoDB');
}

async function ensureUser({ email, password, role, profile }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`ℹ️  User already exists: ${email} (${existing.role})`);
    return existing;
  }
  const user = await User.create({ email: email.toLowerCase(), password, role, isVerified: true });
  console.log(`✅ Created ${role} user: ${email}`);

  if (role === 'doctor') {
    // Create a minimal Doctor profile with required fields
    const existsDoctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (!existsDoctor) {
      await Doctor.create({
        firstName: profile?.firstName || 'John',
        lastName: profile?.lastName || 'Doe',
        email: email.toLowerCase(),
        phone: profile?.phone || '+10000000000',
        specialty: profile?.specialty || 'General',
        licenseNumber: profile?.licenseNumber || `LIC-${Date.now()}`,
        experienceYears: profile?.experienceYears ?? 5,
        department: profile?.department || 'General Medicine',
        consultationFee: profile?.consultationFee ?? 2000,
        schedule: [],
      });
      console.log(`✅ Created Doctor profile for ${email}`);
    } else {
      console.log(`ℹ️  Doctor profile already exists for ${email}`);
    }
  }

  return user;
}

async function run() {
  try {
    await connect();

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const adminPass = process.env.SEED_ADMIN_PASSWORD || 'Password123!';

    const doctorEmail = process.env.SEED_DOCTOR_EMAIL || 'doctor@example.com';
    const doctorPass = process.env.SEED_DOCTOR_PASSWORD || 'Password123!';

    await ensureUser({ email: adminEmail, password: adminPass, role: 'admin' });
    await ensureUser({
      email: doctorEmail,
      password: doctorPass,
      role: 'doctor',
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+94770000000',
        specialty: 'General',
        licenseNumber: 'LIC-DEV-0001',
        experienceYears: 8,
        department: 'General Medicine',
        consultationFee: 2500,
      },
    });

    console.log('\n🎉 Seeding complete. You can login with:');
    console.log(`- Admin:  ${adminEmail} / ${adminPass}`);
    console.log(`- Doctor: ${doctorEmail} / ${doctorPass}`);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
