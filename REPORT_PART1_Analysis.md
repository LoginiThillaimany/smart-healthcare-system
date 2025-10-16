# SE3070 - Software Engineering
## Assignment 02: Smart Healthcare System - Part 1
### System Analysis & Requirements

---

## 🏗️ PART 1 – SYSTEM UNDERSTANDING

### 1.1 Problem Domain Summary

The **Smart Healthcare System** is a comprehensive digital platform designed to modernize healthcare delivery in Sri Lanka. It addresses critical inefficiencies in traditional healthcare systems including manual appointment scheduling, fragmented medical records, complex payment processes, and lack of analytical insights.

**Core Objectives:**
1. **Streamline Appointment Management** - Enable patients to book, modify, and track appointments with real-time availability
2. **Centralize Medical Records** - Provide digital health cards with comprehensive medical history accessible to authorized personnel
3. **Automate Payment Processing** - Support multiple payment methods with automated billing and invoicing
4. **Enable Data-Driven Decisions** - Generate reports and analytics for operational improvement

### 1.2 Functional Requirements

#### Use Case 1: Appointment Scheduling & Management
- FR1.1: Search doctors by specialty with real-time results
- FR1.2: View available time slots dynamically
- FR1.3: Book appointments with duplicate prevention
- FR1.4: Cancel/reschedule appointments with automatic slot release
- FR1.5: Send automated confirmation notifications
- FR1.6: Maintain complete appointment history
- FR1.7: Support multiple appointment types (Consultation, Follow-up, Emergency, Checkup)
- FR1.8: Track appointment status through workflow (Scheduled → Confirmed → In-Progress → Completed)

#### Use Case 2: Patient Account & Medical Record Management
- FR2.1: Register patients with comprehensive personal information
- FR2.2: Auto-generate unique digital health card numbers
- FR2.3: Store medical history with doctor references and timestamps
- FR2.4: Manage prescriptions linked to appointments
- FR2.5: Track chronic conditions, allergies, and blood type
- FR2.6: Store emergency contact information
- FR2.7: Calculate patient age automatically
- FR2.8: Support patient search by name, email, or health card number

#### Use Case 3: Payment & Billing Management
- FR3.1: Calculate fees (consultation + service fee + tax - discount)
- FR3.2: Support multiple payment methods (Credit/Debit Card, Bank Transfer, Cash, Insurance, Digital Wallet)
- FR3.3: Generate unique transaction IDs and receipt numbers
- FR3.4: Process payments with status tracking (Pending → Processing → Completed/Failed)
- FR3.5: Handle full and partial refunds with authorization
- FR3.6: Generate detailed invoices with breakdown
- FR3.7: Link payments to appointments
- FR3.8: Maintain payment history per patient

#### Use Case 4: Data Analysis & Reporting
- FR4.1: Generate appointment summary reports with statistics
- FR4.2: Generate revenue reports by date range
- FR4.3: Provide dashboard with key metrics (appointments, patients, revenue)
- FR4.4: Track patient demographics (gender, blood type, age distribution)
- FR4.5: Analyze appointment trends over time
- FR4.6: Support custom date range filtering
- FR4.7: Export reports in multiple formats
- FR4.8: Automatic report expiration after 30 days

### 1.3 Non-Functional Requirements

#### NFR1: Performance
- Response time < 2 seconds for 95% of requests
- Support 1000+ concurrent users
- Database query optimization with strategic indexing
- Real-time updates for slot availability

#### NFR2: Security
- Encrypt sensitive data at rest and in transit
- Role-based access control (Patient, Doctor, Admin)
- Complete audit trail for all operations
- PCI DSS compliance for payment data
- Input validation to prevent injection attacks

#### NFR3: Reliability
- 99.9% system uptime
- Automated daily backups
- Transaction rollback on failures
- Graceful error handling with user-friendly messages

#### NFR4: Usability
- Intuitive interface requiring no training
- Responsive design for mobile/tablet/desktop
- Clear error messages with actionable guidance
- Visual feedback for all user actions
- WCAG 2.1 Level AA accessibility compliance

#### NFR5: Maintainability
- SOLID principles adherence
- MVC architecture with service layer
- Comprehensive code documentation
- ≥80% unit test coverage
- RESTful API design

---

## 🎯 PART 2 – REQUIREMENTS IDENTIFICATION

### 2.1 Four Major Business Use Cases

