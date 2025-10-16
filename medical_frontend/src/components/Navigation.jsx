import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          🏥 Smart Healthcare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/patient-dashboard">Patient Info</Nav.Link>
            <Nav.Link as={Link} to="/book-appointment">Book Appointment</Nav.Link>
            <Nav.Link as={Link} to="/payment">Payment</Nav.Link>
            <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
