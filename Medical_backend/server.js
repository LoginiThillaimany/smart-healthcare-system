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
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5177',
    'http://localhost:5173', // Vite default
    'http://localhost:3000'  // React default
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Enhanced MongoDB connection with better error handling
const connectDB = async () => {
  try {
    // Connection options for MongoDB Atlas (Mongoose 7+ compatible)
    const options = {
      // Core connection options
      serverSelectionTimeoutMS: 10000, // 10 seconds to find a server
      socketTimeoutMS: 45000, // 45 seconds of inactivity before closing socket
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      bufferCommands: false // Disable mongoose buffering
    };

    // Try primary MongoDB URI first, then fallback
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('No MongoDB URI found in environment variables. Please check MONGODB_URI or MONGO_URI in .env file');
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`📍 URI: ${mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials
    
    const conn = await mongoose.connect(mongoURI, options);

    console.log('\n✅ MongoDB connected successfully');
    console.log(`📊 Database: ${conn.connection.name || 'default'}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    console.log(`📡 Port: ${conn.connection.port}`);
    console.log(`🏷️  Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`🌍 MongoDB Version: ${conn.connection.db.serverConfig?.s?.serverDescription?.version || 'Unknown'}\n`);

  } catch (error) {
    console.error('\n❌ MongoDB connection failed:', error.message);
    
    // Provide specific error guidance
    if (error.message.includes('authentication failed')) {
      console.error('💡 Authentication Error Solutions:');
      console.error('   - Verify username and password in MongoDB URI');
      console.error('   - Check if database user exists in MongoDB Atlas');
      console.error('   - Ensure user has proper read/write permissions');
      console.error('   - Verify the database name in the URI matches your Atlas setup');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('💡 DNS Resolution Error Solutions:');
      console.error('   - Check your MongoDB Atlas cluster URL');
      console.error('   - Verify your cluster is running and not paused');
      console.error('   - Check your internet connection');
      console.error('   - Try using a different DNS server (8.8.8.8)');
    } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.error('💡 Connection Timeout Solutions:');
      console.error('   - Verify IP whitelist includes 0.0.0.0/0 or your current IP');
      console.error('   - Check your firewall settings');
      console.error('   - Try connecting from a different network');
      console.error('   - Verify MongoDB Atlas cluster is in the correct region');
    } else if (error.message.includes('SSL') || error.message.includes('handshake')) {
      console.error('💡 SSL/TLS Handshake Error Solutions:');
      console.error('   - Add ssl=true to your MongoDB URI');
      console.error('   - Update your Node.js version');
      console.error('   - Check if your network blocks SSL connections');
    } else if (error.message.includes('No MongoDB URI found')) {
      console.error('💡 Environment Variable Solutions:');
      console.error('   - Create a .env file in your project root');
      console.error('   - Add MONGODB_URI=your_atlas_connection_string');
      console.error('   - Restart your server after adding the .env file');
    }
    
    console.error('\n🔧 Quick Debug Steps:');
    console.error('   1. Run: node test-mongodb-connection.js');
    console.error('   2. Check MongoDB Atlas dashboard for cluster status');
    console.error('   3. Verify network access settings in Atlas');
    console.error('   4. Test connection from MongoDB Compass\n');
    
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Enhanced MongoDB connection event handlers for production
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err.message);
  
  // Log critical errors for monitoring
  if (process.env.NODE_ENV === 'production') {
    // In production, you'd send this to your logging service
    console.error('CRITICAL: MongoDB connection error in production', {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
  }
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected. Connection will auto-retry...');
  
  if (process.env.NODE_ENV === 'production') {
    console.warn('WARNING: MongoDB disconnected in production', {
      timestamp: new Date().toISOString(),
      readyState: mongoose.connection.readyState
    });
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

mongoose.connection.on('connecting', () => {
  console.log('🔄 MongoDB connecting...');
});

mongoose.connection.on('connected', () => {
  console.log('🔗 MongoDB connected');
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error.message);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Gracefully shutting down...');
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error.message);
    process.exit(1);
  }
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
      // Versioned endpoints (recommended)
      'auth (v1)': '/api/v1/auth',
      'appointments (v1)': '/api/v1/appointments',
      'patients (v1)': '/api/v1/patients',
      'doctors (v1)': '/api/v1/doctors',
      'payments (v1)': '/api/v1/payments',
      'reports (v1)': '/api/v1/reports',
      // Legacy endpoints (backward compatibility)
      'auth (legacy)': '/api/auth',
      'appointments (legacy)': '/api/appointments',
      'patients (legacy)': '/api/patients',
      'doctors (legacy)': '/api/doctors',
      'payments (legacy)': '/api/payments',
      'reports (legacy)': '/api/reports'
    }
  });
});

// API Routes - Support both versioned and non-versioned endpoints
// Current version (v1) - Primary endpoints
app.use('/api/v1/auth', authRoutes);                 // Authentication & Authorization
app.use('/api/v1/appointments', appointmentRoutes);  // Use Case 1: Appointment Scheduling & Management
app.use('/api/v1/patients', patientRoutes);          // Use Case 2: Patient Account & Medical Record Management
app.use('/api/v1/doctors', doctorRoutes);            // Supporting routes for doctors
app.use('/api/v1/payments', paymentRoutes);          // Use Case 3: Payment & Billing Management
app.use('/api/v1/reports', reportRoutes);            // Use Case 4: Data Analysis & Reporting

// Backward compatibility - Non-versioned endpoints (redirect to v1)
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
