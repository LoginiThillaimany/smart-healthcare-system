# SMART HEALTHCARE SYSTEM - COMPLETE ANALYSIS & DESIGN
## SE3070 Assignment 02 - System Analysis & Implementation Report

---

## 📋 EXECUTIVE SUMMARY

This report presents the complete analysis, design, and implementation of a Smart Healthcare System for Sri Lankan hospitals. The system addresses critical inefficiencies in manual healthcare processes by providing a unified digital platform connecting government and private hospitals, enabling seamless patient management, appointment scheduling, billing, and analytics.

**Technology Stack:** MERN (MongoDB, Express.js, React, Node.js) + Tailwind CSS  
**Architecture:** RESTful API, JWT Authentication, Role-Based Access Control  
**Key Features:** Digital Health Cards, Real-time Appointment Booking, Multi-Payment Integration, Analytics Dashboard

---

## 1️⃣ SCENARIO SUMMARY & OBJECTIVES

### **Problem Statement**
Urban hospitals in Sri Lanka face significant operational challenges:
- **Manual Processes:** Paper-based patient records lead to data inconsistency and loss
- **Inefficient Scheduling:** Long waiting times due to manual appointment booking
- **Fragmented Systems:** No unified platform across government and private hospitals
- **Limited Insights:** Lack of data-driven decision-making for healthcare management
- **Payment Inefficiencies:** Manual billing processes causing delays and errors

### **Key Objectives**
1. **Digitalize Patient Records:** Create a unified Digital Health Card system
2. **Streamline Appointments:** Enable online booking, rescheduling, and cancellation
3. **Integrate Payment Systems:** Support government coverage, insurance, and private payments
4. **Enhance Accessibility:** Provide mobile/web access for patients and staff
5. **Enable Analytics:** Deliver insights through dashboards and automated reports
6. **Ensure Security:** Implement robust authentication and role-based access control

---

## 2️⃣ REQUIREMENTS ANALYSIS

### **2.1 Functional Requirements**

#### **FR1: User Management**
- FR1.1: Patient registration with email verification
- FR1.2: Secure login with JWT authentication
- FR1.3: Password reset via email
- FR1.4: Profile management (personal info, medical history)
- FR1.5: Role-based access (Patient, Doctor, Admin, Manager)

#### **FR2: Appointment Management**
- FR2.1: Search doctors by specialty, location, availability
- FR2.2: View available time slots in real-time
- FR2.3: Book appointments with instant confirmation
- FR2.4: Reschedule or cancel appointments (with policies)
- FR2.5: Automated email/SMS notifications
- FR2.6: Doctor schedule management by admin

#### **FR3: Medical Records Management**
- FR3.1: Digital Health Card with unique patient ID
- FR3.2: Store medical history, allergies, prescriptions
- FR3.3: Upload and view lab reports, X-rays
- FR3.4: Access records via QR code scanning
- FR3.5: Share records with authorized doctors
- FR3.6: Prescription management and renewal requests

#### **FR4: Payment & Billing**
- FR4.1: Multiple payment methods (Card, Cash, Insurance, Government)
- FR4.2: Real-time payment processing with external gateways
- FR4.3: Generate digital invoices/receipts
- FR4.4: Payment history and transaction logs
- FR4.5: Insurance claim processing
- FR4.6: Refund management for cancellations

#### **FR5: Reporting & Analytics**
- FR5.1: Patient flow analytics (admissions, visits)
- FR5.2: Revenue reports by department/service
- FR5.3: Doctor performance metrics
- FR5.4: Service utilization statistics
- FR5.5: Export reports as PDF/Excel
- FR5.6: Customizable dashboard with filters

### **2.2 Non-Functional Requirements**

#### **NFR1: Performance**
- Response time < 2 seconds for 95% of requests
- Support 10,000+ concurrent users
- Database query optimization with indexing

#### **NFR2: Security**
- HTTPS encryption for all communications
- Password hashing with bcrypt (10+ rounds)
- JWT token expiration (15 min access, 7 days refresh)
- Input validation and sanitization
- Protection against SQL injection, XSS, CSRF
- Audit logging for sensitive operations

#### **NFR3: Usability**
- Intuitive UI following Material Design principles
- Mobile-responsive (works on phones, tablets, desktops)
- Accessibility compliance (WCAG 2.1 Level AA)
- Multi-language support (Sinhala, Tamil, English)
- Clear error messages and user feedback

#### **NFR4: Reliability**
- 99.5% uptime SLA
- Automated database backups (daily)
- Disaster recovery plan
- Error handling and graceful degradation

#### **NFR5: Scalability**
- Horizontal scaling support
- Load balancing capability
- Microservices-ready architecture
- CDN integration for static assets

