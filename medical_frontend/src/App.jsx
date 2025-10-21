import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
// import { Toaster } from 'react-hot-toast'; // TODO: Install react-hot-toast

// Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Components
import SelectService from './components/SelectService';
import SelectDoctor from './components/SelectDoctor';
import SelectSlot from './components/SelectSlot';
import ConfirmBooking from './components/ConfirmBooking.jsx';

// Pages
import Home from './pages/Home';
import PatientDashboard from './pages/PatientDashboardNew';
import AdminDashboard from './pages/AdminDashboard';
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

// Role-based Protected Route
const RoleRoute = ({ roles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user || (roles && !roles.includes(user.role))) {
    return <Navigate to="/" />;
  }

  return children;
};

// Layout with Navbar, Sidebar and Footer (matching wireframe structure)
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Header - Fixed Top */}
      <Navbar />
      
      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar (Left Navigation) - Fixed */}
        <Sidebar />
        
        {/* Main Content - Scrollable */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes - No Layout */}
      <Route path="/login" element={
        <div className="auth-page">
          <Login />
        </div>
      } />
      <Route path="/register" element={
        <div className="auth-page">
          <Register />
        </div>
      } />
      
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

      {/* Doctor Dashboard */}
      <Route path="/doctor-dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Home />
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
      
      {/* Admin Dashboard */}
      <Route path="/admin" element={
        <RoleRoute roles={["admin", "manager"]}>
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        </RoleRoute>
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