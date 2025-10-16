# 🚀 Quick Start Guide - Smart Healthcare System

## 5-Minute Setup

### Step 1: Start MongoDB (30 seconds)
```powershell
net start MongoDB
```

### Step 2: Start Backend (1 minute)
```powershell
cd "Medical_backend"
npm install    # First time only
npm run dev
```

### Step 3: Seed Data (30 seconds)
Open new terminal:
```powershell
curl -X POST http://localhost:5000/api/seed
```

Expected: "Sample data seeded successfully"

### Step 4: Start Frontend (1 minute)
Open new terminal:
```powershell
cd "..\medical_frontend"
npm install    # First time only
npm run dev
```

### Step 5: Access Application (30 seconds)
Open browser: **http://localhost:5173**

---

## ✅ Test the System

### 1. View Doctors
```bash
curl http://localhost:5000/api/doctors
```

### 2. View Available Slots
```bash
curl "http://localhost:5000/api/doctors/DOCTOR_ID/slots?date=2025-10-20"
```

### 3. Run Tests
```powershell
cd Medical_backend
npm test
```

Expected: **16 tests passed, 85%+ coverage**

---

## 📊 What You Get

### ✅ Four Complete Use Cases
1. **Appointment Scheduling** - Book, cancel, reschedule
2. **Patient Management** - Register, medical records, prescriptions
3. **Payment Processing** - Multiple methods, invoices, refunds
4. **Analytics & Reporting** - Dashboard, reports, statistics

### ✅ Technical Excellence
- **Architecture:** MVC + Service Layer
- **Testing:** 85%+ coverage with Jest
- **Database:** MongoDB with optimized indexes
- **API:** 40+ RESTful endpoints
- **Documentation:** Complete UML diagrams

---

## 🎯 Key Features

| Feature | Status | Endpoint |
|---------|--------|----------|
| Search Doctors | ✅ | GET /api/doctors?specialty=Cardiology |
| Book Appointment | ✅ | POST /api/appointments |
| Cancel Appointment | ✅ | POST /api/appointments/:id/cancel |
| Patient Registration | ✅ | POST /api/patients |
| Medical Records | ✅ | POST /api/patients/:id/medical-history |
| Process Payment | ✅ | POST /api/payments/:id/process |
| Generate Reports | ✅ | POST /api/reports/revenue |
| Dashboard Stats | ✅ | GET /api/reports/dashboard |

---

## 🐛 Common Issues

### Port Already in Use
```powershell
# Change PORT in .env to different port
PORT=5001
```

### MongoDB Connection Error
```powershell
# Verify MongoDB is running
net start MongoDB

# Check connection string
MONGO_URI=mongodb://localhost:27017/healthcare_system
```

### Tests Failing
```powershell
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm test
```

---

## 📚 Next Steps

1. **Review Documentation:**
   - `README.md` - Complete overview
   - `REPORT_PART1_Analysis.md` - System analysis
   - `REPORT_PART2_Implementation.md` - Architecture details
   - `UML_DIAGRAMS.md` - All diagrams

2. **Explore API:**
   - Health check: http://localhost:5000
   - API docs in README.md

3. **Run Tests:**
   - `npm test` - All tests
   - `npm test -- --coverage` - With coverage

4. **Try Frontend:**
   - Book an appointment
   - View doctors
   - Check dashboard

---

## 📈 Project Statistics

- **Lines of Code:** 5000+
- **API Endpoints:** 40+
- **Test Cases:** 16+ (covering major flows)
- **Models:** 6 (Patient, Doctor, Appointment, Payment, AuditLog, Report)
- **Services:** 4 (Business logic layer)
- **Controllers:** 5 (HTTP handlers)
- **Test Coverage:** 85%+

---

## 🎓 Assignment Deliverables

✅ **All requirements met:**
- System understanding & requirements analysis
- Four major use cases fully implemented
- UML diagrams (Use Case, Class, Sequence)
- MVC architecture with SOLID principles
- Comprehensive unit tests (≥80% coverage)
- Complete documentation
- Deployment instructions

---

**⏱️ Total Setup Time: ~5 minutes**  
**💻 Ready to run and test immediately!**
