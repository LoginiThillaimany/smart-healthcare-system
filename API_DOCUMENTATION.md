# 🏥 SMART HEALTHCARE SYSTEM - API DOCUMENTATION

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 AUTHENTICATION ENDPOINTS

### 1. Register New Patient
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "patient@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+94771234567",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "address": {
    "street": "123 Main St",
    "city": "Colombo",
    "state": "Western",
    "zipCode": "00100"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6756a8b4c8d0e1f2a3b4c5d6",
      "email": "patient@example.com",
      "role": "patient"
    },
    "patient": {
      "id": "6756a8b4c8d0e1f2a3b4c5d7",
      "fullName": "John Doe",
      "healthCardNumber": "HC17027834561234"
    }
  }
}
```

---

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "patient@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6756a8b4c8d0e1f2a3b4c5d6",
      "email": "patient@example.com",
      "role": "patient",
      "lastLogin": "2025-10-16T08:30:00.000Z"
    },
    "patient": {
      "id": "6756a8b4c8d0e1f2a3b4c5d7",
      "fullName": "John Doe",
      "healthCardNumber": "HC17027834561234"
    }
  }
}
```

**Error Response - Invalid Credentials (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Error Response - Account Locked (423):**
```json
{
  "success": false,
  "message": "Account is temporarily locked due to multiple failed login attempts"
}
```

---

### 3. Get Current User
**GET** `/auth/me`  
**Authorization:** Bearer Token Required

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "6756a8b4c8d0e1f2a3b4c5d6",
      "email": "patient@example.com",
      "role": "patient",
      "isActive": true,
      "isVerified": false,
      "createdAt": "2025-10-16T08:30:00.000Z"
    },
    "profile": {
      "id": "6756a8b4c8d0e1f2a3b4c5d7",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "age": 35,
      "healthCardNumber": "HC17027834561234",
      "bloodType": "O+",
      "allergies": [],
      "phone": "+94771234567"
    }
  }
}
```

---

### 4. Forgot Password
**POST** `/auth/forgot-password`

**Request Body:**
```json
{
  "email": "patient@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset token sent",
  "resetUrl": "http://localhost:5000/api/auth/reset-password/abc123def456"
}
```

---

### 5. Reset Password
**PUT** `/auth/reset-password/:resetToken`

**Request Body:**
```json
{
  "password": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 6. Update Password
**PUT** `/auth/update-password`  
**Authorization:** Bearer Token Required

**Request Body:**
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🩺 APPOINTMENT ENDPOINTS

### 1. Get All Appointments
**GET** `/appointments`  
**Authorization:** Bearer Token Required

**Query Parameters:**
- `status` - Filter by status (Scheduled, Confirmed, Completed, Cancelled)
- `date` - Filter by date (YYYY-MM-DD)
- `doctorId` - Filter by doctor ID
- `patientId` - Filter by patient ID

**Example:** `/appointments?status=Scheduled&date=2025-10-20`

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "6756a8b4c8d0e1f2a3b4c5d8",
      "patient": {
        "_id": "6756a8b4c8d0e1f2a3b4c5d7",
        "fullName": "John Doe"
      },
      "doctor": {
        "_id": "6756a8b4c8d0e1f2a3b4c5d9",
        "firstName": "Sarah",
        "lastName": "Johnson",
        "specialty": "Cardiology"
      },
      "appointmentDate": "2025-10-20T00:00:00.000Z",
      "timeSlot": "10:00",
      "status": "Scheduled",
      "reason": "Regular checkup",
      "appointmentType": "Consultation",
      "createdAt": "2025-10-16T08:30:00.000Z"
    }
  ]
}
```

---

### 2. Book Appointment
**POST** `/appointments`  
**Authorization:** Bearer Token Required

**Request Body:**
```json
{
  "doctorId": "6756a8b4c8d0e1f2a3b4c5d9",
  "appointmentDate": "2025-10-20",
  "timeSlot": "10:00",
  "reason": "Regular checkup for cardiac health",
  "appointmentType": "Consultation",
  "symptoms": ["chest pain", "shortness of breath"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "_id": "6756a8b4c8d0e1f2a3b4c5d8",
    "patient": "6756a8b4c8d0e1f2a3b4c5d7",
    "doctor": "6756a8b4c8d0e1f2a3b4c5d9",
    "appointmentDate": "2025-10-20T00:00:00.000Z",
    "timeSlot": "10:00",
    "status": "Scheduled",
    "reason": "Regular checkup for cardiac health",
    "appointmentType": "Consultation",
    "symptoms": ["chest pain", "shortness of breath"]
  }
}
```

---

### 3. Cancel Appointment
**PUT** `/appointments/:id/cancel`  
**Authorization:** Bearer Token Required

**Request Body:**
```json
{
  "cancellationReason": "Emergency came up"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "_id": "6756a8b4c8d0e1f2a3b4c5d8",
    "status": "Cancelled",
    "cancellationReason": "Emergency came up",
    "cancelledAt": "2025-10-16T09:00:00.000Z",
    "cancelledBy": "Patient"
  }
}
```

---

## 👤 PATIENT ENDPOINTS

### 1. Get All Patients
**GET** `/patients`  
**Authorization:** Bearer Token Required (Admin/Manager only)

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "6756a8b4c8d0e1f2a3b4c5d7",
      "fullName": "John Doe",
      "email": "patient@example.com",
      "phone": "+94771234567",
      "age": 35,
      "gender": "Male",
      "healthCardNumber": "HC17027834561234",
      "bloodType": "O+"
    }
  ]
}
```

