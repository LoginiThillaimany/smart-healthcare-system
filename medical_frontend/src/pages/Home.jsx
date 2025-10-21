import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ModernStatCard from '../components/ModernStatCard';
import ModernAppointmentCard from '../components/ModernAppointmentCard';
import ModernTable from '../components/ModernTable';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Home = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user name from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const patient = JSON.parse(localStorage.getItem('patient') || '{}');
    setUserName(patient.fullName || user.email || 'Guest');

    // Fetch appointments with loading state
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/appointments');
        const appointments = res.data.data || [];
        
        // Calculate stats
        setStats({
          totalAppointments: appointments.length,
          upcoming: appointments.filter(a => a.status === 'Scheduled' || a.status === 'Confirmed').length,
          completed: appointments.filter(a => a.status === 'Completed').length,
          cancelled: appointments.filter(a => a.status === 'Cancelled').length
        });
        
        // Set appointments
        const upcoming = appointments
          .filter(a => a.status === 'Scheduled' || a.status === 'Confirmed')
          .slice(0, 3);
        setUpcomingAppointments(upcoming);
        setAllAppointments(appointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setTimeout(() => setLoading(false), 800); // Smooth loading transition
      }
    };
    
    fetchData();
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
    <div className="animate-fade-in">
      {/* Modern Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <span className="text-2xl">👋</span>
          </div>
          <div>
            <h1 className="page-header mb-0">Welcome back, {userName}!</h1>
            <p className="page-subheader">Here's your health overview for today</p>
          </div>
        </div>
      </div>
      
      {/* Modern Stat Cards with Animated Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {loading ? (
          <LoadingSkeleton type="stat" count={4} />
        ) : (
          <>
            <ModernStatCard
              icon="📋"
              label="Total Appointments"
              value={stats.totalAppointments}
              change={12}
              trend="up"
              color="emerald"
              delay={0}
            />
            <ModernStatCard
              icon="📅"
              label="Upcoming"
              value={stats.upcoming}
              change={8}
              trend="up"
              color="blue"
              delay={100}
            />
            <ModernStatCard
              icon="✅"
              label="Completed"
              value={stats.completed}
              change={15}
              trend="up"
              color="purple"
              delay={200}
            />
            <ModernStatCard
              icon="❌"
              label="Cancelled"
              value={stats.cancelled}
              change={5}
              trend="down"
              color="orange"
              delay={300}
            />
          </>
        )}
      </div>

      {/* Quick Actions - Modern Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link 
          to="/book-appointment" 
          className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 font-medium mb-1">Book New</p>
              <h3 className="text-xl font-bold">Appointment</h3>
            </div>
            <span className="text-4xl transform group-hover:scale-110 transition-transform">📅</span>
          </div>
        </Link>

        <Link 
          to="/patient-dashboard" 
          className="group glass-effect rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-slate-200 hover:border-emerald-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">View Your</p>
              <h3 className="text-xl font-bold text-slate-900">Profile</h3>
            </div>
            <span className="text-4xl transform group-hover:scale-110 transition-transform">👤</span>
          </div>
        </Link>

        <Link 
          to="/payment" 
          className="group glass-effect rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-slate-200 hover:border-emerald-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">Make</p>
              <h3 className="text-xl font-bold text-slate-900">Payment</h3>
            </div>
            <span className="text-4xl transform group-hover:scale-110 transition-transform">💳</span>
          </div>
        </Link>

        <Link 
          to="/reports" 
          className="group glass-effect rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-slate-200 hover:border-emerald-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">View</p>
              <h3 className="text-xl font-bold text-slate-900">Reports</h3>
            </div>
            <span className="text-4xl transform group-hover:scale-110 transition-transform">📊</span>
          </div>
        </Link>
      </div>

      {/* Upcoming Appointments - Modern Cards */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Upcoming Appointments</h2>
            <p className="text-slate-600">Your scheduled healthcare visits</p>
          </div>
          <Link to="/book-appointment" className="btn-secondary">
            + New Appointment
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <LoadingSkeleton type="appointment" count={3} />
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((apt, idx) => (
              <ModernAppointmentCard 
                key={apt._id || idx}
                appointment={apt}
                index={idx}
              />
            ))
          ) : (
            <div className="col-span-3">
              <EmptyState
                icon="📅"
                title="No upcoming appointments"
                description="You don't have any scheduled appointments. Book one to get started with your healthcare journey."
                actionLabel="Book Your First Appointment"
                actionLink="/book-appointment"
              />
            </div>
          )}
        </div>
      </div>

      {/* All Appointments - Modern Table */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">All Appointments</h2>
            <p className="text-slate-600">Complete history of your visits</p>
          </div>
        </div>

        {loading ? (
          <div className="card">
            <LoadingSkeleton type="table" count={5} />
          </div>
        ) : allAppointments.length > 0 ? (
          <ModernTable appointments={allAppointments} loading={false} />
        ) : (
          <EmptyState
            icon="📋"
            title="No appointment history"
            description="Your appointment history will appear here once you schedule your first visit."
            actionLabel="Book Your First Appointment"
            actionLink="/book-appointment"
          />
        )}
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