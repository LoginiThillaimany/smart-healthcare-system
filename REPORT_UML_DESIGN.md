# PART 2: UML DIAGRAMS & DESIGN IMPROVEMENTS
## Smart Healthcare System - Design Documentation

---

## 📐 5️⃣ DESIGN CRITIQUE & IMPROVEMENTS

### **5.1 Problems in Initial Conceptual Design**

Based on typical Assignment 01 designs, common issues include:

| Problem Area | Issue Description | Impact |
|-------------|-------------------|---------|
| **UML Relationships** | Missing inheritance between User → Patient/Doctor/Admin | Poor code reusability |
| **Multiplicity** | Incorrect 1:1 instead of 1:* for Patient-Appointment | Data model errors |
| **Attributes** | Missing critical fields (appointmentStatus, paymentMode) | Incomplete functionality |
| **Aggregation vs Composition** | Weak entity relationships not properly modeled | Database integrity issues |
| **Interaction Design** | No feedback mechanisms for user actions | Poor usability |
| **Error Handling** | No alternate flows for failures | System crashes |
| **Security** | No authentication/authorization design | Vulnerable system |

---

## 📊 6️⃣ IMPROVED UML DIAGRAMS (MERMAID)

### **6.1 Use-Case Diagram**

```mermaid
graph TB
    Patient((Patient))
    Doctor((Doctor))
    Admin((Admin))
    Manager((Healthcare<br/>Manager))
    PaymentGW[Payment<br/>Gateway]
    EmailSMS[Email/SMS<br/>Service]
    Insurance[Insurance<br/>Provider]

    %% Patient Use Cases
    Patient --> UC1[Register Account]
    Patient --> UC2[Login]
    Patient --> UC3[Book Appointment]
    Patient --> UC4[View Medical Records]
    Patient --> UC5[Make Payment]
    Patient --> UC6[Cancel Appointment]
    Patient --> UC7[View Digital Health Card]
    Patient --> UC8[Update Profile]

    %% Doctor Use Cases
    Doctor --> UC9[View Appointments]
    Doctor --> UC10[Access Patient Records]
    Doctor --> UC11[Add Prescription]
    Doctor --> UC12[Update Availability]
    Doctor --> UC13[View Performance Metrics]

    %% Admin Use Cases
    Admin --> UC14[Manage Doctors]
    Admin --> UC15[Verify Patients]
    Admin --> UC16[Scan Health Card]
    Admin --> UC17[Manual Payment Update]
    Admin --> UC18[Manage Hospital Config]

    %% Manager Use Cases
    Manager --> UC19[View Analytics Dashboard]
    Manager --> UC20[Generate Reports]
    Manager --> UC21[Export Data PDF/Excel]
    Manager --> UC22[Monitor System Performance]

    %% External System Interactions
    UC5 -.-> PaymentGW
    UC3 -.-> EmailSMS
    UC5 -.-> Insurance
    UC1 -.-> EmailSMS
    UC6 -.-> EmailSMS

    %% Includes relationships
    UC3 -->|includes| UC23[Check Slot Availability]
    UC3 -->|includes| UC24[Send Confirmation]
    UC5 -->|includes| UC25[Generate Receipt]
    UC20 -->|includes| UC26[Query Database]

    %% Extends relationships
    UC3 -.->|extends| UC27[Reschedule Appointment]
    UC5 -.->|extends| UC28[Process Refund]

    style Patient fill:#4a90e2
    style Doctor fill:#50c878
    style Admin fill:#ff6b6b
    style Manager fill:#ffd93d
    style PaymentGW fill:#e0e0e0
    style EmailSMS fill:#e0e0e0
    style Insurance fill:#e0e0e0
```

---

### **6.2 Class Diagram**