---

### 2. Get Patient by ID
**GET** `/patients/:id`  
**Authorization:** Bearer Token Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6756a8b4c8d0e1f2a3b4c5d7",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "email": "patient@example.com",
    "phone": "+94771234567",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "age": 35,
    "gender": "Male",
    "healthCardNumber": "HC17027834561234",
    "bloodType": "O+",
    "allergies": ["Penicillin"],
    "chronicConditions": [],
    "address": {
      "street": "123 Main St",
      "city": "Colombo",
      "state": "Western",
      "zipCode": "00100",
      "country": "Sri Lanka"
    },
    "insurance": {
      "coverageType": "Private",
      "provider": "Ceylinco Insurance",
      "policyNumber": "POL123456"
    },
    "medicalHistory": [],
    "prescriptions": [],
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
    "profilePhoto": "https://example.com/photos/patient.jpg"
  }
}
```

---

### 3. Update Patient Profile
**PUT** `/patients/:id`  
**Authorization:** Bearer Token Required

**Request Body:**
```json
{
  "phone": "+94777654321",
  "address": {
    "street": "456 New St",
    "city": "Colombo",
    "state": "Western",
    "zipCode": "00200"
  },
  "allergies": ["Penicillin", "Latex"],
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+94771234999"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Patient profile updated successfully",
  "data": {
    "_id": "6756a8b4c8d0e1f2a3b4c5d7",
    "fullName": "John Doe",
    "phone": "+94777654321",
    "allergies": ["Penicillin", "Latex"]
  }
}
```

---

## 👨‍⚕️ DOCTOR ENDPOINTS

### 1. Get All Doctors
**GET** `/doctors`

**Query Parameters:**
- `specialty` - Filter by specialty (Cardiology, Pediatrics, etc.)
- `available` - Filter by availability (true/false)

**Example:** `/doctors?specialty=Cardiology`

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "6756a8b4c8d0e1f2a3b4c5d9",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "specialty": "Cardiology",
      "qualification": "MBBS, MD (Cardiology)",
      "experienceYears": 15,
      "consultationFee": 5000,
      "rating": 4.8,
      "availableDays": ["Monday", "Wednesday", "Friday"],
      "hospitalAffiliation": "National Hospital Colombo"
    }
  ]
}
```

