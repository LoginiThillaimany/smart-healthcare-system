import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const initialForm = {
  // common
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  // staff-only
  nic: '',
  position: '',
  isActive: true,
  // doctor-only
  specialty: '',
  licenseNumber: '',
  consultationFee: '',
};

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('staff'); // 'staff' | 'doctor'

  // Dropdown sources
  const departments = [
    'Front Desk',
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Neurology',
    'Radiology',
    'Pharmacy',
    'Billing',
    'Administration',
  ];
  const positions = [
    'Receptionist',
    'Nurse',
    'Pharmacist',
    'Lab Technician',
    'Cashier',
    'Clerk',
    'Coordinator',
    'Supervisor',
    'Manager',
    'Doctor',
  ];

  const specialties = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'General',
    'Oncology',
    'Psychiatry',
  ];

  const load = async () => {
    try {
      setLoading(true);
      const [staffRes, doctorsRes] = await Promise.all([
        api.get('/v1/staff'),
        api.get('/v1/doctors'),
      ]);
      setStaff(staffRes.data.data || []);
      setDoctors(doctorsRes.data.data || doctorsRes.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});

    // Client-side validations (common)
    const errs = {};
    const phoneOk = /^(\+94|0)\d{9}$/.test(form.phone.trim());
    if (!phoneOk) errs.phone = 'Phone must be +94XXXXXXXXX or 0XXXXXXXXX';

    if (!departments.includes(form.department)) errs.department = 'Select a department';

    if (entityType === 'staff') {
      const nicOk = /^(\d{9}[VvXx]|\d{12})$/.test(form.nic.trim());
      if (!nicOk) errs.nic = 'NIC must be 12 digits or 9 digits followed by V/X';
      if (!positions.includes(form.position)) errs.position = 'Select a position';
    } else if (entityType === 'doctor') {
      if (!specialties.includes(form.specialty)) errs.specialty = 'Select a specialty';
      if (!form.licenseNumber?.trim()) errs.licenseNumber = 'License number is required';
      const fee = Number(form.consultationFee);
      if (!(fee > 0)) errs.consultationFee = 'Consultation fee must be a positive number';
    }

    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    try {
      if (editingId) {
        // Editing supports staff records for now
        await api.put(`/v1/staff/${editingId}`, form);
        setSuccess('Staff updated');
        alert('Successfully updated');
      } else {
        if (entityType === 'staff') {
          await api.post('/v1/staff', form);
          setSuccess('Staff created');
          alert('Successfully saved');
        } else {
          // Create doctor
          const payload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            department: form.department,
            specialty: form.specialty,
            licenseNumber: form.licenseNumber,
            consultationFee: Number(form.consultationFee),
          };
          await api.post('/v1/doctors', payload);
          setSuccess('Doctor created');
          alert('Successfully saved');
        }
      }
      setForm(initialForm);
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed');
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      firstName: item.firstName || '',
      lastName: item.lastName || '',
      email: item.email || '',
      nic: item.nic || '',
      phone: item.phone || '',
      department: item.department || '',
      position: item.position || '',
      isActive: item.isActive ?? true,
    });
    setFieldErrors({});
  };

  const onToggleActive = async (item) => {
    const nextActive = !item.isActive;
    const action = nextActive ? 'Re-activate' : 'Deactivate';
    if (!confirm(`${action} this staff member?`)) return;
    try {
      await api.put(`/v1/staff/${item._id}`, { isActive: nextActive });
      setSuccess(nextActive ? 'Staff re-activated' : 'Staff deactivated');
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Admin can create, update, and remove hospital staff</p>
        </div>
        <Link to="/admin" className="btn-secondary">Back to Admin</Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{editingId ? 'Edit Staff' : `Create ${entityType === 'staff' ? 'Staff' : 'Doctor'}`}</h2>
            {!editingId && (
              <div className="flex items-center gap-3">
                <label className="text-sm">Type</label>
                <select value={entityType} onChange={(e) => { setEntityType(e.target.value); setForm(initialForm); setFieldErrors({}); }} className="input-field">
                  <option value="staff">Staff</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input name="firstName" value={form.firstName} onChange={onChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={onChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Email (username)</label>
              <input type="email" name="email" value={form.email} onChange={onChange} className="input-field" required />
            </div>
            {entityType === 'staff' && (
              <div>
                <label className="label">NIC (password)</label>
                <input name="nic" value={form.nic} onChange={onChange} className={`input-field ${fieldErrors.nic ? 'border-red-300' : ''}`} required />
                {fieldErrors.nic && <p className="text-xs text-red-600 mt-1">{fieldErrors.nic}</p>}
              </div>
            )}
            <div>
              <label className="label">Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} className={`input-field ${fieldErrors.phone ? 'border-red-300' : ''}`} required />
              {fieldErrors.phone && <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>}
            </div>
            <div>
              <label className="label">Department</label>
              <select name="department" value={form.department} onChange={onChange} className={`input-field ${fieldErrors.department ? 'border-red-300' : ''}`} required>
                <option value="">Select department</option>
                {departments.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
              {fieldErrors.department && <p className="text-xs text-red-600 mt-1">{fieldErrors.department}</p>}
            </div>
            {entityType === 'staff' && (
              <div>
                <label className="label">Position</label>
                <select name="position" value={form.position} onChange={onChange} className={`input-field ${fieldErrors.position ? 'border-red-300' : ''}`} required>
                  <option value="">Select position</option>
                  {positions.map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
                {fieldErrors.position && <p className="text-xs text-red-600 mt-1">{fieldErrors.position}</p>}
              </div>
            )}
            {entityType === 'doctor' && (
              <>
                <div>
                  <label className="label">Specialty</label>
                  <select name="specialty" value={form.specialty} onChange={onChange} className={`input-field ${fieldErrors.specialty ? 'border-red-300' : ''}`} required>
                    <option value="">Select specialty</option>
                    {specialties.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                  {fieldErrors.specialty && <p className="text-xs text-red-600 mt-1">{fieldErrors.specialty}</p>}
                </div>
                <div>
                  <label className="label">License Number (password)</label>
                  <input name="licenseNumber" value={form.licenseNumber} onChange={onChange} className={`input-field ${fieldErrors.licenseNumber ? 'border-red-300' : ''}`} required />
                  {fieldErrors.licenseNumber && <p className="text-xs text-red-600 mt-1">{fieldErrors.licenseNumber}</p>}
                </div>
                <div>
                  <label className="label">Consultation Fee (LKR)</label>
                  <input type="number" min="0" step="1" name="consultationFee" value={form.consultationFee} onChange={onChange} className={`input-field ${fieldErrors.consultationFee ? 'border-red-300' : ''}`} required />
                  {fieldErrors.consultationFee && <p className="text-xs text-red-600 mt-1">{fieldErrors.consultationFee}</p>}
                </div>
              </>
            )}
            <div className="flex items-center gap-2 mt-6">
              <input id="isActive" type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
              <label htmlFor="isActive">Active</label>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(initialForm); }}>Cancel</button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Username is the email. For Staff, password is NIC. For Doctors, password is License Number.
          </p>
        </form>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Staff</h2>
            <div className="flex items-center gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, NIC, phone, department, position"
                className="input-field w-72"
              />
              <button onClick={load} className="btn-secondary">Refresh</button>
            </div>
          </div>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : staff.length === 0 ? (
            <p className="text-gray-500">No staff found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">NIC</th>
                    <th className="py-2 pr-4">Department</th>
                    <th className="py-2 pr-4">Position</th>
                    <th className="py-2 pr-4">Phone</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">End Date</th>
                    <th className="py-2 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {staff
                    .filter((s) => {
                      const q = search.trim().toLowerCase();
                      if (!q) return true;
                      const hay = [
                        s.firstName,
                        s.lastName,
                        s.email,
                        s.nic,
                        s.phone,
                        s.department,
                        s.position,
                      ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();
                      return hay.includes(q);
                    })
                    .map((s) => (
                    <tr key={s._id} className="border-t border-gray-100">
                      <td className="py-2 pr-4">{s.firstName} {s.lastName}</td>
                      <td className="py-2 pr-4">{s.email}</td>
                      <td className="py-2 pr-4">{s.nic}</td>
                      <td className="py-2 pr-4">{s.department}</td>
                      <td className="py-2 pr-4">{s.position}</td>
                      <td className="py-2 pr-4">{s.phone}</td>
                      <td className="py-2 pr-4">
                        <span className={"text-xs px-2 py-1 rounded-full border " + (s.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200')}>
                          {s.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{s.endDate ? new Date(s.endDate).toLocaleDateString() : '—'}</td>
                      <td className="py-2 pr-4 flex gap-2">
                        <button className="btn-secondary" onClick={() => onEdit(s)}>Edit</button>
                        {s.isActive ? (
                          <button className="btn-danger" onClick={() => onToggleActive(s)}>Deactivate</button>
                        ) : (
                          <button className="btn-primary" onClick={() => onToggleActive(s)}>Re-activate</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {search && staff.filter((s) => {
                const q = search.trim().toLowerCase();
                const hay = [s.firstName, s.lastName, s.email, s.nic, s.phone, s.department, s.position]
                  .filter(Boolean).join(' ').toLowerCase();
                return hay.includes(q);
              }).length === 0 && (
                <p className="text-gray-500 p-3">No matching staff</p>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Doctors</h2>
            <button onClick={load} className="btn-secondary">Refresh</button>
          </div>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : doctors.length === 0 ? (
            <p className="text-gray-500">No doctors found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Specialty</th>
                    <th className="py-2 pr-4">License</th>
                    <th className="py-2 pr-4">Department</th>
                    <th className="py-2 pr-4">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((d) => (
                    <tr key={d._id} className="border-t border-gray-100">
                      <td className="py-2 pr-4">Dr. {d.firstName} {d.lastName}</td>
                      <td className="py-2 pr-4">{d.email}</td>
                      <td className="py-2 pr-4">{d.specialty}</td>
                      <td className="py-2 pr-4">{d.licenseNumber}</td>
                      <td className="py-2 pr-4">{d.department || '—'}</td>
                      <td className="py-2 pr-4">{d.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