```mermaid
classDiagram
    %% Base Classes
    class User {
        <<abstract>>
        -String userId
        -String email
        -String passwordHash
        -String role
        -Date createdAt
        -Date lastLogin
        +login()
        +logout()
        +resetPassword()
        +updateProfile()
    }

    class Patient {
        -String patientId
        -String fullName
        -Date dateOfBirth
        -String gender
        -String phone
        -Address address
        -String bloodGroup
        -String[] allergies
        -String emergencyContact
        -String healthCardNumber
        +bookAppointment()
        +viewMedicalRecords()
        +makePayment()
        +generateQRCode()
    }

    class Doctor {
        -String doctorId
        -String firstName
        -String lastName
        -String specialty
        -String qualification
        -Number experience
        -String[] availableDays
        -String hospitalAffiliation
        -Number consultationFee
        -Number rating
        +viewSchedule()
        +updateAvailability()
        +accessPatientRecords()
        +addPrescription()
    }

    class Admin {
        -String adminId
        -String name
        -String department
        -String[] permissions
        +manageDoctors()
        +verifyPatients()
        +updateSystemConfig()
        +generateAuditLogs()
    }

    class Manager {
        -String managerId
        -String name
        -String department
        +viewAnalytics()
        +generateReports()
        +exportData()
        +monitorKPIs()
    }

    %% Core Domain Classes
    class Appointment {
        -String appointmentId
        -Date appointmentDate
        -String timeSlot
        -String status
        -String reason
        -String notes
        -Date createdAt
        -Date updatedAt
        +confirm()
        +cancel()
        +reschedule()
        +complete()
    }

    class MedicalRecord {
        -String recordId
        -Date visitDate
        -String diagnosis
        -String treatment
        -String[] symptoms
        -String doctorNotes
        -String[] attachments
        +addRecord()
        +updateRecord()
        +viewHistory()
    }

    class Prescription {
        -String prescriptionId
        -String medication
        -String dosage
        -String frequency
        -Number duration
        -Date prescribedDate
        -Date expiryDate
        -String instructions
        +generate()
        +renew()
        +validate()
    }

    class Payment {
        -String paymentId
        -Number amount
        -String paymentMethod
        -String paymentStatus
        -String transactionId
        -Date paymentDate
        -String receiptUrl
        -Number tax
        -Number discount
        +processPayment()
        +generateReceipt()
        +refund()
        +verifyInsurance()
    }

    class Report {
        -String reportId
        -String reportType
        -Date generatedDate
        -String dateRange
        -Object data
        -String format
        -String generatedBy
        +generate()
        +export()
        +schedule()
    }

    class DigitalHealthCard {
        -String cardId
        -String qrCode
        -Date issueDate
        -Date expiryDate
        -String status
        +generate()
        +validate()
        +renew()
    }

    class TimeSlot {
        -String slotId
        -String startTime
        -String endTime
        -Boolean isAvailable
        -Number capacity
        +book()
        +release()
        +checkAvailability()
    }

    class Address {
        -String street
        -String city
        -String state
        -String postalCode
        -String country
    }

    class AuditLog {
        -String logId
        -String action
        -String userId
        -Date timestamp
        -String ipAddress
        -Object metadata
        +log()
        +query()
    }

    %% Inheritance
    User <|-- Patient
    User <|-- Doctor
    User <|-- Admin
    User <|-- Manager

    %% Associations
    Patient "1" -- "0..*" Appointment : books
    Doctor "1" -- "0..*" Appointment : attends
    Patient "1" -- "1" DigitalHealthCard : has
    Patient "1" -- "0..*" MedicalRecord : owns
    Patient "1" -- "0..*" Payment : makes
    Doctor "1" -- "0..*" Prescription : prescribes
    Patient "1" -- "0..*" Prescription : receives
    Appointment "1" -- "1" Payment : requires
    Doctor "1" -- "0..*" TimeSlot : manages
    Appointment "1" -- "1" TimeSlot : occupies
    MedicalRecord "1" -- "0..*" Prescription : contains
    Manager "1" -- "0..*" Report : generates
    Patient "1" *-- "1" Address : contains

    %% Dependencies
    Payment ..> AuditLog : logs
    Appointment ..> AuditLog : logs
    MedicalRecord ..> AuditLog : logs
```

---

### **6.3 Sequence Diagrams**

#### **Sequence Diagram 1: Appointment Booking**

