import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('allergies');

  useEffect(() => {
    // Fetch patient data - replace with actual patient ID
    api.get('/patients/6756a8b4c8d0e1f2a3b4c5d6') // Example ID
      .then(res => setPatient(res.data.data))
      .catch(err => console.error('Error fetching patient:', err));
  }, []);

  if (!patient) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="patient-dashboard">
      {/* Sidebar */}
      <Row>
        <Col md={2} className="sidebar bg-light">
          <div className="sidebar-content p-3">
            <h6 className="text-primary mb-4">Medigo</h6>
            <Nav className="flex-column">
              <Nav.Link href="/dashboard" active>Dashboard</Nav.Link>
              <Nav.Link href="/medical-history">Medical History</Nav.Link>
            </Nav>

            {/* User Card at Bottom */}
            <div className="user-card mt-auto">
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center p-2">
                  <Image
                    src={patient.profilePhoto || 'https://via.placeholder.com/50'}
                    roundedCircle
                    width={40}
                    height={40}
                    className="mb-2"
                  />
                  <div className="small">
                    <strong>{patient.fullName}</strong>
                    <div className="text-muted small">My Account</div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4">
          <h3 className="mb-4">Patient Dashboard</h3>

          {/* Patient Overview Card */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5>Patient Overview</h5>
                <Button variant="link" className="text-decoration-none">
                  ✏️ Edit Profile
                </Button>
              </div>

              <Row>
                <Col md={2}>
                  <Image
                    src={patient.profilePhoto || 'https://via.placeholder.com/150'}
                    roundedCircle
                    width={100}
                    height={100}
                    className="mb-3"
                  />
                </Col>
                <Col md={10}>
                  <h5 className="text-primary">{patient.fullName}</h5>
                  <Row className="mt-3">
                    <Col md={6}>
                      <div className="mb-2">
                        <small className="text-muted">📅 Date of Birth:</small>
                        <div>{new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">⚧ Gender:</small>
                        <div>{patient.gender}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">🩺 Primary Doctor:</small>
                        <div>Dr. Marian</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-2">
                        <small className="text-muted">📞 Contact:</small>
                        <div>{patient.phone}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">✉️ Email:</small>
                        <div>{patient.email}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">📍 Address:</small>
                        <div>
                          {patient.address?.street}, {patient.address?.city}, {patient.address?.state}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Medical History Card */}
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Medical History</h5>
              <p className="text-muted small mb-3">
                Comprehensive overview of patient's medical records
              </p>

              {/* Tabs */}
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === 'allergies'}
                    onClick={() => setActiveTab('allergies')}
                  >
                    Allergies
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === 'medications'}
                    onClick={() => setActiveTab('medications')}
                  >
                    Medications
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === 'surgeries'}
                    onClick={() => setActiveTab('surgeries')}
                  >
                    Surgeries
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === 'labResults'}
                    onClick={() => setActiveTab('labResults')}
                  >
                    Lab Results
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'allergies' && (
                  <div>
                    {patient.allergies && patient.allergies.length > 0 ? (
                      <ListGroup>
                        {patient.allergies.map((allergy, idx) => (
                          <ListGroup.Item key={idx} className="d-flex align-items-center">
                            <span className="me-2">⚠️</span>
                            <div>
                              <strong>{allergy}</strong>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-muted">
                        <p>✅ No known allergies</p>
                        <Button variant="outline-primary" size="sm">
                          ➕ Add Allergy
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'medications' && (
                  <div>
                    {patient.prescriptions && patient.prescriptions.length > 0 ? (
                      <ListGroup>
                        {patient.prescriptions.map((med, idx) => (
                          <ListGroup.Item key={idx}>
                            <div className="d-flex justify-content-between">
                              <div>
                                <strong>{med.medication}</strong>
                                <div className="small text-muted">
                                  Dosage: {med.dosage} | Duration: {med.duration}
                                </div>
                              </div>
                              <small className="text-muted">
                                {new Date(med.date).toLocaleDateString()}
                              </small>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-muted">
                        <p>No current medications</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'surgeries' && (
                  <div>
                    {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                      <ListGroup>
                        {patient.medicalHistory.map((history, idx) => (
                          <ListGroup.Item key={idx}>
                            <div>
                              <strong>{history.condition}</strong>
                              <div className="small text-muted">
                                Treatment: {history.treatment}
                              </div>
                              <small className="text-muted">
                                Date: {new Date(history.date).toLocaleDateString()}
                              </small>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-muted">
                        <p>No surgical history</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'labResults' && (
                  <div className="text-muted">
                    <p>No lab results available</p>
                    <Button variant="outline-primary" size="sm">
                      Upload Lab Results
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientDashboard;
