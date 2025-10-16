// Mock data for the healthcare system

export const mockDoctors = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Smith',
    specialty: 'Cardiology',
    experience: 15,
    rating: 4.8,
    reviewCount: 120,
    hospitalAffiliation: 'General Hospital',
    availability: true,
    phone: '+94771234567',
    email: 'john.smith@hospital.com',
    qualifications: ['MBBS', 'MD Cardiology', 'FRCP'],
    availableSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM']
  },
  {
    _id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    specialty: 'Pediatrics',
    experience: 12,
    rating: 4.9,
    reviewCount: 98,
    hospitalAffiliation: 'Children\'s Hospital',
    availability: true,
    phone: '+94771234568',
    email: 'sarah.johnson@hospital.com',
    qualifications: ['MBBS', 'MD Pediatrics'],
    availableSlots: ['08:00 AM', '11:00 AM', '01:00 PM', '04:00 PM']
  },
  {
    _id: '3',
    firstName: 'Michael',
    lastName: 'Davis',
    specialty: 'Neurology',
    experience: 18,
    rating: 4.7,
    reviewCount: 150,
    hospitalAffiliation: 'Neuro Center',
    availability: false,
    phone: '+94771234569',
    email: 'michael.davis@hospital.com',
    qualifications: ['MBBS', 'MD Neurology', 'DM'],
    availableSlots: []
  },
  {
    _id: '4',
    firstName: 'Emily',
    lastName: 'Brown',
    specialty: 'Dermatology',
    experience: 10,
    rating: 4.6,
    reviewCount: 85,
    hospitalAffiliation: 'Skin Care Clinic',
    availability: true,
    phone: '+94771234570',
    email: 'emily.brown@hospital.com',
    qualifications: ['MBBS', 'MD Dermatology'],
    availableSlots: ['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM']
  },
  {
    _id: '5',
    firstName: 'David',
    lastName: 'Wilson',
    specialty: 'Orthopedics',
    experience: 20,
    rating: 4.9,
    reviewCount: 200,
    hospitalAffiliation: 'Orthopedic Hospital',
    availability: true,
    phone: '+94771234571',
    email: 'david.wilson@hospital.com',
    qualifications: ['MBBS', 'MS Orthopedics', 'FRCS'],
    availableSlots: ['09:00 AM', '01:00 PM', '03:00 PM']
  }
];

export const mockAppointments = [
  {
    _id: 'apt1',
    doctor: mockDoctors[0],
    appointmentDate: new Date(Date.now() + 86400000).toISOString(),
    timeSlot: '10:00 AM',
    status: 'Scheduled',
    reason: 'Regular checkup',
    appointmentType: 'In-person',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'apt2',
    doctor: mockDoctors[1],
    appointmentDate: new Date(Date.now() + 172800000).toISOString(),
    timeSlot: '11:00 AM',
    status: 'Confirmed',
    reason: 'Follow-up consultation',
    appointmentType: 'In-person',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'apt3',
    doctor: mockDoctors[4],
    appointmentDate: new Date(Date.now() - 86400000).toISOString(),
    timeSlot: '02:00 PM',
    status: 'Completed',
    reason: 'Knee pain assessment',
    appointmentType: 'In-person',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const mockDepartments = [
  {
    id: 'dept1',
    name: 'Cardiology',
    icon: '🫀',
    description: 'Heart & cardiovascular care',
    doctorCount: 8,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'dept2',
    name: 'Neurology',
    icon: '🧠',
    description: 'Brain & nervous system',
    doctorCount: 6,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'dept3',
    name: 'Pediatrics',
    icon: '👶',
    description: 'Child healthcare',
    doctorCount: 10,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'dept4',
    name: 'Orthopedics',
    icon: '🦴',
    description: 'Bone & joint care',
    doctorCount: 7,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'dept5',
    name: 'Dermatology',
    icon: '🧴',
    description: 'Skin care & treatment',
    doctorCount: 5,
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'dept6',
    name: 'General Medicine',
    icon: '⚕️',
    description: 'General health services',
    doctorCount: 12,
    color: 'from-emerald-500 to-cyan-500'
  }
];

export const mockPatients = [
  {
    _id: 'pat1',
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+94771234567',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    bloodType: 'O+',
    healthCardNumber: 'HC1234567890',
    age: 33
  }
];

export const mockAnalytics = {
  totalPatients: 1245,
  todayAppointments: 45,
  monthlyRevenue: 2500000,
  averageRating: 4.7,
  departmentActivity: [
    { name: 'Cardiology', value: 250 },
    { name: 'Neurology', value: 180 },
    { name: 'Pediatrics', value: 320 },
    { name: 'Orthopedics', value: 210 },
    { name: 'Dermatology', value: 150 },
    { name: 'General', value: 135 }
  ],
  monthlyPatients: [
    { month: 'Jan', patients: 150 },
    { month: 'Feb', patients: 180 },
    { month: 'Mar', patients: 220 },
    { month: 'Apr', patients: 190 },
    { month: 'May', patients: 240 },
    { month: 'Jun', patients: 280 }
  ],
  revenueByDepartment: [
    { name: 'Cardiology', revenue: 450000 },
    { name: 'Neurology', revenue: 380000 },
    { name: 'Pediatrics', revenue: 320000 },
    { name: 'Orthopedics', revenue: 410000 },
    { name: 'Dermatology', revenue: 290000 },
    { name: 'General', revenue: 350000 }
  ]
};

export const mockTimeSlots = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export const mockPayments = [
  {
    id: 'pay1',
    appointmentId: 'apt1',
    amount: 5000,
    status: 'Pending',
    date: new Date().toISOString(),
    method: null
  },
  {
    id: 'pay2',
    appointmentId: 'apt3',
    amount: 7500,
    status: 'Paid',
    date: new Date(Date.now() - 86400000).toISOString(),
    method: 'Card'
  }
];
