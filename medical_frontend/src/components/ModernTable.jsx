import React from 'react';
import { Link } from 'react-router-dom';

const ModernTable = ({ appointments, loading }) => {
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
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td><div className="h-4 w-24 skeleton rounded"></div></td>
                <td><div className="h-4 w-32 skeleton rounded"></div></td>
                <td><div className="h-4 w-20 skeleton rounded"></div></td>
                <td><div className="h-6 w-20 skeleton rounded-full"></div></td>
                <td><div className="h-4 w-16 skeleton rounded"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Doctor</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt, index) => (
            <tr 
              key={apt._id || index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Date */}
              <td>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  <span className="font-medium text-slate-700">
                    {formatDate(apt.appointmentDate)}
                  </span>
                </div>
              </td>

              {/* Doctor */}
              <td>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                    {apt.doctor?.firstName?.charAt(0)}{apt.doctor?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                    </div>
                    <div className="text-sm text-slate-500">
                      {apt.doctor?.specialty}
                    </div>
                  </div>
                </div>
              </td>

              {/* Time */}
              <td>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕐</span>
                  <span className="font-medium text-slate-700">{apt.timeSlot}</span>
                </div>
              </td>

              {/* Status */}
              <td>
                <span className={`badge ${statusStyles[apt.status] || 'badge-info'}`}>
                  {apt.status}
                </span>
              </td>

              {/* Actions */}
              <td>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/appointments/${apt._id}`}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors"
                  >
                    View
                  </Link>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModernTable;
