import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user name from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const patient = JSON.parse(localStorage.getItem('patient') || '{}');
    setUserName(patient.fullName || user.email || 'Guest');

    // Fetch upcoming appointments
    api.get('/appointments?status=Scheduled')
      .then(res => {
        const upcoming = res.data.data?.slice(0, 3) || [];
        setUpcomingAppointments(upcoming);
        setAllAppointments(res.data.data || []);
      })
      .catch(err => console.error('Error fetching appointments:', err));
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-emerald-100 text-emerald-800',
      'Confirmed': 'bg-teal-100 text-teal-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'In-Progress': 'bg-cyan-100 text-cyan-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {userName}! Here's your health overview.</p>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/book-appointment" className="card hover:scale-105 transform transition-all medical-gradient text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Book New</p>
                <h3 className="text-xl font-bold">Appointment</h3>
              </div>
              <span className="text-3xl">📅</span>
            </div>
          </Link>

          <Link to="/patient-dashboard" className="card hover:scale-105 transform transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">View Your</p>
                <h3 className="text-xl font-bold text-gray-900">Profile</h3>
              </div>
              <span className="text-3xl">👤</span>
            </div>
          </Link>

          <Link to="/payment" className="card hover:scale-105 transform transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Make</p>
                <h3 className="text-xl font-bold text-gray-900">Payment</h3>
              </div>
              <span className="text-3xl">💳</span>
            </div>
          </Link>

          <Link to="/reports" className="card hover:scale-105 transform transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">View</p>
                <h3 className="text-xl font-bold text-gray-900">Reports</h3>
              </div>
              <span className="text-3xl">📊</span>
            </div>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt, idx) => (
                <div key={apt._id || idx} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        {formatDate(apt.appointmentDate)}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900 mt-1">
                        Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {apt.doctor?.specialty || 'General'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                    <span className="mr-2">🕐</span>
                    <span>{apt.timeSlot}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 card text-center py-12">
                <span className="text-6xl mb-4 block">📅</span>
                <p className="text-gray-600 mb-4">No upcoming appointments</p>
                <Link to="/book-appointment" className="btn-primary inline-block">
                  Book Your First Appointment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* All Appointments Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Appointments</h2>
            <Link to="/book-appointment" className="btn-primary">
              + Book New Appointment
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allAppointments.length > 0 ? (
                  allAppointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(apt.appointmentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {apt.doctor?.specialty}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {apt.doctor?.hospitalAffiliation || 'General Hospital'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link to={`/appointments/${apt._id}`} className="text-blue-600 hover:text-blue-900" title="View Details">
                            👁️ View
                          </Link>
                          <Link to={`/appointments/${apt._id}`} className="text-gray-600 hover:text-gray-900" title="Edit">
                            ✏️ Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <span className="text-4xl block mb-3">📋</span>
                        <p>No appointments found</p>
                        <Link to="/book-appointment" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                          Book your first appointment →
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Need help? <Link to="/support" className="text-emerald-600 hover:text-emerald-700">Contact Support</Link>
        </p>
      </div>
    </div>
  );
};

export default Home;