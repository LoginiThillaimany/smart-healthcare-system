# UML Diagrams - Smart Healthcare System
## SE3070 Assignment 02

This document contains all UML diagrams in text format (Mermaid syntax).

---

## 1. Use Case Diagram

```mermaid
graph TB
    Patient((Patient))
    Doctor((Doctor))
    Admin((Administrator))
    System[System]
    
    subgraph "Smart Healthcare System"
        direction TB
        
        subgraph "Appointment Management"
            UC1[Search Doctors]
            UC2[View Available Slots]
            UC3[Book Appointment]
            UC4[Cancel Appointment]
            UC5[Reschedule Appointment]
            UC6[View Appointment History]
        end
        
        subgraph "Patient Management"
            UC7[Register Patient]
            UC8[Update Profile]
            UC9[View Medical Records]
            UC10[Add Medical History]
            UC11[Add Prescription]
        end
        
        subgraph "Payment Management"
            UC12[Make Payment]
            UC13[View Payment History]
            UC14[Process Refund]
            UC15[Generate Invoice]
        end
        
        subgraph "Reporting & Analytics"
            UC16[View Dashboard]
            UC17[Generate Appointment Report]
            UC18[Generate Revenue Report]
            UC19[View Patient Statistics]
        end
        
        subgraph "Doctor Operations"
            UC20[Manage Schedule]
            UC21[View Patient Information]
            UC22[Update Medical Records]
        end
    end
    
    Patient --> UC1
    Patient --> UC2
    Patient --> UC3
    Patient --> UC4
    Patient --> UC5
    Patient --> UC6
    Patient --> UC7
    Patient --> UC8
    Patient --> UC9
    Patient --> UC12
    Patient --> UC13
    
    Doctor --> UC20
    Doctor --> UC21
    Doctor --> UC22
    Doctor --> UC10
    Doctor --> UC11
    
    Admin --> UC16
    Admin --> UC17
    Admin --> UC18
    Admin --> UC19
    Admin --> UC14
    
    UC3 -.-> System
    UC4 -.-> System
    UC12 -.-> System
    UC17 -.-> System
```

---

## 2. Class Diagram

```mermaid
classDiagram
    class Patient {
        -ObjectId _id
        -String firstName
        -String lastName
        -String email
        -String phone
        -Date dateOfBirth
        -String gender
        -String healthCardNumber
        -String bloodType
        -String[] allergies
        -String[] chronicConditions
        -Object[] medicalHistory
        -Object[] prescriptions
        -Object address
        -Object emergencyContact
        -Boolean isActive
        -Date registrationDate
        +getFullName() String
        +getAge() Number
        +addMedicalHistory(data) void
        +addPrescription(data) void
    }
    
    class Doctor {
        -ObjectId _id
        -String firstName
        -String lastName
        -String email
        -String phone
        -String specialty
        -String licenseNumber
        -Object qualification
        -Number experienceYears
        -Number consultationFee
        -String department
        -Object[] schedule
        -Number rating
        -Number totalRatings
        -Boolean isActive
        +getFullName() String
        +getAvailableSlots(date) Slot[]
        +bookSlot(date, time) Slot
    }
    
    class Appointment {
        -ObjectId _id
        -ObjectId patient
        -ObjectId doctor
        -Date appointmentDate
        -String timeSlot
        -String reason
        -String[] symptoms
        -String appointmentType
        -String status
        -String cancellationReason
        -Date cancelledAt
        -String cancelledBy
        -String diagnosis
        -String prescription
        -String notes
        -Boolean followUpRequired
        -Date followUpDate
        -ObjectId payment
        -Boolean notificationSent
        -Date bookingDate
        +cancel(reason, by) Appointment
        +reschedule(newDate, newTime) Appointment
    }
    
    class Payment {
        -ObjectId _id
        -String transactionId
        -ObjectId patient
        -ObjectId appointment
        -Number amount
        -String currency
        -Number consultationFee
        -Number serviceFee
        -Number tax
        -Number discount
        -String paymentMethod
        -Object paymentDetails
        -String status
        -String receiptNumber
        -String invoiceUrl
        -Number refundAmount
        -String refundReason
        -Date refundDate
        -Date paymentDate
        -Date completedAt
        +processPayment() Payment
        +refund(amount, reason) Payment
        +generateInvoice() Object
        +getNetAmount() Number
    }
    
    class AuditLog {
        -ObjectId _id
        -String action
        -Object performedBy
        -String entityType
        -ObjectId entityId
        -Object details
        -Object changesBefore
        -Object changesAfter
        -String ipAddress
        -String userAgent
        -Date timestamp
        -String severity
        -String status
        -String errorMessage
        +logAction(data)$ AuditLog
        +getEntityAuditTrail(type, id)$ AuditLog[]
        +getUserActivity(userId, start, end)$ AuditLog[]
    }
    
    class Report {
        -ObjectId _id
        -String reportType
        -String title
        -String description
        -Object parameters
        -Object data
        -Object summary
        -Object generatedBy
        -String status
        -String format
        -String fileUrl
        -Number fileSize
        -Date generatedAt
        -Date expiresAt
        -Boolean isPublic
        -Object[] accessedBy
        +generateAppointmentSummary(start, end, user)$ Report
        +generateRevenueReport(start, end, user)$ Report
    }
    
    Patient "1" -- "0..*" Appointment : books
    Doctor "1" -- "0..*" Appointment : accepts
    Appointment "1" -- "0..1" Payment : requires
    Patient "1" -- "0..*" Payment : makes
    AuditLog "*" -- "*" Patient : tracks
    AuditLog "*" -- "*" Appointment : tracks
    AuditLog "*" -- "*" Payment : tracks
    Report "*" -- "1" Patient : about
    Report "*" -- "1" Appointment : analyzes
```

