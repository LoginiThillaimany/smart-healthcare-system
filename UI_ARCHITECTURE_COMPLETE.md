# 🎨 SMART HEALTHCARE SYSTEM - UI INFORMATION ARCHITECTURE

## 📐 NAVIGATION STRUCTURE

### Top-Level Routes
```
/                           → Home Dashboard (Protected)
/login                      → Login Page (Public)
/register                   → Register Page (Public)
/patient-dashboard          → Patient Profile (Protected - Patient)
/book-appointment           → Booking Flow Start (Protected)
/appointments/:id           → Appointment Details (Protected)
/doctors                    → Doctor Selection (Protected)
/slots                      → Time Slot Selection (Protected)
/payment                    → Payment Processing (Protected)
/reports                    → Medical Reports (Protected)
```

---

## 👤 PATIENT MODULE

### 1. Login Page (`/login`)
**Purpose:** Secure authentication entry point
**Components:**
- Glass-effect card with backdrop blur
- Email/password inputs
- "Remember me" checkbox
- Forgot password link
- Register redirect button
- Medical gradient logo

**Design Features:**
- Emerald gradient background
- Glassmorphism card effect
- Input validation with error messages
- Loading state with spinner
- JWT token storage

---

### 2. Register Page (`/register`)
**Purpose:** New patient account creation
**Components:**
- Multi-step form (Personal Info → Account Info)
- Step indicators (numbered badges)
- Form validation
- Terms & conditions checkbox
- Login redirect

**Fields:**
- First Name, Last Name
- Phone Number
- Date of Birth
- Gender (dropdown)
- Email
- Password + Confirmation
- Address fields (optional)

**Post-Registration:**
- Auto-generate Digital Health Card Number
- Send welcome email
- Redirect to dashboard

---

### 3. Dashboard (`/`)
**Purpose:** Patient home with quick actions & overview
**Layout:**

```
┌────────────────────────────────────────────────┐
│  Header: Logo | Healthcare Dashboard | Profile │
│                  Welcome, {PatientName}        │
└────────────────────────────────────────────────┘

┌─────────────┬─────────────┬─────────────┬────────────┐
│ 📅 Book     │ 👤 Profile  │ 💳 Payment  │ 📊 Reports │
│ Appointment │             │             │            │
│ (Gradient)  │   (White)   │   (White)   │  (White)   │
└─────────────┴─────────────┴─────────────┴────────────┘

┌─────────────────────────────────────────────────────┐
│ ⏰ UPCOMING APPOINTMENTS                            │
├──────────┬──────────┬──────────────────────────────┤
│ Card 1   │ Card 2   │ Card 3                       │
│ Dr. X    │ Dr. Y    │ Dr. Z                        │
│ Date     │ Date     │ Date                         │
│ Status   │ Status   │ Status                       │
└──────────┴──────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ALL APPOINTMENTS                  [+ Book New]      │
├──────┬───────────┬──────────┬────────┬────────────┤
│ Date │ Doctor    │ Hospital │ Status │ Actions    │
├──────┼───────────┼──────────┼────────┼────────────┤
│ ...  │ ...       │ ...      │ Badge  │ 👁️ ✏️      │
└──────┴───────────┴──────────┴────────┴────────────┘
```

**Quick Action Cards:**
- Book Appointment (Medical gradient, white text)
- Profile (White with emerald border)
- Payment (White card)
- Reports (White card)

**Features:**
- Upcoming appointments (max 3 cards)
- Full appointments table
- Status badges with emerald/teal/cyan colors
- Click-through to details
- Logout button

---

### 4. Book Appointment Flow

#### Step 1: Select Service (`/book-appointment`)
**Layout:** Grid of department cards

```
┌────────────┬────────────┬────────────┬────────────┐
│ 🫀         │ 🧠         │ 👶         │ 🦴         │
│ Cardiology │ Neurology  │ Pediatrics │ Orthopedics│
│ Click →    │ Click →    │ Click →    │ Click →    │
└────────────┴────────────┴────────────┴────────────┘
```

