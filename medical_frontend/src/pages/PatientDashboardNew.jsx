import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // New item states for CRUD
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const patientId = JSON.parse(localStorage.getItem('patient') || '{}').id;
      if (!patientId) {
        navigate('/login');
        return;
      }

      const response = await api.get(`/patients/${patientId}`);
      const data = response.data.data;
      setPatient(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        email: data.email || '',
        dateOfBirth: data.dateOfBirth?.split('T')[0] || '',
        bloodType: data.bloodType || '',
        address: data.address || {},
        emergencyContact: data.emergencyContact || {}
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError('Failed to load patient data');
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const patientId = patient._id;
      await api.put(`/patients/${patientId}`, formData);
      setSuccess('Profile updated successfully!');
      alert('Successfully changed');
      setIsEditing(false);
      fetchPatientData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleAddAllergy = async () => {
    if (!newAllergy.trim()) return;

    try {
      const updatedAllergies = [...(patient.allergies || []), newAllergy];
      await api.put(`/patients/${patient._id}`, { allergies: updatedAllergies });
      setSuccess('Allergy added successfully!');
      setNewAllergy('');
      fetchPatientData();
    } catch (err) {
      setError('Failed to add allergy');
    }
  };

  const handleRemoveAllergy = async (allergy) => {
    try {
      const updatedAllergies = patient.allergies.filter(a => a !== allergy);
      await api.put(`/patients/${patient._id}`, { allergies: updatedAllergies });
      setSuccess('Allergy removed successfully!');
      fetchPatientData();
    } catch (err) {
      setError('Failed to remove allergy');
    }
  };

  const handleAddCondition = async () => {
    if (!newCondition.trim()) return;

    try {
      const updatedConditions = [...(patient.chronicConditions || []), newCondition];
      await api.put(`/patients/${patient._id}`, { chronicConditions: updatedConditions });
      setSuccess('Condition added successfully!');
      setNewCondition('');
      fetchPatientData();
    } catch (err) {
      setError('Failed to add condition');
    }
  };

  const handleRemoveCondition = async (condition) => {
    try {
      const updatedConditions = patient.chronicConditions.filter(c => c !== condition);
      await api.put(`/patients/${patient._id}`, { chronicConditions: updatedConditions });
      setSuccess('Condition removed successfully!');
      fetchPatientData();
    } catch (err) {
      setError('Failed to remove condition');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <span className="text-6xl mb-4 block">❌</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Data Not Found</h2>
          <Link to="/login" className="btn-primary inline-block">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'medical', name: 'Medical Info', icon: '🏥' },
    { id: 'history', name: 'Medical History', icon: '📋' },
    { id: 'prescriptions', name: 'Prescriptions', icon: '💊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center">
              <span className="mr-2">←</span> Back to Dashboard
            </Link>
            <button
              onClick={() => navigate('/login')}
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Header Card */}
        <div className="card mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl">
              {patient.profilePhoto ? (
                <img src={patient.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{patient.fullName}</h1>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm opacity-90">
                <div>
                  <p>Health Card</p>
                  <p className="font-semibold">{patient.healthCardNumber}</p>
                </div>
                <div>
                  <p>Blood Type</p>
                  <p className="font-semibold">{patient.bloodType || 'Not specified'}</p>
                </div>
                <div>
                  <p>Age</p>
                  <p className="font-semibold">{patient.age} years</p>
                </div>
                <div>
                  <p>Gender</p>
                  <p className="font-semibold">{patient.gender}</p>
                </div>
              </div>
            </div>
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

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn-primary">
                    ✏️ Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Blood Type</label>
                      <select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                        className="input-field"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Street"
                          value={formData.address?.street || ''}
                          onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.address?.city || ''}
                          onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={formData.address?.state || ''}
                          onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Zip Code"
                          value={formData.address?.zipCode || ''}
                          onChange={(e) => setFormData({...formData, address: {...formData.address, zipCode: e.target.value}})}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={formData.emergencyContact?.name || ''}
                          onChange={(e) => setFormData({...formData, emergencyContact: {...formData.emergencyContact, name: e.target.value}})}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Relationship"
                          value={formData.emergencyContact?.relationship || ''}
                          onChange={(e) => setFormData({...formData, emergencyContact: {...formData.emergencyContact, relationship: e.target.value}})}
                          className="input-field"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={formData.emergencyContact?.phone || ''}
                          onChange={(e) => setFormData({...formData, emergencyContact: {...formData.emergencyContact, phone: e.target.value}})}
                          className="input-field"
                        />
                      </div>
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-semibold text-gray-900">{patient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-lg font-semibold text-gray-900">{patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {patient.address ? `${patient.address.street}, ${patient.address.city}` : 'Not provided'}
                    </p>
                  </div>
                  {patient.emergencyContact?.name && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Emergency Contact</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Medical Info Tab */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              {/* Allergies */}
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Allergies</h2>
                
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add new allergy"
                    className="input-field flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                  />
                  <button onClick={handleAddAllergy} className="btn-primary">
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {patient.allergies && patient.allergies.length > 0 ? (
                    patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-full flex items-center space-x-2"
                      >
                        <span>{allergy}</span>
                        <button
                          onClick={() => handleRemoveAllergy(allergy)}
                          className="text-red-600 hover:text-red-900"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No allergies recorded</p>
                  )}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Chronic Conditions</h2>
                
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Add new condition"
                    className="input-field flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                  />
                  <button onClick={handleAddCondition} className="btn-primary">
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                    patient.chronicConditions.map((condition, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full flex items-center space-x-2"
                      >
                        <span>{condition}</span>
                        <button
                          onClick={() => handleRemoveCondition(condition)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No chronic conditions recorded</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === 'history' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical History</h2>
              
              {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                <div className="space-y-4">
                  {patient.medicalHistory.map((record, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-600">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                          <h3 className="text-lg font-semibold text-gray-900 mt-1">
                            {record.condition}
                          </h3>
                          <p className="text-gray-700 mt-2">{record.treatment}</p>
                          {record.doctor && (
                            <p className="text-sm text-gray-600 mt-2">
                              Dr. {record.doctor.firstName} {record.doctor.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <span className="text-6xl block mb-4">📋</span>
                  <p>No medical history recorded</p>
                </div>
              )}
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Prescriptions</h2>
              
              {patient.prescriptions && patient.prescriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patient.prescriptions.map((prescription, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prescription.medication}
                        </h3>
                        <span className="text-sm text-gray-600">
                          💊
                        </span>
                      </div>
                      <p className="text-gray-700 mb-1">
                        <strong>Dosage:</strong> {prescription.dosage}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <strong>Duration:</strong> {prescription.duration}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Prescribed: {new Date(prescription.date).toLocaleDateString()}
                      </p>
                      {prescription.doctor && (
                        <p className="text-sm text-gray-600">
                          By: Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <span className="text-6xl block mb-4">💊</span>
                  <p>No prescriptions recorded</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