---

### 2. Get Doctor Available Slots
**GET** `/doctors/:id/slots`

**Query Parameters:**
- `date` - Date to check availability (YYYY-MM-DD)

**Example:** `/doctors/6756a8b4c8d0e1f2a3b4c5d9/slots?date=2025-10-20`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "doctorId": "6756a8b4c8d0e1f2a3b4c5d9",
    "doctorName": "Dr. Sarah Johnson",
    "date": "2025-10-20",
    "slots": [
      {
        "time": "09:00",
        "isAvailable": true
      },
      {
        "time": "10:00",
        "isAvailable": false
      },
      {
        "time": "11:00",
        "isAvailable": true
      }
    ]
  }
}
```

---

## 💳 PAYMENT ENDPOINTS

### 1. Create Payment
**POST** `/payments`  
**Authorization:** Bearer Token Required

**Request Body:**
```json
{
  "appointmentId": "6756a8b4c8d0e1f2a3b4c5d8",
  "amount": 5000,
  "paymentMethod": "Card",
  "cardDetails": {
    "cardNumber": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvv": "123"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "_id": "6756a8b4c8d0e1f2a3b4c5da",
    "appointment": "6756a8b4c8d0e1f2a3b4c5d8",
    "amount": 5000,
    "paymentMethod": "Card",
    "paymentStatus": "Paid",
    "transactionId": "TXN123456789",
    "paymentDate": "2025-10-16T09:30:00.000Z",
    "receiptUrl": "https://example.com/receipts/receipt123.pdf"
  }
}
```

---

### 2. Get Payment History
**GET** `/payments`  
**Authorization:** Bearer Token Required

**Query Parameters:**
- `patientId` - Filter by patient
- `status` - Filter by status (Paid, Pending, Failed)

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "6756a8b4c8d0e1f2a3b4c5da",
      "amount": 5000,
      "paymentMethod": "Card",
      "paymentStatus": "Paid",
      "paymentDate": "2025-10-16T09:30:00.000Z",
      "appointment": {
        "doctor": "Dr. Sarah Johnson",
        "appointmentDate": "2025-10-20"
      }
    }
  ]
}
```

---

## 📊 REPORT ENDPOINTS

### 1. Generate Dashboard Report
**GET** `/reports/dashboard`  
**Authorization:** Bearer Token Required (Manager/Admin only)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "appointments": {
      "total": 12500,
      "scheduled": 250,
      "completed": 11500,
      "cancelled": 750
    },
    "patients": {
      "total": 8500,
      "newThisMonth": 150,
      "active": 7800
    },
    "revenue": {
      "total": 12500000,
      "thisMonth": 850000,
      "growth": 8.5
    },
    "doctors": {
      "total": 45,
      "available": 38
    },
    "averageWaitTime": 3.5,
    "patientSatisfaction": 92
  }
}
```

---

### 2. Export Report
**POST** `/reports/export`  
**Authorization:** Bearer Token Required (Manager/Admin only)

**Request Body:**
```json
{
  "reportType": "patient_flow",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "format": "PDF"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "reportId": "RPT123456",
    "downloadUrl": "https://example.com/reports/patient_flow_jan2025.pdf",
    "expiresAt": "2025-10-17T09:30:00.000Z"
  }
}
```

---

## 🔒 AUTHORIZATION HEADERS

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚫 ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'patient' is not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message in development mode"
}
```

---

## 📝 NOTES

1. **Date Format:** All dates use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
2. **Time Slots:** Use 24-hour format (09:00, 14:00, etc.)
3. **Token Expiry:** JWT tokens expire after 7 days by default
4. **Rate Limiting:** API is rate-limited to 100 requests per 15 minutes per IP
5. **Pagination:** List endpoints support pagination with `page` and `limit` query parameters

---

**API Version:** 2.0.0  
**Last Updated:** October 16, 2025
