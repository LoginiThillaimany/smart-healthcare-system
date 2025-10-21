import React from 'react';
import { Link } from 'react-router-dom';

const ModernAppointmentCard = ({ appointment, index = 0 }) => {
  const { _id, doctor, appointmentDate, timeSlot, status, reason, appointmentType } = appointment;

  const statusStyles = {
    'Scheduled': 'badge-info',
    'Confirmed': 'badge-success',
    'Completed': 'bg-slate-100 text-slate-700 border-slate-300',
    'Cancelled': 'badge-danger',
    'In-Progress': 'badge-warning'
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

  // Get doctor initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  return (
    <div 
      className="card animate-slide-up group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header with Doctor Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Doctor Avatar */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {getInitials(doctor?.firstName, doctor?.lastName)}
          </div>
        </div>

        {/* Doctor Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">
            Dr. {doctor?.firstName} {doctor?.lastName}
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            {doctor?.specialty || 'General Physician'}
          </p>
        </div>

        {/* Status Badge */}
        <span className={`badge ${statusStyles[status] || 'badge-info'}`}>
          {status}
        </span>
      </div>

      {/* Appointment Details */}
      <div className="space-y-3 mb-4">
        {/* Date & Time */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">📅</span>
            <span className="font-medium text-slate-700">{formatDate(appointmentDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🕐</span>
            <span className="font-medium text-slate-700">{timeSlot}</span>
          </div>
        </div>

        {/* Reason */}
        {reason && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-lg">📝</span>
            <p className="text-slate-600 flex-1">{reason}</p>
          </div>
        )}

        {/* Type */}
        {appointmentType && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">{appointmentType === 'In-person' ? '🏥' : '💻'}</span>
            <span className="text-slate-600">{appointmentType}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-slate-100">
        <Link
          to={`/appointments/${_id}`}
          className="flex-1 btn-primary text-center text-sm py-2.5 group-hover:shadow-lg transition-all"
        >
          View Details
        </Link>
        <button className="px-4 py-2.5 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:border-emerald-500 hover:bg-emerald-50 transition-all">
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default ModernAppointmentCard;