**Features:**
- Hover scale effect
- Icon + title
- Click navigates to doctor selection
- Back button to dashboard

---

#### Step 2: Select Doctor (`/doctors`)
**Layout:** Grid/List of doctor cards

```
┌──────────────────────────────────────────┐
│ 👨‍⚕️  Dr. John Smith                     │
│ ⭐⭐⭐⭐⭐ 4.8 (120 reviews)              │
│ Cardiology Specialist                   │
│ 15 years experience                     │
│ 📅 Available: Mon-Fri                   │
│         [Select Doctor →]               │
└──────────────────────────────────────────┘
```

**Features:**
- Profile photo placeholder
- Star rating
- Specialty & experience
- Availability indicator
- Filter by specialty
- Search bar

---

#### Step 3: Select Slot (`/slots`)
**Layout:** Calendar + Time picker

```
┌─────────────────────────────────────┐
│  📅 SELECT DATE                     │
│  [Calendar Widget]                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ⏰ AVAILABLE TIME SLOTS             │
│  ┌─────────┬─────────┬─────────┐   │
│  │ 09:00  │ 10:00  │ 11:00  │   │
│  │  AM    │  AM    │  AM    │   │
│  └─────────┴─────────┴─────────┘   │
│  ┌─────────┬─────────┬─────────┐   │
│  │ 02:00  │ 03:00  │ 04:00  │   │
│  │  PM    │  PM    │  PM    │   │
│  └─────────┴─────────┴─────────┘   │
└─────────────────────────────────────┘
```

**Features:**
- Interactive calendar
- Disabled past dates
- Available slots highlighted (emerald)
- Booked slots grayed out
- Real-time availability

---

#### Step 4: Confirm Booking (`/confirm`)
**Layout:** Summary modal

```
┌─────────────────────────────────────┐
│  ✅ CONFIRM APPOINTMENT              │
├─────────────────────────────────────┤
│  Service: Cardiology                │
│  Doctor: Dr. John Smith             │
│  Date: January 15, 2025             │
│  Time: 10:00 AM                     │
│  Reason: [Text Area]                │
├─────────────────────────────────────┤
│  Total: $50.00                      │
│                                      │
│  [Cancel] [Confirm & Pay →]         │
└─────────────────────────────────────┘
```

**Features:**
- Booking summary
- Reason for visit (textarea)
- Cost display
- Payment integration
- Success animation
- Auto-generate confirmation number

---

### 5. Appointment Details (`/appointments/:id`)
**Purpose:** View, Edit, Cancel, Delete appointments

**Layout:**
```
┌─────────────────────────────────────────────┐
│  ← Back to Dashboard                        │
│  APPOINTMENT DETAILS              [Status]  │
├─────────────────────────────────────────────┤
│  👨‍⚕️ DOCTOR INFORMATION                    │
│  Name: Dr. John Smith                       │
│  Specialty: Cardiology                      │
│  Hospital: General Hospital                 │
│  Phone: +94771234567                        │
├─────────────────────────────────────────────┤
│  📋 APPOINTMENT DETAILS                     │
│  Date: January 15, 2025                     │
│  Time: 10:00 AM                             │
│  Reason: Chest pain consultation            │
│  Type: In-person                            │
├─────────────────────────────────────────────┤
│  🔧 ACTIONS                                 │
│  [✏️ Edit] [🚫 Cancel] [🗑️ Delete] [💳 Pay] │
└─────────────────────────────────────────────┘
```

**CRUD Operations:**
- **READ:** Display all details
- **UPDATE:** Click "Edit" → inline form
- **DELETE:** Confirmation dialog
- **CANCEL:** Soft delete with reason

---

### 6. Patient Profile (`/patient-dashboard`)
**Purpose:** Manage personal & medical information