```mermaid
sequenceDiagram
    actor Patient
    participant UI as React Frontend
    participant API as Express Backend
    participant Auth as Auth Middleware
    participant DB as MongoDB
    participant Email as Email Service

    Patient->>UI: Click "Book Appointment"
    UI->>Patient: Show specialty selection
    Patient->>UI: Select "Cardiology"
    
    UI->>API: GET /api/doctors?specialty=Cardiology
    API->>Auth: Verify JWT Token
    Auth-->>API: Token Valid
    API->>DB: Query doctors by specialty
    DB-->>API: Return doctor list
    API-->>UI: Send doctor data
    UI->>Patient: Display doctor cards
    
    Patient->>UI: Select Dr. John Smith
    UI->>API: GET /api/slots?doctorId=123&date=2025-10-20
    API->>DB: Query available slots
    DB-->>API: Return time slots
    API-->>UI: Send available slots
    UI->>Patient: Show calendar with slots
    
    Patient->>UI: Select 10:00 AM slot
    Patient->>UI: Confirm booking
    
    UI->>API: POST /api/appointments
    Note over UI,API: {patientId, doctorId, date, timeSlot}
    API->>Auth: Verify Token
    Auth-->>API: Authorized
    
    API->>DB: Check slot still available
    alt Slot Available
        DB-->>API: Slot Available
        API->>DB: Create appointment record
        API->>DB: Update slot status
        DB-->>API: Appointment created
        
        API->>Email: Send confirmation email
        Email-->>API: Email sent
        
        API-->>UI: Success {appointmentId, status}
        UI->>Patient: Show success message
        UI->>Patient: Display confirmation details
    else Slot Already Booked
        DB-->>API: Slot Not Available
        API-->>UI: Error: Slot unavailable
        UI->>Patient: Show error & refresh slots
    end
```

---

#### **Sequence Diagram 2: Medical Record Access**

```mermaid
sequenceDiagram
    actor Staff as Hospital Staff
    participant Scanner as QR Scanner
    participant UI as Web App
    participant API as Backend API
    participant Auth as Auth Service
    participant DB as MongoDB
    participant Audit as Audit Logger

    Staff->>Scanner: Scan patient QR code
    Scanner->>UI: Send patient ID
    
    UI->>API: GET /api/patients/:id/records
    Note over UI,API: Include staff JWT token
    
    API->>Auth: Verify staff credentials
    Auth->>Auth: Check role permissions
    
    alt Authorized Staff
        Auth-->>API: Access Granted
        
        API->>DB: Query patient records
        DB-->>API: Return medical history
        
        API->>Audit: Log access event
        Note over API,Audit: {staffId, patientId, action: "VIEW_RECORDS"}
        Audit-->>API: Logged
        
        API-->>UI: Send patient data
        Note over API,UI: {demographics, history, allergies, prescriptions}
        
        UI->>Staff: Display patient dashboard
        UI->>Staff: Show medical history tabs
        
        Staff->>UI: Add prescription
        UI->>API: POST /api/prescriptions
        Note over UI,API: {patientId, medication, dosage}
        
        API->>DB: Save prescription
        DB-->>API: Saved
        
        API->>Audit: Log prescription added
        Audit-->>API: Logged
        
        API-->>UI: Success
        UI->>Staff: Show confirmation
        
    else Unauthorized
        Auth-->>API: Access Denied
        API-->>UI: Error 403: Forbidden
        UI->>Staff: Show access denied message
        
        API->>Audit: Log unauthorized attempt
        Audit-->>API: Security event logged
    end
```

---

#### **Sequence Diagram 3: Payment Processing**

```mermaid
sequenceDiagram
    actor Patient
    participant UI as Payment Page
    participant API as Backend
    participant DB as Database
    participant Gateway as Payment Gateway
    participant Email as Email Service

    Patient->>UI: Navigate to payment page
    UI->>API: GET /api/bills/:appointmentId
    API->>DB: Query appointment & charges
    DB-->>API: Return billing details
    API-->>UI: Send bill summary
    UI->>Patient: Display billing summary
    
    Patient->>UI: Select payment method: "Credit Card"
    Patient->>UI: Enter card details
    Patient->>UI: Click "Pay Now"
    
    UI->>UI: Validate card information
    
    UI->>API: POST /api/payments
    Note over UI,API: {appointmentId, amount, method, cardToken}
    
    API->>DB: Create payment record (status: PENDING)
    DB-->>API: Payment record created
    
    API->>Gateway: Initiate payment transaction
    Note over API,Gateway: {amount, cardToken, merchantId}
    
    Gateway->>Gateway: Process payment
    
    alt Payment Successful
        Gateway-->>API: Success {transactionId}
        
        API->>DB: Update payment status: PAID
        API->>DB: Update appointment status: CONFIRMED
        DB-->>API: Updated
        
        API->>API: Generate receipt PDF
        
        API->>Email: Send receipt email
        Note over API,Email: Attachment: receipt.pdf
        Email-->>API: Email sent
        
        API-->>UI: Success {receiptUrl, transactionId}
        UI->>Patient: Show success message
        UI->>Patient: Display receipt & download option
        
    else Payment Declined
        Gateway-->>API: Error: Payment declined
        
        API->>DB: Update payment status: FAILED
        DB-->>API: Updated
        
        API-->>UI: Error: Payment failed
        UI->>Patient: Show error message
        UI->>Patient: Suggest alternative methods
        
    else Gateway Timeout
        Gateway-->>API: Timeout error
        
        API->>DB: Update payment status: PENDING_VERIFICATION
        DB-->>API: Updated
        
        API-->>UI: Warning: Payment verification pending
        UI->>Patient: Show pending message
        UI->>Patient: Display support contact
    end
```

