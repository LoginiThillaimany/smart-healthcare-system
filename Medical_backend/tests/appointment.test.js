/**
 * Appointment Service Unit Tests
 * Tests for Appointment Scheduling & Management Use Case
 * Target: ≥80% code coverage
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const appointmentService = require('../services/appointmentService');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

let mongoServer;

// Setup: Connect to in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Cleanup: Clear database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Teardown: Close connection and stop server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Appointment Service - Create Appointment', () => {
  let testPatient;
  let testDoctor;

  beforeEach(async () => {
    // Create test patient
    testPatient = await Patient.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '+94771234567',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male'
    });

    // Create test doctor with schedule
    testDoctor = await Doctor.create({
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@hospital.com',
      phone: '+94771234568',
      specialty: 'Cardiology',
      licenseNumber: 'LIC001',
      consultationFee: 5000,
      schedule: [
        {
          date: new Date('2025-12-01'),
          slots: [
            { time: '09:00', isAvailable: true },
            { time: '10:00', isAvailable: true }
          ]
        }
      ]
    });
  });

  test('should create appointment successfully with valid data', async () => {
    const appointmentData = {
      patient: testPatient._id,
      doctor: testDoctor._id,
      appointmentDate: new Date('2025-12-01'),
      timeSlot: '09:00',
      reason: 'Regular checkup for heart condition',
      appointmentType: 'Consultation'
    };

    const appointment = await appointmentService.createAppointment(appointmentData);

    expect(appointment).toBeDefined();
    expect(appointment.patient._id.toString()).toBe(testPatient._id.toString());
    expect(appointment.doctor._id.toString()).toBe(testDoctor._id.toString());
    expect(appointment.status).toBe('Scheduled');
    expect(appointment.timeSlot).toBe('09:00');
  });

  test('should throw error when patient not found', async () => {
    const appointmentData = {
      patient: new mongoose.Types.ObjectId(),
      doctor: testDoctor._id,
      appointmentDate: new Date('2025-12-01'),
      timeSlot: '09:00',
      reason: 'Regular checkup'
    };

    await expect(appointmentService.createAppointment(appointmentData))
      .rejects.toThrow('Patient not found');
  });

  test('should throw error when doctor not found', async () => {
    const appointmentData = {
      patient: testPatient._id,
      doctor: new mongoose.Types.ObjectId(),
      appointmentDate: new Date('2025-12-01'),
      timeSlot: '09:00',
      reason: 'Regular checkup'
    };

    await expect(appointmentService.createAppointment(appointmentData))
      .rejects.toThrow('Doctor not found');
  });

  test('should throw error when time slot not available', async () => {
    const appointmentData = {
      patient: testPatient._id,
      doctor: testDoctor._id,
      appointmentDate: new Date('2025-12-01'),
      timeSlot: '15:00', // Non-existent slot
      reason: 'Regular checkup for heart condition'
    };

    await expect(appointmentService.createAppointment(appointmentData))
      .rejects.toThrow();
  });

  test('should prevent double booking of same slot', async () => {
    const appointmentData = {
      patient: testPatient._id,
      doctor: testDoctor._id,
      appointmentDate: new Date('2025-12-01'),
      timeSlot: '09:00',
      reason: 'Regular checkup for heart condition'
    };

    // First appointment should succeed
    await appointmentService.createAppointment(appointmentData);

    // Second appointment with same slot should fail
    const secondPatient = await Patient.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@test.com',
      phone: '+94771234569',
      dateOfBirth: new Date('1992-01-01'),
      gender: 'Female'
    });

    const secondAppointmentData = {
      ...appointmentData,
      patient: secondPatient._id
    };

    await expect(appointmentService.createAppointment(secondAppointmentData))
      .rejects.toThrow();
  });
});

describe('Appointment Service - Get Appointments', () => {
  let testPatient;
  let testDoctor;
  let testAppointment;

  beforeEach(async () => {
    testPatient = await Patient.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '+94771234567',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male'
    });

    testDoctor = await Doctor.create({
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@hospital.com',
      phone: '+94771234568',
      specialty: 'Cardiology',
      licenseNumber: 'LIC001',
      consultationFee: 5000,
      schedule: [
        {
          date: new Date('2025-12-01'),
          slots: [{ time: '09:00', isAvailable: true }]
        }
      ]
    });

    testAppointment = await Appointment.create({
      patient: testPatient._id,
      doctor: testDoctor._id,
      appointmentDate: new Date('2025-12-01'),
      timeSlot: '09:00',
      reason: 'Regular checkup for heart condition',
      status: 'Scheduled'
    });
  });

  test('should get all appointments', async () => {
    const appointments = await appointmentService.getAllAppointments();
    expect(appointments).toHaveLength(1);
    expect(appointments[0]._id.toString()).toBe(testAppointment._id.toString());
  });

  test('should get appointment by ID', async () => {
    const appointment = await appointmentService.getAppointmentById(testAppointment._id);
    expect(appointment).toBeDefined();
    expect(appointment._id.toString()).toBe(testAppointment._id.toString());
  });

  test('should throw error when appointment not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(appointmentService.getAppointmentById(fakeId))
      .rejects.toThrow('Appointment not found');
  });

  test('should filter appointments by patient', async () => {
    const appointments = await appointmentService.getAllAppointments({
      patient: testPatient._id
    });
    expect(appointments).toHaveLength(1);
  });

  test('should filter appointments by status', async () => {
    const appointments = await appointmentService.getAllAppointments({
      status: 'Scheduled'
    });
    expect(appointments).toHaveLength(1);
  });
});

describe('Appointment Service - Update Appointment', () => {
  let testPatient, testDoctor, testAppointment;

  beforeEach(async () => {
    testPatient = await Patient.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '+94771234567',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male'
    });

    testDoctor = await Doctor.create({
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@hospital.com',
      phone: '+94771234568',
      specialty: 'Cardiology',
      licenseNumber: 'LIC001',
      consultationFee: 5000,
      schedule: [
        {
          date: new Date('2025-12-01'),
          slots: [{ time: '09:00', isAvailable: false }]
        }
      ]
    });

    testAppointment = await Appointment.create({
      patient: testPatient._id,
      doctor: testDoctor._id,
      appointmentDate: new Date('2025-12-01'),
      timeSlot: '09:00',
      reason: 'Regular checkup for heart condition',
      status: 'Scheduled'
    });
  });

  test('should update appointment status', async () => {
    const updated = await appointmentService.updateAppointment(
      testAppointment._id,
      { status: 'Confirmed' }
    );

    expect(updated.status).toBe('Confirmed');
  });

  test('should update appointment notes', async () => {
    const updated = await appointmentService.updateAppointment(
      testAppointment._id,
      { notes: 'Patient arrived on time' }
    );

    expect(updated.notes).toBe('Patient arrived on time');
  });
});

describe('Appointment Service - Cancel Appointment', () => {
  let testPatient, testDoctor, testAppointment;

  beforeEach(async () => {
    testPatient = await Patient.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '+94771234567',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male'
    });

    testDoctor = await Doctor.create({
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@hospital.com',
      phone: '+94771234568',
      specialty: 'Cardiology',
      licenseNumber: 'LIC001',
      consultationFee: 5000,
      schedule: [
        {
          date: new Date('2025-12-01'),
          slots: [{ time: '09:00', isAvailable: false }]
        }
      ]
    });

    testAppointment = await Appointment.create({
      patient: testPatient._id,
      doctor: testDoctor._id,
      appointmentDate: new Date('2025-12-01'),
      timeSlot: '09:00',
      reason: 'Regular checkup for heart condition',
      status: 'Scheduled'
    });
  });

  test('should cancel appointment successfully', async () => {
    const cancelled = await appointmentService.cancelAppointment(
      testAppointment._id,
      'Patient is unavailable',
      'Patient'
    );

    expect(cancelled.status).toBe('Cancelled');
    expect(cancelled.cancellationReason).toBe('Patient is unavailable');
    expect(cancelled.cancelledBy).toBe('Patient');
  });

  test('should throw error when cancelling non-existent appointment', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(appointmentService.cancelAppointment(fakeId, 'Reason', 'Patient'))
      .rejects.toThrow('Appointment not found');
  });

  test('should throw error when cancelling already cancelled appointment', async () => {
    await appointmentService.cancelAppointment(
      testAppointment._id,
      'First cancellation',
      'Patient'
    );

    await expect(
      appointmentService.cancelAppointment(testAppointment._id, 'Second cancellation', 'Patient')
    ).rejects.toThrow('already cancelled');
  });
});

describe('Appointment Service - Get Upcoming Appointments', () => {
  let testPatient, testDoctor;

  beforeEach(async () => {
    testPatient = await Patient.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '+94771234567',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male'
    });

    testDoctor = await Doctor.create({
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@hospital.com',
      phone: '+94771234568',
      specialty: 'Cardiology',
      licenseNumber: 'LIC001',
      consultationFee: 5000
    });
  });

  test('should return upcoming appointments only', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);

    // Create future appointment
    await Appointment.create({
      patient: testPatient._id,
      doctor: testDoctor._id,
      appointmentDate: futureDate,
      timeSlot: '09:00',
      reason: 'Future appointment for checkup',
      status: 'Scheduled'
    });

    // Create past appointment
    await Appointment.create({
      patient: testPatient._id,
      doctor: testDoctor._id,
      appointmentDate: pastDate,
      timeSlot: '10:00',
      reason: 'Past appointment for checkup',
      status: 'Completed'
    });

    const upcoming = await appointmentService.getUpcomingAppointments(testPatient._id);
    expect(upcoming).toHaveLength(1);
    expect(upcoming[0].status).toBe('Scheduled');
  });
});

// Test coverage summary
console.log('\n✅ Appointment Tests Complete');
console.log('Coverage Target: ≥80%');
console.log('Test Categories: Create, Read, Update, Cancel, Filter');