#### **NFR6: Maintainability**
- Clean code with SOLID principles
- Comprehensive API documentation (Swagger)
- Unit test coverage > 80%
- Version control with Git
- Continuous Integration/Deployment (CI/CD)

---

## 3️⃣ USE CASE ANALYSIS

### **3.1 Core Business Use Cases**

#### **Use Case 1: Appointment Scheduling & Management**
#### **Use Case 2: Patient Account & Medical Record Management**
#### **Use Case 3: Payment & Billing Management**
#### **Use Case 4: Data Analysis & Reporting**

### **3.2 Detailed Use-Case Table**

| Use Case ID | UC-01: Book Appointment |
|-------------|-------------------------|
| **Actors** | Patient (Primary), System, Doctor (Secondary) |
| **Description** | Patient searches for available doctors and books an appointment for a specific date/time |
| **Preconditions** | • Patient is logged in<br>• Patient has an active Digital Health Card<br>• Doctor has available slots |
| **Postconditions** | • Appointment is created with "Scheduled" status<br>• Confirmation email/SMS sent to patient<br>• Doctor's calendar is updated<br>• Appointment appears in patient's dashboard |
| **Main Flow** | 1. Patient navigates to "Book Appointment" page<br>2. System displays service/specialty selection<br>3. Patient selects specialty (e.g., Cardiology)<br>4. System displays list of available doctors with ratings<br>5. Patient selects doctor<br>6. System displays calendar with available slots<br>7. Patient selects date and time slot<br>8. System displays booking summary<br>9. Patient confirms booking<br>10. System validates slot availability<br>11. System creates appointment record<br>12. System sends confirmation notification<br>13. System displays success message |
| **Alternate Flows** | **A1: Slot No Longer Available**<br>• At step 10, if slot is taken, system shows error<br>• System refreshes available slots<br>• Patient selects another slot<br><br>**A2: Network Error**<br>• System displays retry option<br>• Caches form data to prevent data loss |
| **Exception Flows** | **E1: Patient Not Logged In**<br>• System redirects to login page<br>• After login, returns to booking flow<br><br>**E2: Doctor Unavailable**<br>• System suggests alternative doctors<br>• Allows patient to set notification for availability |

---

| Use Case ID | UC-02: Manage Medical Records |
|-------------|-------------------------------|
| **Actors** | Patient (Primary), Doctor (Secondary), Admin |
| **Description** | Patient views, updates, and manages their digital health records including medical history, prescriptions, and lab results |
| **Preconditions** | • User is authenticated<br>• Patient profile exists |
| **Postconditions** | • Medical records are updated<br>• Audit log entry created<br>• Changes reflected in Digital Health Card |
| **Main Flow** | 1. Patient logs into system<br>2. Navigates to "My Health Records"<br>3. System displays patient dashboard<br>4. Patient views medical history tabs (Allergies, Medications, Surgeries, Lab Results)<br>5. Patient adds/updates information<br>6. System validates input data<br>7. System saves changes to database<br>8. System updates last modified timestamp<br>9. System displays success confirmation |
| **Alternate Flows** | **A1: Doctor Adding Records**<br>• Doctor scans patient QR code<br>• System loads patient records<br>• Doctor adds prescription/notes<br>• Patient receives notification of update<br><br>**A2: Upload Lab Results**<br>• Patient uploads PDF/image file<br>• System validates file type and size<br>• System stores file in cloud storage<br>• System creates record link |
| **Exception Flows** | **E1: Invalid File Format**<br>• System rejects upload<br>• Shows allowed formats (PDF, JPG, PNG)<br><br>**E2: Unauthorized Access**<br>• System denies access<br>• Logs security event |

---

| Use Case ID | UC-03: Process Payment |
|-------------|------------------------|
| **Actors** | Patient (Primary), Payment Gateway (External), System, Admin |
| **Description** | Patient makes payment for medical services using various payment methods |
| **Preconditions** | • Appointment exists with "Confirmed" status<br>• Bill is generated<br>• Payment amount is calculated |
| **Postconditions** | • Payment status updated to "Paid"<br>• Receipt generated and sent to patient<br>• Payment record created in database<br>• Revenue report updated |
| **Main Flow** | 1. Patient navigates to payment page<br>2. System displays billing summary<br>3. System shows payment method options<br>4. Patient selects payment method (Card/Insurance/Government/Cash)<br>5. **If Card:** Patient enters card details<br>6. System sends payment request to gateway<br>7. Gateway processes payment<br>8. Gateway returns success response<br>9. System updates payment status<br>10. System generates digital receipt<br>11. System sends receipt via email<br>12. System displays confirmation page |
| **Alternate Flows** | **A1: Insurance Payment**<br>• Patient enters insurance details<br>• System validates with insurance provider API<br>• System calculates co-payment amount<br>• Patient pays remaining balance<br><br>**A2: Government Coverage**<br>• System verifies patient eligibility<br>• Applies government subsidy<br>• Generates claim form<br>• No patient payment required<br><br>**A3: Cash Payment**<br>• System generates payment code<br>• Patient pays at hospital counter<br>• Staff updates payment status manually |
| **Exception Flows** | **E1: Payment Declined**<br>• System shows error message<br>• Suggests alternative payment method<br>• Allows retry<br><br>**E2: Gateway Timeout**<br>• System marks payment as "Pending"<br>• Creates reconciliation task<br>• Sends notification to admin |

