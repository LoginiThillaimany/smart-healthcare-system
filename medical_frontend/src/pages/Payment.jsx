import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import './Payment.css';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  const billingSummary = {
    consultation: 150.00,
    medicaid: 35.00,
    serviceCharge: 25.00,
    subtotal: 110.00,
    tax: 14.30,
    total: 289.30
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Processing payment...');
  };

  return (
    <Container fluid className="payment-page">
      <Row>
        {/* Left Sidebar */}
        <Col md={2} className="sidebar bg-light">
          <div className="sidebar-content p-3">
            <h6 className="text-primary mb-4">MediBill</h6>
            <nav className="nav flex-column">
              <a href="/patient-management" className="nav-link">Patient Management</a>
              <a href="/online-payment" className="nav-link">Online Payment</a>
              <a href="/nursing-checklist" className="nav-link">Nursing Checklist</a>
              <a href="/billing" className="nav-link active">Billing</a>
              <a href="/payment-methods" className="nav-link">Payment Methods</a>
              <a href="/confirmation" className="nav-link">Payment Confirmation</a>
              <a href="/payment-history" className="nav-link">Payment History</a>
              <a href="/reports" className="nav-link">Reports</a>
            </nav>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={7} className="p-4">
          <h3 className="mb-4">Select Payment Method</h3>

          {/* Payment Method Options */}
          <div className="payment-methods mb-4">
            {/* Government Coverage */}
            <Card
              className={`payment-option mb-3 ${paymentMethod === 'government' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('government')}
            >
              <Card.Body className="d-flex align-items-center">
                <div className="icon me-3">🏛️</div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">Government Coverage</h6>
                  <small className="text-muted">
                    Use a form of insurance covered by eligible patients
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* Insurance Plan */}
            <Card
              className={`payment-option mb-3 ${paymentMethod === 'insurance' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('insurance')}
            >
              <Card.Body className="d-flex align-items-center">
                <div className="icon me-3">🛡️</div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">Insurance Plan</h6>
                  <small className="text-muted">
                    For using insurance for medical expense
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* Credit/Debit Card */}
            <Card
              className={`payment-option mb-3 ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="icon me-3">💳</div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Credit/Debit Card</h6>
                    <small className="text-muted">
                      Safe money transfer using your bank card (Visa, Mastercard, Amex, Discover)
                    </small>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name on card</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter cardholder name"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Card number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      />
                      <div className="card-logos mt-2">
                        <img src="/visa.png" alt="Visa" height="20" className="me-2" />
                        <img src="/mastercard.png" alt="Mastercard" height="20" className="me-2" />
                        <img src="/amex.png" alt="Amex" height="20" />
                      </div>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="MM / YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Security code</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="CVV"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Card.Body>
            </Card>

            {/* Cash Payment */}
            <Card
              className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              <Card.Body className="d-flex align-items-center">
                <div className="icon me-3">💵</div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">Cash Payment</h6>
                  <small className="text-muted">
                    Make payment at hospital counter
                  </small>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3">
            <Button variant="outline-secondary" size="lg">
              About Methods
            </Button>
            <Button variant="outline-secondary" size="lg">
              Receptionist
            </Button>
            <Button variant="outline-secondary" size="lg">
              Legal
            </Button>
            <Button variant="link">
              🛈
            </Button>
          </div>
        </Col>

        {/* Right Sidebar - Billing Summary */}
        <Col md={3} className="p-4 bg-light">
          <Card className="billing-summary">
            <Card.Body>
              <h5 className="mb-4">Billing Summary</h5>

              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="d-flex justify-content-between border-0 px-0">
                  <span>Consultation Fee</span>
                  <span>${billingSummary.consultation.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between border-0 px-0">
                  <span>Medicaid</span>
                  <span>${billingSummary.medicaid.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between border-0 px-0">
                  <span>Service Charge</span>
                  <span>${billingSummary.serviceCharge.toFixed(2)}</span>
                </ListGroup.Item>
              </ListGroup>

              <hr />

              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="d-flex justify-content-between border-0 px-0">
                  <span>Subtotal</span>
                  <span>${billingSummary.subtotal.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between border-0 px-0">
                  <span>Tax</span>
                  <span>${billingSummary.tax.toFixed(2)}</span>
                </ListGroup.Item>
              </ListGroup>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <h5>Total Due</h5>
                <h5 className="text-primary">${billingSummary.total.toFixed(2)}</h5>
              </div>

              <Button variant="primary" size="lg" className="w-100" onClick={handleSubmit}>
                Proceed to Payment
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