---

## 3. Sequence Diagrams

### 3.1 Appointment Booking Sequence

```mermaid
sequenceDiagram
    actor Patient
    participant UI as Frontend
    participant AC as AppointmentController
    participant AS as AppointmentService
    participant DB as Database
    participant AL as AuditLog
    
    Patient->>UI: Select doctor & time slot
    UI->>AC: POST /api/appointments
    AC->>AC: Validate request data
    
    AC->>AS: createAppointment(data)
    AS->>DB: findById(patientId)
    DB-->>AS: Patient object
    
    AS->>DB: findById(doctorId)
    DB-->>AS: Doctor object
    
    AS->>AS: Check slot availability
    alt Slot Available
        AS->>DB: Create appointment
        DB-->>AS: Saved appointment
        AS->>DB: Update doctor schedule
        AS->>AL: Log action
        AL->>DB: Save audit log
        AS-->>AC: Appointment object
        AC-->>UI: 201 Created + data
        UI-->>Patient: Show success message
    else Slot Not Available
        AS-->>AC: Error: Slot not available
        AC-->>UI: 400 Bad Request
        UI-->>Patient: Show error message
    end
```

### 3.2 Payment Processing Sequence

```mermaid
sequenceDiagram
    actor Patient
    participant UI as Frontend
    participant PC as PaymentController
    participant PS as PaymentService
    participant PM as Payment Model
    participant DB as Database
    participant AL as AuditLog
    
    Patient->>UI: Initiate payment
    UI->>PC: POST /api/payments
    PC->>PC: Validate payment data
    
    PC->>PS: createPayment(data)
    PS->>DB: findById(appointmentId)
    DB-->>PS: Appointment object
    
    PS->>PS: Calculate total amount
    PS->>DB: Create payment record
    DB-->>PS: Saved payment (Pending)
    
    PS->>PM: processPayment()
    PM->>PM: Call payment gateway
    PM->>DB: Update status to Completed
    
    PS->>DB: Link payment to appointment
    PS->>AL: Log payment action
    AL->>DB: Save audit log
    
    PS-->>PC: Payment object
    PC-->>UI: 201 Created + payment data
    UI-->>Patient: Show receipt
```

### 3.3 Medical Record Update Sequence

```mermaid
sequenceDiagram
    actor Doctor
    participant UI as Frontend
    participant PatC as PatientController
    participant PatS as PatientService
    participant DB as Database
    participant AL as AuditLog
    
    Doctor->>UI: Add medical history entry
    UI->>PatC: POST /api/patients/:id/medical-history
    PatC->>PatC: Validate data
    
    PatC->>PatS: addMedicalHistory(patientId, data)
    PatS->>DB: findById(patientId)
    DB-->>PatS: Patient object
    
    PatS->>DB: Push to medicalHistory array
    DB-->>PatS: Updated patient
    
    PatS->>AL: Log medical record update
    AL->>DB: Save audit log (Severity: Medium)
    
    PatS-->>PatC: Updated patient object
    PatC-->>UI: 200 OK + patient data
    UI-->>Doctor: Show success confirmation
```

### 3.4 Report Generation Sequence