---

| Use Case ID | UC-04: Generate Analytics Report |
|-------------|----------------------------------|
| **Actors** | Healthcare Manager (Primary), Admin, System |
| **Description** | Manager generates comprehensive reports on patient flow, revenue, and service utilization for decision-making |
| **Preconditions** | • User has "Manager" or "Admin" role<br>• Historical data exists in database<br>• Date range is specified |
| **Postconditions** | • Report is generated with charts and tables<br>• Report is saved in system<br>• Export file (PDF/Excel) is created |
| **Main Flow** | 1. Manager logs into admin dashboard<br>2. Navigates to "Reports & Analytics"<br>3. System displays report types menu<br>4. Manager selects report type (Patient Flow/Revenue/Service Utilization)<br>5. Manager specifies date range and filters<br>6. System queries database<br>7. System aggregates data<br>8. System generates visualizations (charts/graphs)<br>9. System displays interactive dashboard<br>10. Manager clicks "Export"<br>11. System generates PDF/Excel file<br>12. System initiates download<br>13. System logs report generation |
| **Alternate Flows** | **A1: Scheduled Reports**<br>• Admin sets up automated report<br>• System generates report at scheduled time<br>• System emails report to recipients<br><br>**A2: Custom Report**<br>• Manager selects custom metrics<br>• Drags and drops data fields<br>• System builds dynamic query<br>• Displays custom visualization |
| **Exception Flows** | **E1: Insufficient Data**<br>• System shows warning message<br>• Suggests extending date range<br><br>**E2: Export Failure**<br>• System retries generation<br>• If failed, saves draft<br>• Notifies IT support |

---

## 4️⃣ ACTOR ANALYSIS

### **Primary Actors**

1. **Patient**
   - Register and manage account
   - Book, reschedule, cancel appointments
   - View medical records and prescriptions
   - Make payments
   - Access Digital Health Card

2. **Doctor**
   - View assigned appointments
   - Access patient medical records
   - Add prescriptions and notes
   - Manage availability schedule
   - View performance metrics

3. **Healthcare Manager**
   - Access analytics dashboard
   - Generate reports
   - Monitor system performance
   - Make strategic decisions

4. **Admin/Hospital Staff**
   - Manage doctor profiles
   - Verify patient registrations
   - Handle manual payment updates
   - Scan Digital Health Cards
   - Resolve system issues

### **Secondary Actors**

5. **Payment Gateway (External)**
   - Process card payments
   - Return transaction status
   - Handle refunds

6. **Email/SMS Service (External)**
   - Send notifications
   - Deliver OTPs
   - Send appointment reminders

7. **Insurance Provider API (External)**
   - Verify coverage
   - Process claims
   - Return eligibility status

---

## 5️⃣ DATA FLOW SUMMARY

### **Patient Appointment Flow**
```
Patient Login → Select Service → Choose Doctor → Pick Time Slot 
→ Confirm Booking → Payment → Confirmation Email → Appointment Scheduled
```

### **Medical Record Access Flow**
```
Hospital Staff → Scan Patient QR Code → System Retrieves Records 
→ Display Medical History → Staff Updates Information → Save to Database
```

### **Payment Processing Flow**
```
Generate Bill → Patient Selects Payment Method → Enter Payment Details 
→ External Gateway Processing → Payment Confirmation → Generate Receipt 
→ Update Database → Email Receipt
```

### **Analytics Generation Flow**
```
Manager Selects Report Type → Specify Filters → System Queries Database 
→ Aggregate Data → Generate Charts → Display Dashboard → Export PDF/Excel
```

---

## 📊 SUMMARY STATISTICS

| Metric | Value |
|--------|-------|
| **Total Functional Requirements** | 26 |
| **Total Non-Functional Requirements** | 18 |
| **Core Use Cases** | 4 (detailed) |
| **Supporting Use Cases** | 12+ |
| **Primary Actors** | 4 |
| **External Systems** | 3 |
| **API Endpoints** | 45+ |
| **Database Collections** | 8 |

---

**This analysis forms the foundation for the system design and implementation phases.**
