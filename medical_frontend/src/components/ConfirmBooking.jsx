import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import api from '../services/api';

const ConfirmBooking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.post('/api/appointments', {
      patientId: 'dummy', // Replace with auth
      doctorId: state.doctorId,
      timeSlot: state.slot,
      date: '2025-10-20', // Hardcoded for now
      reason: 'Checkup',
    }).then(() => setMessage('Booking confirmed!'))
      .catch((err) => setMessage(`Error: ${err.response.data.error}`));
  }, [state]);

  return (
    <div>
      <h2>Confirmation</h2>
      {message && <Alert variant={message.includes('Error') ? 'danger' : 'success'}>{message}</Alert>}
      <Button onClick={() => navigate('/')}>Back to Home</Button>
    </div>
  );
};

export default ConfirmBooking;
