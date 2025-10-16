import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import api from '../services/api';

const SelectDoctor = () => {
  const { state } = useLocation();
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/doctors?specialty=${state.service}`).then((res) => setDoctors(res.data));
  }, [state.service]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/slots', { state: { ...state, doctorId: e.target.doctor.value } });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Select Doctor</Form.Label>
        <Form.Select name="doctor" required>
          <option value="">Select a doctor</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>{doc.name}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button type="submit" className="mt-3">Next</Button>
    </Form>
  );
};

export default SelectDoctor;
