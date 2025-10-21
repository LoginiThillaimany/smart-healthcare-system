import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const patientMenuItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/book-appointment', icon: '📅', label: 'Book Appointment' },
    { path: '/my-appointments', icon: '📋', label: 'My Appointments' },
    { path: '/patient-dashboard', icon: '👤', label: 'Profile' },
    { path: '/payment', icon: '💳', label: 'Payments' },
    { path: '/reports', icon: '📊', label: 'Reports' },
  ];

  const doctorMenuItems = [
    { path: '/doctor-dashboard', icon: '🏥', label: 'Dashboard' },
    { path: '/patients', icon: '👥', label: 'Patients' },
    { path: '/schedule', icon: '📅', label: 'Schedule' },
    { path: '/reports', icon: '📊', label: 'Reports' },
  ];

  const managerMenuItems = [
    { path: '/admin', icon: '🛠️', label: 'Admin Dashboard' },
    { path: '/analytics', icon: '📈', label: 'Analytics' },
    { path: '/reports', icon: '📊', label: 'Reports' },
    { path: '/staff', icon: '👔', label: 'Staff Management' },
    { path: '/departments', icon: '🏢', label: 'Departments' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'doctor':
        return doctorMenuItems;
      case 'manager':
      case 'admin':
        return managerMenuItems;
      default:
        return patientMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r-2 border-gray-200 min-h-full sticky top-0 hidden lg:block">
      <nav className="p-8 space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive(item.path)
                ? 'medical-gradient text-white shadow-lg transform scale-105'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Quick Stats Card */}
      <div className="mx-4 mt-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Appointments</span>
            <span className="font-semibold text-emerald-600">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed</span>
            <span className="font-semibold text-teal-600">8</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pending</span>
            <span className="font-semibold text-cyan-600">4</span>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mx-4 mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-2xl">💡</span>
          <h4 className="text-sm font-semibold text-gray-700">Need Help?</h4>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Contact our support team 24/7
        </p>
        <button className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all">
          Get Support
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