**Tab Structure:**
```
┌─────────────────────────────────────────────┐
│  [Profile Card Header]                      │
│  👤 {Full Name}                             │
│  Health Card: HC123456789                   │
│  Blood Type: O+ | Age: 35 | Gender: Male    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 👤 Profile | 🏥 Medical Info | 📋 History | 💊 Rx │
└─────────────────────────────────────────────┘
```

**Tab 1: Profile (Personal Info)**
- View/Edit mode toggle
- Name, Email, Phone, DOB
- Address (Street, City, State, Zip)
- Emergency Contact
- Save/Cancel buttons

**Tab 2: Medical Info**
- **Allergies:**
  - Input field + "Add" button
  - Tag display with "×" remove
  - Red-themed badges

- **Chronic Conditions:**
  - Input field + "Add" button
  - Tag display with "×" remove
  - Yellow-themed badges

**Tab 3: Medical History**
- Timeline view
- Each record shows:
  - Date
  - Condition
  - Treatment
  - Doctor name
- Blue accent border

**Tab 4: Prescriptions**
- Grid of prescription cards
- Medication name
- Dosage
- Duration
- Prescribed date
- Doctor name
- Green accent

**CRUD Operations:**
- UPDATE profile fields
- CREATE/DELETE allergies
- CREATE/DELETE conditions
- READ medical history
- READ prescriptions

---

### 7. Payment Page (`/payment`)
**Purpose:** Process payments for appointments

**Layout:**
```
┌─────────────────────────────────────────────┐
│  💳 PAYMENT                                  │
├─────────────────────────────────────────────┤
│  [Cash] [Card] [Insurance] [Government]     │
├─────────────────────────────────────────────┤
│  Appointment Details:                       │
│  Doctor: Dr. John Smith                     │
│  Date: Jan 15, 2025                         │
│  Service: Cardiology Consultation           │
├─────────────────────────────────────────────┤
│  Amount: LKR 5,000.00                       │
│                                              │
│  [Card Number]                               │
│  [Expiry] [CVV]                             │
│  [Cardholder Name]                          │
│                                              │
│  [Process Payment →]                        │
└─────────────────────────────────────────────┘
```

**Payment Methods:**
- **Cash:** Show QR code for counter payment
- **Card:** Stripe/PayPal integration
- **Insurance:** Insurance provider selection + policy number
- **Government:** Subsidy verification

**Features:**
- Form validation
- Payment confirmation
- Receipt generation (PDF)
- Email notification
- Payment history

---

## 👨‍⚕️ DOCTOR MODULE

### 1. Doctor Dashboard
**Purpose:** View appointments & patient queue

```
┌─────────────────────────────────────────────┐
│  👨‍⚕️ Dr. John Smith | Cardiology            │
│  Today's Appointments: 12                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📋 APPOINTMENT QUEUE                        │
├──────┬───────────┬──────────┬───────────────┤
│ Time │ Patient   │ Reason   │ Status        │
├──────┼───────────┼──────────┼───────────────┤
│ 09AM │ John Doe  │ Checkup  │ [In Progress] │
│ 10AM │ Jane S.   │ Follow-up│ [Waiting]     │
│ 11AM │ Mike T.   │ Consult  │ [Pending]     │
└──────┴───────────┴──────────┴───────────────┘
```

**Features:**
- Real-time queue status
- Color-coded statuses
- Quick actions per patient
- Search/filter patients
- Daily statistics

---

### 2. Patient Details Page
**Purpose:** View patient history & add notes