---

#### **Sequence Diagram 4: Analytics Report Generation**

```mermaid
sequenceDiagram
    actor Manager as Healthcare Manager
    participant UI as Dashboard
    participant API as Backend API
    participant Auth as Auth Service
    participant DB as MongoDB
    participant Analytics as Analytics Engine
    participant Export as Export Service

    Manager->>UI: Login to admin dashboard
    UI->>API: POST /api/auth/login
    API->>Auth: Validate credentials
    Auth-->>API: JWT token
    API-->>UI: Token + user data
    
    Manager->>UI: Navigate to "Reports & Analytics"
    UI->>Manager: Show report types
    
    Manager->>UI: Select "Patient Flow Report"
    Manager->>UI: Set date range: Jan 1 - Jan 31
    Manager->>UI: Click "Generate"
    
    UI->>API: POST /api/reports/generate
    Note over UI,API: {type: "patient_flow", startDate, endDate}
    
    API->>Auth: Verify manager role
    Auth-->>API: Role: MANAGER - Authorized
    
    API->>DB: Query appointments by date range
    DB-->>API: Return appointment data
    
    API->>DB: Query patient demographics
    DB-->>API: Return patient data
    
    API->>Analytics: Process data
    Note over API,Analytics: Calculate trends, averages, distributions
    
    Analytics->>Analytics: Aggregate by department
    Analytics->>Analytics: Calculate growth percentages
    Analytics->>Analytics: Identify peak hours
    Analytics-->>API: Return processed data
    
    API->>DB: Save report metadata
    DB-->>API: Report saved
    
    API-->>UI: Send report data & visualizations
    Note over API,UI: {charts, tables, statistics}
    
    UI->>Manager: Display interactive dashboard
    UI->>Manager: Show charts & metrics
    
    Manager->>UI: Click "Export as PDF"
    
    UI->>API: POST /api/reports/export
    Note over UI,API: {reportId, format: "PDF"}
    
    API->>Export: Generate PDF document
    Export->>Export: Create header & footer
    Export->>Export: Add charts as images
    Export->>Export: Format tables
    Export-->>API: PDF file generated
    
    API->>DB: Save export log
    DB-->>API: Logged
    
    API-->>UI: Send download URL
    UI->>Manager: Initiate file download
    Manager->>Manager: Save report.pdf
```

---

## 7️⃣ DESIGN IMPROVEMENT JUSTIFICATION

### **Improvement Table**

