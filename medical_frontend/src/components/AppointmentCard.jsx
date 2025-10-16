import React from 'react';
import { Link } from 'react-router-dom';

const AppointmentCard = ({ appointment }) => {
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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-emerald-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 medical-gradient rounded-xl flex items-center justify-center text-white text-xl">
            👨‍⚕️
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
            </h4>
            <p className="text-sm text-gray-600">{appointment.doctor?.specialty || 'General'}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(appointment.appointmentDate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{appointment.timeSlot}</span>
        </div>
        {appointment.reason && (
          <div className="flex items-start text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="flex-1">{appointment.reason}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Link
          to={`/appointments/${appointment._id}`}
          className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all text-center"
        >
          View Details
        </Link>
        {appointment.status === 'Scheduled' && (
          <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all">
            Reschedule
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