```
┌─────────────────────────────────────────────┐
│  PATIENT: John Doe (35 years, Male)         │
│  Health Card: HC123456789                   │
│  Blood Type: O+ | Allergies: Penicillin     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📜 VISIT HISTORY                            │
│  - Jan 1, 2025: Routine checkup             │
│  - Dec 15, 2024: Follow-up                  │
│  - Nov 10, 2024: Initial consult            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📝 ADD MEDICAL NOTES                        │
│  Diagnosis: [Input]                          │
│  Treatment: [Textarea]                       │
│  Prescription: [Add medications]             │
│  Follow-up: [Date picker]                   │
│  [Save Notes]                                │
└─────────────────────────────────────────────┘
```

**Features:**
- Complete medical history
- Current medications
- Allergy warnings (red highlight)
- Add diagnosis & treatment
- Prescribe medication
- Schedule follow-up

---

### 3. Report Upload Page
**Purpose:** Upload lab reports & test results

```
┌─────────────────────────────────────────────┐
│  📊 UPLOAD MEDICAL REPORT                    │
├─────────────────────────────────────────────┤
│  Patient: [Dropdown/Search]                  │
│  Report Type: [Lab/X-Ray/MRI/CT/Other]      │
│  Date: [Date Picker]                         │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  📁 Drag & Drop Files Here              │ │
│  │  or click to browse                     │ │
│  │  (PDF, JPG, PNG - Max 10MB)            │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  Notes: [Textarea]                           │
│  [Upload Report →]                          │
└─────────────────────────────────────────────┘
```

**Features:**
- Drag-and-drop upload
- Multiple file types
- File preview
- Progress bar
- Notification to patient

---

## 📊 MANAGER/ADMIN MODULE

### 1. Analytics Dashboard
**Purpose:** Hospital performance metrics

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 👥 Total     │ 📅 Today's   │ 💰 Revenue   │ ⭐ Avg       │
│ Patients     │ Appointments │ This Month   │ Rating       │
│ 12,450       │ 145          │ LKR 2.5M     │ 4.7/5.0      │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌──────────────────────────────────────────────────────────┐
│  📈 PATIENT VISITS (Last 30 Days)                        │
│  [Line Chart - Recharts]                                 │
└──────────────────────────────────────────────────────────┘

┌────────────────────────┬─────────────────────────────────┐
│  🏥 DEPARTMENT LOAD    │  💵 REVENUE BY DEPARTMENT       │
│  [Bar Chart]           │  [Pie Chart]                    │
└────────────────────────┴─────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  📊 TOP DOCTORS (By Patient Count)                       │
│  1. Dr. Smith - Cardiology - 450 patients                │
│  2. Dr. Jones - Neurology - 380 patients                 │
│  3. Dr. Lee - Pediatrics - 360 patients                  │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Real-time KPI cards
- Interactive charts (Recharts)
- Date range filters
- Export to PDF/Excel
- Drill-down capabilities

---

### 2. Staff Management
**Purpose:** CRUD for doctors & staff

```
┌─────────────────────────────────────────────┐
│  👥 STAFF MANAGEMENT         [+ Add New]    │
├─────────────────────────────────────────────┤
│  Search: [Input] | Filter: [Department] ▼   │
├──────┬────────────┬─────────────┬──────────┤
│ Photo│ Name       │ Specialty   │ Actions  │
├──────┼────────────┼─────────────┼──────────┤
│ 👨‍⚕️  │ Dr. Smith  │ Cardiology  │ ✏️ 🗑️    │
│ 👩‍⚕️  │ Dr. Jones  │ Neurology   │ ✏️ 🗑️    │
└──────┴────────────┴─────────────┴──────────┘
```

**CRUD Operations:**
- CREATE: Add new doctor/staff
- READ: View all staff
- UPDATE: Edit details
- DELETE: Remove staff (confirmation)

---

### 3. Automated Reports
**Purpose:** Generate & schedule reports

