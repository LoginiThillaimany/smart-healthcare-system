import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <span className="text-6xl mb-4 block">❌</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Not Found</h2>
          <Link to="/" className="btn-primary inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'In-Progress': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center mb-4">
            <span className="mr-2">←</span> Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Appointment Details</h1>
              <p className="text-gray-600 mt-1">View and manage your appointment</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <p className="text-green-700">{success}</p>
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
            {/* Doctor Information */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Doctor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Doctor Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Specialty</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {appointment.doctor?.specialty || 'General'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hospital</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {appointment.doctor?.hospitalAffiliation || 'General Hospital'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {appointment.doctor?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Appointment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="text-lg font-semibold text-gray-900">{appointment.timeSlot}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Reason for Visit</p>
                  <p className="text-lg text-gray-900">{appointment.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-lg font-semibold text-gray-900">{appointment.appointmentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Booking Date</p>
                  <p className="text-lg text-gray-900">
                    {new Date(appointment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                  <>
                    <button onClick={() => setIsEditing(true)} className="btn-primary">
                      ✏️ Edit Appointment
                    </button>
                    <button onClick={handleCancel} className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-all font-semibold">
                      🚫 Cancel Appointment
                    </button>
                  </>
                )}
                <button onClick={handleDelete} className="btn-danger">
                  🗑️ Delete Appointment
                </button>
                <Link to="/payment" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all font-semibold">
                  💳 Make Payment
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
