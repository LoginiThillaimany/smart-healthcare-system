import React from 'react';

const StatCard = ({ title, value, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-extrabold text-gray-900">{value}</span>
      <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{sub}</span>
    </div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage users, appointments, payments and reports</p>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="1,254" sub="+3%" />
        <StatCard title="Appointments (Today)" value="86" sub="+5%" />
        <StatCard title="Revenue (Month)" value="$42,310" sub="+8%" />
        <StatCard title="Refunds" value="$1,120" sub="-2%" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <button className="btn-primary">Manage Users</button>
            <button className="btn-secondary">View Appointments</button>
            <button className="btn-secondary">Payments</button>
            <button className="btn-secondary">Reports</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>API Status: <span className="badge badge-success">Operational</span></li>
            <li>DB Connections: <span className="badge badge-info">Healthy</span></li>
            <li>Error Rate: <span className="badge badge-warning">Low</span></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
