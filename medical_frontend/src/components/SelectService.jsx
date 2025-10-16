import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const SelectService = () => {
  const [service, setService] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/doctors', { state: { service } });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Select Service</Form.Label>
        <Form.Select value={service} onChange={(e) => setService(e.target.value)} required>
          <option value="">Select a service</option>
          <option value="Cardiology">Cardiology</option>
          <option value="General">General Physician</option>
        </Form.Select>
      </Form.Group>
      <Button type="submit" className="mt-3">Next</Button>
    </Form>
  );
};

export default SelectService;
