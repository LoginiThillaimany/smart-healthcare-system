/**
 * Smart Healthcare System - Backend Server
 * SE3070 Assignment 02 - Improved System Implementation
 * 
 * Architecture: MVC Pattern with Repository/Service Layer
 * Framework: Node.js + Express.js
 * Database: MongoDB with Mongoose ODM
 * 
 * Design Patterns:
 * - MVC (Model-View-Controller)
 * - Repository Pattern (Service Layer)
 * - Singleton (Services)
 * - Factory (Models)
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Enable CORS for cross-origin requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('\n✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}\n`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// ============================================
// ROUTES CONFIGURATION
// ============================================

// Import route modules
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏥 Smart Healthcare System API',
    version: '2.0.0',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      appointments: '/api/appointments',
      patients: '/api/patients',
      doctors: '/api/doctors',
      payments: '/api/payments',
      reports: '/api/reports'
    }
  });
});

// API Routes - Four Major Use Cases
app.use('/api/auth', authRoutes);                 // Authentication & Authorization
app.use('/api/appointments', appointmentRoutes);  // Use Case 1: Appointment Scheduling & Management
app.use('/api/patients', patientRoutes);          // Use Case 2: Patient Account & Medical Record Management
app.use('/api/doctors', doctorRoutes);            // Supporting routes for doctors
app.use('/api/payments', paymentRoutes);          // Use Case 3: Payment & Billing Management
app.use('/api/reports', reportRoutes);            // Use Case 4: Data Analysis & Reporting

// Seed data endpoint (for testing/demo purposes)
app.post('/api/seed', async (req, res) => {
  try {
    const Doctor = require('./models/Doctor');
    const Patient = require('./models/Patient');
    
    // Clear existing data
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    
    // Create sample doctors
    const doctors = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@hospital.com',
        phone: '+94771234567',
        specialty: 'Cardiology',
        licenseNumber: 'LIC001',
        consultationFee: 5000,
        experienceYears: 15,
        department: 'Cardiology',
        schedule: [
          {
            date: new Date('2025-10-20'),
            slots: [
              { time: '09:00', isAvailable: true },
              { time: '10:00', isAvailable: true },
              { time: '11:00', isAvailable: true },
              { time: '14:00', isAvailable: true },
              { time: '15:00', isAvailable: true }
            ]
          },
          {
            date: new Date('2025-10-21'),
            slots: [
              { time: '09:00', isAvailable: true },
              { time: '10:00', isAvailable: true },
              { time: '14:00', isAvailable: true }
            ]
          }
        ]
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        phone: '+94771234568',
        specialty: 'General',
        licenseNumber: 'LIC002',
        consultationFee: 3000,
        experienceYears: 10,
        department: 'General Medicine',
        schedule: [
          {
            date: new Date('2025-10-20'),
            slots: [
              { time: '08:00', isAvailable: true },
              { time: '09:00', isAvailable: true },
              { time: '10:00', isAvailable: true },
              { time: '13:00', isAvailable: true },
              { time: '14:00', isAvailable: true }
            ]
          }
        ]
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@hospital.com',
        phone: '+94771234569',
        specialty: 'Pediatrics',
        licenseNumber: 'LIC003',
        consultationFee: 4000,
        experienceYears: 12,
        department: 'Pediatrics',
        schedule: [
          {
            date: new Date('2025-10-20'),
            slots: [
              { time: '10:00', isAvailable: true },
              { time: '11:00', isAvailable: true },
              { time: '15:00', isAvailable: true },
              { time: '16:00', isAvailable: true }
            ]
          }
        ]
      }
    ];
    
    // Create sample patients
    const patients = [
      {
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@email.com',
        phone: '+94771234570',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'Female',
        bloodType: 'O+',
        address: {
          street: '123 Main St',
          city: 'Colombo',
          state: 'Western',
          zipCode: '00100',
          country: 'Sri Lanka'
        }
      },
      {
        firstName: 'Robert',
        lastName: 'Davis',
        email: 'robert.davis@email.com',
        phone: '+94771234571',
        dateOfBirth: new Date('1985-08-20'),
        gender: 'Male',
        bloodType: 'A+',
        address: {
          street: '456 Oak Ave',
          city: 'Kandy',
          state: 'Central',
          zipCode: '20000',
          country: 'Sri Lanka'
        }
      }
    ];
    
    const createdDoctors = await Doctor.insertMany(doctors);
    const createdPatients = await Patient.insertMany(patients);
    
    res.status(200).json({
      success: true,
      message: 'Sample data seeded successfully',
      data: {
        doctors: createdDoctors.length,
        patients: createdPatients.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding data',
      error: error.message
    });
  }
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🏥 Smart Healthcare System - Backend Server');
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
