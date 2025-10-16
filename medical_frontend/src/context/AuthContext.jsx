import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('user');
    const storedPatient = localStorage.getItem('patient');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      if (storedPatient) {
        setPatient(JSON.parse(storedPatient));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user: userData, patient: patientData } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (patientData) {
        localStorage.setItem('patient', JSON.stringify(patientData));
        setPatient(patientData);
      }

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);

      const { token, user: userData, patient: patientData } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (patientData) {
        localStorage.setItem('patient', JSON.stringify(patientData));
        setPatient(patientData);
      }

      setUser(userData);
      return { success: true, healthCardNumber: patientData?.healthCardNumber };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('patient');
    setUser(null);
    setPatient(null);
  };

  const value = {
    user,
    patient,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