```
┌─────────────────────────────────────────────┐
│  📄 GENERATE REPORT                          │
├─────────────────────────────────────────────┤
│  Report Type: [Dropdown]                     │
│  - Patient Statistics                        │
│  - Revenue Report                            │
│  - Department Performance                    │
│  - Doctor Workload                           │
│                                              │
│  Date Range: [From] → [To]                  │
│  Format: [PDF] [Excel] [CSV]                │
│  Schedule: [One-time / Daily / Weekly]       │
│                                              │
│  [Generate Report →]                        │
└─────────────────────────────────────────────┘
```

**Features:**
- Multiple report types
- Custom date ranges
- Export formats
- Scheduled reports
- Email delivery
- Report history

---

## 🎨 DESIGN SYSTEM SPECIFICATIONS

### Color Palette
```css
/* Primary Gradient */
background: linear-gradient(to right, #10b981, #14b8a6, #06b6d4);
/* Emerald → Teal → Cyan */

/* Status Colors */
Scheduled: emerald-100/800
Confirmed: teal-100/800
In-Progress: cyan-100/800
Completed: gray-100/800
Cancelled: red-100/800

/* Accent */
Lime: #a3e635 (for highlights)
```

### Typography
```css
Font Family: 'Inter', system-ui, sans-serif
Headings: font-bold
Body: font-normal
Small: text-sm
```

### Components

#### Button Styles
```jsx
// Primary (Gradient)
<button className="btn-primary">
  Book Appointment
</button>

// Secondary (Outlined)
<button className="btn-secondary">
  Cancel
</button>

// Danger
<button className="btn-danger">
  Delete
</button>
```

#### Card Styles
```jsx
// Standard Card
<div className="card">
  Content
</div>

// Glass Effect Card
<div className="glass-effect rounded-2xl shadow-2xl p-8">
  Content
</div>

// Gradient Card
<div className="card medical-gradient text-white">
  Content
</div>
```

#### Form Fields
```jsx
<div>
  <label className="label">Email Address</label>
  <input
    type="email"
    className="input-field"
    placeholder="you@example.com"
  />
</div>
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile: < 640px (sm)
- Single column layout
- Stacked cards
- Hamburger menu
- Touch-friendly buttons (min 44px)

Tablet: 640px - 1024px (md)
- 2-column grid
- Collapsible sidebar
- Medium card sizes

Desktop: > 1024px (lg)
- Multi-column layout
- Full sidebar
- Larger cards
- Hover effects
```

---

## ♿ ACCESSIBILITY (WCAG 2.1 AA)

✅ **Color Contrast:** 4.5:1 minimum
✅ **Keyboard Navigation:** Tab order, focus indicators
✅ **Screen Readers:** ARIA labels, semantic HTML
✅ **Form Labels:** Explicit label associations
✅ **Error Messages:** Clear, descriptive
✅ **Focus Indicators:** Visible focus rings
✅ **Alternative Text:** Images, icons

---

## 🔐 SECURITY FEATURES

✅ **JWT Authentication:** Token-based auth
✅ **Role-Based Access:** Patient/Doctor/Manager
✅ **Input Validation:** Frontend + Backend
✅ **XSS Protection:** Content sanitization
✅ **CSRF Tokens:** Form security
✅ **HTTPS Only:** Secure connections
✅ **Session Timeout:** Auto-logout after inactivity

---

## 🚀 PERFORMANCE OPTIMIZATIONS

✅ **Code Splitting:** Route-based lazy loading
✅ **Image Optimization:** WebP, lazy loading
✅ **Caching:** Service workers, API caching
✅ **Minification:** CSS/JS bundling
✅ **CDN:** Static asset delivery
✅ **Debouncing:** Search inputs
✅ **Pagination:** Large datasets

---

## 📦 COMPONENT LIBRARY

All pages use:
- React 19
- React Router v7
- Tailwind CSS v4
- Axios for API
- React Hook Form (validation)
- Recharts (analytics)
- date-fns (date formatting)

---

**🎯 RESULT: Complete, production-ready UI architecture with modern design, full CRUD functionality, and professional user experience!**

---

**Next Step:** Implementation details in separate component files →
