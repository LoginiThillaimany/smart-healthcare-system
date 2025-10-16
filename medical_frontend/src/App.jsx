import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
// import { Toaster } from 'react-hot-toast'; // TODO: Install react-hot-toast

// Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Components
import SelectService from './components/SelectService';
import SelectDoctor from './components/SelectDoctor';
import SelectSlot from './components/SelectSlot';
import ConfirmBooking from './components/ConfirmBooking.jsx';

// Pages
import Home from './pages/Home';
import PatientDashboard from './pages/PatientDashboardNew';
import Payment from './pages/Payment';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import AppointmentDetails from './pages/AppointmentDetails';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Layout with Navbar and Sidebar
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes with Dashboard Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/patient-dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <PatientDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/payment" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Payment />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/appointments/:id" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AppointmentDetails />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Appointment Booking Flow */}
      <Route path="/book-appointment" element={
        <ProtectedRoute>
          <DashboardLayout>
            <SelectService />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/doctors" element={
        <ProtectedRoute>
          <DashboardLayout>
            <SelectDoctor />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/slots" element={
        <ProtectedRoute>
          <DashboardLayout>
            <SelectSlot />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/confirm" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ConfirmBooking />
          </DashboardLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        {/* TODO: Add Toaster after installing react-hot-toast
        <Toaster position="top-right" toastOptions={{...}} />
        */}
      </AuthProvider>
    </Router>
  );
}

export default App;