| Problem | Improvement | Reason | Impact |
|---------|------------|--------|---------|
| **Inheritance Missing** | Added User base class with Patient, Doctor, Admin inheriting from it | Eliminates code duplication for common authentication properties | Reduces codebase by ~30%, ensures consistent user management |
| **Wrong Multiplicity** | Changed Patient-Appointment from 1:1 to 1:* | One patient can have multiple appointments | Reflects real-world scenario correctly |
| **Missing Status Tracking** | Added `status` enum to Appointment (Scheduled, Confirmed, Completed, Cancelled) | Enables workflow management and filtering | Allows proper appointment lifecycle tracking |
| **No Payment Method Handling** | Added `paymentMethod` enum (Card, Insurance, Government, Cash) | System must support multiple payment types | Enables flexible payment processing |
| **Weak Error Handling** | Added alternate flows and exception handling in sequences | Real systems face network issues, concurrency | Prevents system crashes, improves reliability |
| **No Audit Trail** | Added AuditLog class with logging in all critical operations | Security and compliance requirement | Enables forensic analysis and compliance |
| **Poor Aggregation Design** | Changed Address to composition (Patient *-- Address) | Address cannot exist without patient | Ensures data integrity |
| **Missing External Systems** | Added Payment Gateway, Email Service as external actors | System depends on third-party services | Accurately models system boundaries |
| **No Time Slot Management** | Added TimeSlot class with availability tracking | Prevents double-booking | Ensures appointment integrity |
| **Incomplete User Feedback** | Added confirmation messages, error handling in UI sequences | Users need to know action outcomes | Improves usability and user confidence |
| **No Digital Health Card** | Added DigitalHealthCard entity with QR code | Core requirement from scenario | Enables instant patient identification |
| **Missing Report Scheduling** | Added `schedule()` method to Report class | Managers need automated periodic reports | Reduces manual work |
| **No Insurance Integration** | Added Insurance Provider as external system | Required for claim processing | Automates insurance verification |
| **Weak Security Model** | Added Auth Middleware with role-based checks in sequences | Prevents unauthorized access | Ensures data privacy and HIPAA compliance |
| **No Prescription Management** | Added Prescription as separate entity | Prescriptions have independent lifecycle | Allows prescription renewal and tracking |

---

## 8️⃣ HIGH-LEVEL ARCHITECTURE

```mermaid
graph TB
    subgraph "Client Layer"
        WebApp[React Web App<br/>Tailwind CSS]
        MobileApp[Mobile App<br/>React Native]
    end

    subgraph "API Gateway"
        Gateway[Nginx/Load Balancer]
    end

    subgraph "Application Layer"
        Auth[Authentication<br/>Service]
        AppointmentAPI[Appointment<br/>Service]
        PatientAPI[Patient<br/>Service]
        PaymentAPI[Payment<br/>Service]
        ReportAPI[Reporting<br/>Service]
    end

    subgraph "Business Logic"
        Express[Express.js<br/>Controllers]
        Middleware[Middleware<br/>Validation/Auth]
    end

    subgraph "Data Layer"
        MongoDB[(MongoDB<br/>Database)]
        Redis[(Redis<br/>Cache)]
    end

    subgraph "External Services"
        PaymentGW[Payment<br/>Gateway]
        EmailSMS[Email/SMS<br/>Service]
        Insurance[Insurance<br/>Provider API]
        CloudStorage[Cloud Storage<br/>S3/Azure]
    end

    WebApp --> Gateway
    MobileApp --> Gateway
    Gateway --> Auth
    Gateway --> AppointmentAPI
    Gateway --> PatientAPI
    Gateway --> PaymentAPI
    Gateway --> ReportAPI

    Auth --> Express
    AppointmentAPI --> Express
    PatientAPI --> Express
    PaymentAPI --> Express
    ReportAPI --> Express

    Express --> Middleware
    Middleware --> MongoDB
    Express --> Redis

    PaymentAPI --> PaymentGW
    Auth --> EmailSMS
    AppointmentAPI --> EmailSMS
    PaymentAPI --> Insurance
    PatientAPI --> CloudStorage

    style WebApp fill:#61dafb
    style MongoDB fill:#4db33d
    style Express fill:#000000
    style PaymentGW fill:#ff6b6b
```

---

## 📐 DESIGN PRINCIPLES APPLIED

### **SOLID Principles**

1. **Single Responsibility Principle**
   - Each controller handles one entity (PatientController, AppointmentController)
   - Services separated: AuthService, PaymentService, EmailService

2. **Open/Closed Principle**
   - Payment methods extendable without modifying core PaymentController
   - New report types can be added without changing ReportController

3. **Liskov Substitution Principle**
   - All User subclasses (Patient, Doctor, Admin) can replace User without breaking functionality

4. **Interface Segregation**
   - Separate interfaces for different actor capabilities
   - Doctors don't need payment methods, Patients don't need admin methods

5. **Dependency Inversion**
   - Controllers depend on abstractions (interfaces), not concrete implementations
   - Database layer abstracted through Mongoose models

---

**Design Phase Complete. Moving to Implementation.**