```mermaid
sequenceDiagram
    actor Admin
    participant UI as Frontend
    participant RC as ReportController
    participant RS as ReportService
    participant DB as Database
    participant AL as AuditLog
    
    Admin->>UI: Request revenue report
    UI->>RC: POST /api/reports/revenue
    RC->>RC: Validate date range
    
    RC->>RS: generateRevenueReport(start, end, user)
    RS->>DB: Query payments in date range
    DB-->>RS: Payment documents
    
    RS->>RS: Calculate statistics
    RS->>RS: Aggregate by payment method
    
    RS->>DB: Create report document
    DB-->>RS: Saved report
    
    RS->>AL: Log report generation
    AL->>DB: Save audit log
    
    RS-->>RC: Report object with data
    RC-->>UI: 201 Created + report
    UI-->>Admin: Display report with charts
```

### 3.5 Appointment Cancellation Sequence

```mermaid
sequenceDiagram
    actor Patient
    participant UI as Frontend
    participant AC as AppointmentController
    participant AS as AppointmentService
    participant Apt as Appointment Model
    participant DB as Database
    participant AL as AuditLog
    
    Patient->>UI: Request cancellation
    UI->>AC: POST /api/appointments/:id/cancel
    AC->>AC: Validate cancellation reason
    
    AC->>AS: cancelAppointment(id, reason, 'Patient')
    AS->>DB: findById(appointmentId)
    DB-->>AS: Appointment object
    
    AS->>AS: Check if already cancelled
    alt Not Cancelled
        AS->>Apt: cancel(reason, 'Patient')
        Apt->>Apt: Update status to 'Cancelled'
        Apt->>DB: Release slot in doctor schedule
        DB-->>Apt: Slot marked available
        Apt->>DB: Save appointment
        DB-->>Apt: Updated appointment
        
        AS->>AL: Log cancellation
        AL->>DB: Save audit log (Severity: Medium)
        
        AS-->>AC: Cancelled appointment
        AC-->>UI: 200 OK + updated data
        UI-->>Patient: Show cancellation confirmation
    else Already Cancelled
        AS-->>AC: Error: Already cancelled
        AC-->>UI: 400 Bad Request
        UI-->>Patient: Show error message
    end
```

---

## 4. Activity Diagram - Appointment Booking Process

```
START
  ↓
[Patient Logs In]
  ↓
[Select Specialty] ─→ [View Doctors List]
  ↓
[Select Doctor] ─→ [View Available Dates]
  ↓
[Select Date] ─→ [View Time Slots]
  ↓
[Select Time Slot]
  ↓
[Enter Reason & Symptoms]
  ↓
<Validate Input> ──[Invalid]──→ [Show Error] ─→ (Back to Form)
  ↓ [Valid]
<Check Slot Availability>
  ↓ [Available]           ↓ [Not Available]
[Create Appointment]    [Show Error Message]
  ↓                       ↓
[Update Doctor Schedule] (Return to Slot Selection)
  ↓
[Log to Audit Trail]
  ↓
[Send Confirmation Email]
  ↓
[Display Success Message]
  ↓
END
```

---

## 5. State Diagram - Appointment Lifecycle

```
[Scheduled] ──[Doctor Confirms]──→ [Confirmed]
    ↓                                   ↓
    ↓ [Patient/Doctor Cancels]   [Appointment Time]
    ↓                                   ↓
    ↓                              [In-Progress]
    ↓                                   ↓
    ↓                            [Doctor Completes]
    ↓                                   ↓
    ↓                              [Completed]
    ↓
    → [Cancelled]
    
[Completed] ──[Needs Follow-up]──→ [New Appointment Created]

[No-Show] ← [Patient Doesn't Arrive] ← [Confirmed]
```

---

## 6. Entity Relationship Diagram (ERD)

```
PATIENT ||--o{ APPOINTMENT : books
DOCTOR ||--o{ APPOINTMENT : accepts
APPOINTMENT ||--o| PAYMENT : requires
PATIENT ||--o{ PAYMENT : makes
DOCTOR ||--o{ MEDICAL_HISTORY : creates
PATIENT ||--o{ MEDICAL_HISTORY : has
APPOINTMENT ||--o{ AUDIT_LOG : generates
PAYMENT ||--o{ AUDIT_LOG : generates
PATIENT ||--o{ AUDIT_LOG : generates

Cardinality:
|| = one
o{ = zero or many
o| = zero or one
```

---

**Note:** These diagrams can be rendered using Mermaid-compatible tools like:
- GitHub (native support)
- VS Code (with Mermaid extension)
- draw.io (with Mermaid plugin)
- Online: mermaid.live
