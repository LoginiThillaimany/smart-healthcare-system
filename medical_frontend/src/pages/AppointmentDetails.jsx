import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await api.get(`/appointments/${id}`);
      setAppointment(response.data.data);
      setFormData({
        appointmentDate: response.data.data.appointmentDate?.split('T')[0],
        timeSlot: response.data.data.timeSlot,
        reason: response.data.data.reason,
        status: response.data.data.status
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointment details');
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.put(`/appointments/${id}`, formData);
      setSuccess('Appointment updated successfully!');
      setIsEditing(false);
      fetchAppointment();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appointment');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.put(`/appointments/${id}/cancel`, {
        cancellationReason: 'Cancelled by patient'
      });
      setSuccess('Appointment cancelled successfully!');
      fetchAppointment();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) return;

    try {
      await api.delete(`/appointments/${id}`);
      alert('Appointment deleted successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete appointment');
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="h-8 w-48 skeleton rounded mb-2"></div>
          <div className="h-4 w-64 skeleton rounded"></div>
        </div>
        <div className="space-y-6">
          <div className="card">
            <div className="h-6 w-40 skeleton rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-20 skeleton rounded"></div>
              <div className="h-20 skeleton rounded"></div>
              <div className="h-20 skeleton rounded"></div>
              <div className="h-20 skeleton rounded"></div>
            </div>
          </div>
          <div className="card">
            <div className="h-6 w-40 skeleton rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-20 skeleton rounded"></div>
              <div className="h-20 skeleton rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex items-center justify-center py-20 animate-fade-in">
        <div className="card max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Appointment Not Found</h2>
          <p className="text-slate-600 mb-6">The appointment you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <span>←</span>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'badge-info',
      'Confirmed': 'badge-success',
      'Completed': 'bg-slate-100 text-slate-700 border-slate-300',
      'Cancelled': 'badge-danger',
      'In-Progress': 'badge-warning'
    };
    return colors[status] || 'badge-info';
  };

  return (
    <div className="animate-fade-in">
      {/* Modern Header */}
      <div className="mb-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-6 transition-colors group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Dashboard</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">📋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Appointment Details</h1>
              <p className="text-slate-600 text-lg">View and manage your healthcare appointment</p>
            </div>
          </div>
          <span className={`badge ${getStatusColor(appointment.status)} whitespace-nowrap self-start md:self-auto`}>
            {appointment.status}
          </span>
        </div>
      </div>

      {/* Modern Alert Messages */}
      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-5 rounded-xl animate-slide-up">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Error</h4>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-100 border-l-4 border-emerald-500 p-5 rounded-xl animate-slide-up">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h4 className="font-semibold text-emerald-900 mb-1">Success</h4>
              <p className="text-emerald-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {isEditing ? (
        /* Edit Form */
        <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Appointment</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Appointment Date</label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Time Slot</label>
                  <input
                    type="time"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Reason for Visit</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="input-field"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="input-field"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* View Details */
          <div className="space-y-6">
            {/* Modern Doctor Information Card */}
            <div className="card group hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Doctor Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Doctor Name</p>
                  <p className="text-xl font-bold text-slate-900">
                    Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Specialty</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🩺</span>
                    <p className="text-xl font-bold text-slate-900">
                      {appointment.doctor?.specialty || 'General'}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Hospital</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏥</span>
                    <p className="text-lg font-semibold text-slate-900">
                      {appointment.doctor?.hospitalAffiliation || 'General Hospital'}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Contact</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    <p className="text-lg font-semibold text-emerald-600">
                      {appointment.doctor?.phone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Appointment Details Card */}
            <div className="card group hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Appointment Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Date</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📆</span>
                    <p className="text-lg font-bold text-slate-900">
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Time</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🕐</span>
                    <p className="text-lg font-bold text-slate-900">{appointment.timeSlot}</p>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Reason for Visit</p>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">📝</span>
                    <p className="text-lg text-slate-900">{appointment.reason}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Type</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{appointment.appointmentType === 'In-person' ? '🏥' : '💻'}</span>
                    <p className="text-lg font-semibold text-slate-900">{appointment.appointmentType}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Booking Date</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📌</span>
                    <p className="text-lg text-slate-600">
                      {new Date(appointment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Actions Card */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        <span className="text-xl">✏️</span>
                        <span>Edit Appointment</span>
                      </div>
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        <span className="text-xl">🚫</span>
                        <span>Cancel Appointment</span>
                      </div>
                    </button>
                  </>
                )}
                <button 
                  onClick={handleDelete} 
                  className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-red-500 to-pink-600 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <span className="text-xl">🗑️</span>
                    <span>Delete Appointment</span>
                  </div>
                </button>
                <Link 
                  to="/payment" 
                  className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center gap-2">
                    <span className="text-xl">💳</span>
                    <span>Make Payment</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AppointmentDetails;
