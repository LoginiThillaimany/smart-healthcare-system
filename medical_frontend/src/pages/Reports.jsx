import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Nav, Badge } from 'react-bootstrap';
import api from '../services/api';
import './Reports.css';

const Reports = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch dashboard statistics
    api.get('/reports/dashboard')
      .then(res => setStats(res.data.data))
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  const sampleVisits = [
    { id: 'P001', visitDate: '2024-01-14', department: 'Cardiology', service: 'General', physician: 'Dr. Jones', status: 'Completed' },
    { id: 'P002', visitDate: '2024-01-13', department: 'Neurology', service: 'Appointment', physician: 'Dr. Smith', status: 'Completed' },
    { id: 'P003', visitDate: '2024-01-12', department: 'Emergency', service: 'Physical Therapy', physician: 'Dr. Brown', status: 'In Progress' },
    { id: 'P004', visitDate: '2024-01-11', department: 'Pediatrics', service: 'Screening', physician: 'Dr. Kumar', status: 'Completed' }
  ];

  return (
    <Container fluid className="reports-page">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Nav className="reports-nav">
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link href="/reports" active>Reports & Analytics</Nav.Link>
                <Nav.Link href="/schedule">Schedule Reports</Nav.Link>
              </Nav>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm">
                🔍
              </Button>
              <Button variant="outline-secondary" size="sm">
                🔔
              </Button>
              <div className="user-avatar">
                <img src="https://via.placeholder.com/32" alt="User" className="rounded-circle" />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Page Title and Actions */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h3>Comprehensive Patient Analytics Report</h3>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary">
                🔻 Filter Data
              </Button>
              <Button variant="outline-secondary">
                📊 Export PDF
              </Button>
              <Button variant="outline-secondary">
                📑 Export Excel
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-content">
                <div>
                  <h6 className="text-muted mb-2">Total Patient Visits</h6>
                  <h2 className="mb-1">{stats?.appointments?.total || '12,500'}</h2>
                  <small className="text-success">↑ 6% vs last period</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-content">
                <div>
                  <h6 className="text-muted mb-2">Avg. Patient Wait Time</h6>
                  <h2 className="mb-1">3.5</h2>
                  <small className="text-muted">minutes</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-content">
                <div>
                  <h6 className="text-muted mb-2">Patient Satisfaction</h6>
                  <h2 className="mb-1">92%</h2>
                  <small className="text-success">↑ 3% improvement</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-content">
                <div>
                  <h6 className="text-muted mb-2">Revenue Generated</h6>
                  <h2 className="mb-1">$1.2M</h2>
                  <small className="text-success">↑ 8% growth</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        {/* Patient Admissions Trend */}
        <Col md={6}>
          <Card className="chart-card">
            <Card.Body>
              <h6 className="mb-3">Patient Admissions Trend</h6>
              <div className="chart-placeholder" style={{height: '250px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div className="text-center">
                  <p className="text-muted">Line Chart</p>
                  <small>Shows increasing trend from ~80 to ~110 patients</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Service Utilization by Department */}
        <Col md={6}>
          <Card className="chart-card">
            <Card.Body>
              <h6 className="mb-3">Service Utilization by Department</h6>
              <div className="chart-placeholder" style={{height: '250px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div className="text-center">
                  <p className="text-muted">Bar Chart</p>
                  <small>Emergency, Cardiology, Pediatrics, Neurology, Orthopedics</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Second Charts Row */}
      <Row className="mb-4">
        {/* Patient Demographics */}
        <Col md={6}>
          <Card className="chart-card">
            <Card.Body>
              <h6 className="mb-3">Patient Demographics</h6>
              <div className="chart-placeholder" style={{height: '250px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div className="text-center">
                  <p className="text-muted">Pie Chart</p>
                  <small>Age groups: 0-18 years, 19-40 years, 41-60 years, 60+ years</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Physician Performance Metrics */}
        <Col md={6}>
          <Card className="chart-card">
            <Card.Body>
              <h6 className="mb-3">Physician Performance Metrics</h6>
              <div className="chart-placeholder" style={{height: '250px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div className="text-center">
                  <p className="text-muted">Grouped Bar Chart</p>
                  <small>Metrics for Doctors across different specialties</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Patient Visit Details Table */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h6 className="mb-3">Patient Visit Details</h6>
              <div className="table-responsive">
                <Table hover className="visits-table">
                  <thead className="table-light">
                    <tr>
                      <th>Patient ID</th>
                      <th>Visit Date</th>
                      <th>Department</th>
                      <th>Service Type</th>
                      <th>Physician</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleVisits.map((visit, idx) => (
                      <tr key={idx}>
                        <td>{visit.id}</td>
                        <td>{visit.visitDate}</td>
                        <td>{visit.department}</td>
                        <td>{visit.service}</td>
                        <td>{visit.physician}</td>
                        <td>
                          <Badge bg={visit.status === 'Completed' ? 'success' : 'warning'}>
                            {visit.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <Row className="mt-4">
        <Col className="text-center">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">⚙️ Settings</small>
            <div className="d-flex gap-3">
              <small className="text-muted">Messenger</small>
              <small className="text-muted">Legal</small>
              <small className="text-muted">🎯</small>
              <small className="text-muted">💬</small>
              <small className="text-muted">🔗</small>
              <small className="text-muted">ℹ️</small>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