| Use Case | Description | Key Features |
|----------|-------------|--------------|
| **1. Appointment Scheduling & Management** | Patients book, modify, and track appointments with doctors | Real-time availability, slot management, notifications, history |
| **2. Patient Account & Medical Record Management** | Manage patient profiles and comprehensive medical records | Digital health card, medical history, prescriptions, demographics |
| **3. Payment & Billing Management** | Process payments and generate invoices | Multiple payment methods, refunds, receipt generation, payment history |
| **4. Data Analysis & Reporting** | Generate insights and reports for decision-making | Appointment summaries, revenue reports, dashboard analytics, trends |

### 2.2 Actors and Responsibilities

#### Patient
- Register and manage account
- Search and book appointments
- View medical records and history
- Make payments
- Cancel/reschedule appointments

#### Doctor
- Manage availability schedule
- View appointment list
- Update patient medical records
- Add prescriptions
- View patient information

#### Administrator
- Generate system reports
- View dashboard analytics
- Manage users (patients, doctors)
- Process refunds
- Monitor system health

#### System
- Send notifications
- Generate unique IDs (health card, transaction, receipt)
- Log all activities
- Calculate fees
- Enforce business rules

---

## 📊 PART 3 – DESIGN CRITIQUE

### 3.1 Original Design Problems & Solutions

#### Problem 1: Monolithic Code Structure
**Original:** All logic in route handlers, no separation of concerns

**Issues:**
- Difficult to test individual components
- Code duplication across routes
- Hard to maintain and extend
- Violates Single Responsibility Principle

**Solution:** Implemented MVC + Service Layer
- **Models:** Data structure and validation (Mongoose schemas)
- **Services:** Business logic (appointmentService, patientService, etc.)
- **Controllers:** HTTP request/response handling
- **Routes:** API endpoint mapping

**Benefit:** Clear separation, easier testing, better maintainability

#### Problem 2: Inadequate Data Validation
**Original:** Minimal validation, no type checking

**Issues:**
- Invalid data could persist in database
- Security vulnerabilities
- Data integrity problems

**Solution:** Comprehensive Mongoose Validation
```javascript
firstName: {
  type: String,
  required: [true, 'First name is required'],
  trim: true,
  minlength: [2, 'First name must be at least 2 characters']
}
```

**Benefit:** Data integrity, early error detection, security

#### Problem 3: No Audit Trail
**Original:** No tracking of system activities

**Issues:**
- Can't trace who did what
- Security compliance problems
- Debugging difficulties

**Solution:** Comprehensive AuditLog Model
- Logs all CRUD operations
- Tracks user information and IP
- Records before/after states
- Severity levels for filtering

**Benefit:** Security compliance, accountability, debugging

#### Problem 4: Inefficient Slot Management
**Original:** Simple slot removal, no availability tracking

**Issues:**
- Slots couldn't be reused after cancellation
- No way to track slot status
- Poor resource utilization

**Solution:** Enhanced Slot System
```javascript
slots: [{
  time: String,
  isAvailable: { type: Boolean, default: true }
}]
```
- Boolean flag for availability
- Automatic release on cancellation
- Methods for booking/releasing slots

**Benefit:** Better resource management, user experience

#### Problem 5: No Double Booking Prevention
**Original:** No mechanism to prevent conflicts

**Issues:**
- Multiple appointments could book same slot
- Data conflicts
- User frustration

**Solution:** Compound Unique Index
```javascript
appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'Cancelled' } } }
);
```

**Benefit:** Database-level prevention of conflicts

#### Problem 6: Limited Use Case Coverage
**Original:** Only basic appointment booking

**Issues:**
- Incomplete system functionality
- Can't meet all business needs
- Limited value to stakeholders

**Solution:** Four Complete Use Cases
1. Full appointment management with CRUD
2. Complete patient and medical record system
3. Comprehensive payment and billing
4. Robust reporting and analytics

**Benefit:** Complete system meeting all requirements

### 3.2 HCI Principles Applied

| Principle | Implementation | Benefit |
|-----------|---------------|---------|
| **Visibility** | Clear status indicators, real-time feedback | Users know system state |
| **Feedback** | Success/error messages, loading states | Confirms actions |
| **Consistency** | Uniform API responses, standard patterns | Predictable behavior |
| **Error Prevention** | Validation, confirmations, disabled states | Reduces mistakes |
| **Recognition vs Recall** | Dropdowns, auto-fill, recent items | Easier to use |
| **Flexibility** | Multiple filters, search options | Accommodates users |

---

This concludes Part 1 of the report. See REPORT_PART2_Design.md for UML diagrams and architecture details.
