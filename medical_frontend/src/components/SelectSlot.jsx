import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import api from '../services/api';

const SelectSlot = () => {
  const { state } = useLocation();
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/slots?doctorId=${state.doctorId}&date=2025-10-20`).then((res) => setSlots(res.data)); // Hardcoded date for now
  }, [state.doctorId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/confirm', { state: { ...state, slot: e.target.slot.value } });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Select Time Slot</Form.Label>
        <Form.Select name="slot" required>
          <option value="">Select a slot</option>
          {slots.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button type="submit" className="mt-3">Confirm</Button>
    </Form>
  );
};

export default SelectSlot;
