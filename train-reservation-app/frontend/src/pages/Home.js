import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Hero Section with Train Theme */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 0',
        marginBottom: '40px'
      }}>
        <Container>
          <div className="text-center">
            <h1 className="display-3 fw-bold mb-3">
              🚂 Indian Railway Reservation System
            </h1>
            <p className="lead fs-4 mb-4">
              Book your train tickets easily and manage your journey with comfort
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button 
                as={Link} 
                to="/search" 
                variant="light" 
                size="lg"
                className="px-4 py-2 fw-bold"
              >
                🔍 Search Trains
              </Button>
              <Button 
                as={Link} 
                to="/my-tickets" 
                variant="outline-light" 
                size="lg"
                className="px-4 py-2 fw-bold"
              >
                🎫 My Bookings
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Feature Cards with Train Diagram Theme */}
        <Row className="mb-5">
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-lg border-0 hover-card" 
                  style={{transition: 'transform 0.3s', cursor: 'pointer'}}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{fontSize: '4rem'}}>�</div>
                <Card.Title className="h4 fw-bold text-primary mb-3">
                  Search Trains
                </Card.Title>
                <Card.Text className="text-muted mb-4">
                  Search from over 500+ stations across India. Find the perfect train for your journey with real-time availability.
                </Card.Text>
                <Button as={Link} to="/search" variant="primary" className="w-100">
                  Start Searching →
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-lg border-0 hover-card"
                  style={{transition: 'transform 0.3s', cursor: 'pointer'}}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{fontSize: '4rem'}}>🎫</div>
                <Card.Title className="h4 fw-bold text-success mb-3">
                  My Tickets
                </Card.Title>
                <Card.Text className="text-muted mb-4">
                  View all your bookings, check PNR status, download tickets, and manage cancellations easily.
                </Card.Text>
                <Button as={Link} to="/my-tickets" variant="success" className="w-100">
                  View Tickets →
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-lg border-0 hover-card"
                  style={{transition: 'transform 0.3s', cursor: 'pointer'}}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{fontSize: '4rem'}}>�</div>
                <Card.Title className="h4 fw-bold text-info mb-3">
                  Smart Card
                </Card.Title>
                <Card.Text className="text-muted mb-4">
                  Manage your railway smartcard, check balance, recharge instantly, and get exclusive benefits.
                </Card.Text>
                <Button as={Link} to="/profile" variant="info" className="w-100">
                  Manage Card →
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Train Diagram Visualization */}
        <div className="mb-5 p-4 rounded" style={{
          background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
          border: '2px dashed #667eea'
        }}>
          <h3 className="text-center mb-4 fw-bold">
            🚂 Journey Flow Diagram
          </h3>
          <Row className="align-items-center text-center">
            <Col>
              <div className="p-3 bg-white rounded shadow-sm">
                <div className="h2 mb-2">📍</div>
                <strong>Select Station</strong>
                <p className="small text-muted mb-0">Choose your route</p>
              </div>
            </Col>
            <Col xs={1}>
              <div className="h3 text-primary">→</div>
            </Col>
            <Col>
              <div className="p-3 bg-white rounded shadow-sm">
                <div className="h2 mb-2">🔍</div>
                <strong>Search Train</strong>
                <p className="small text-muted mb-0">Find availability</p>
              </div>
            </Col>
            <Col xs={1}>
              <div className="h3 text-success">→</div>
            </Col>
            <Col>
              <div className="p-3 bg-white rounded shadow-sm">
                <div className="h2 mb-2">🎫</div>
                <strong>Book Ticket</strong>
                <p className="small text-muted mb-0">Confirm booking</p>
              </div>
            </Col>
            <Col xs={1}>
              <div className="h3 text-warning">→</div>
            </Col>
            <Col>
              <div className="p-3 bg-white rounded shadow-sm">
                <div className="h2 mb-2">✅</div>
                <strong>Get PNR</strong>
                <p className="small text-muted mb-0">Travel ready!</p>
              </div>
            </Col>
          </Row>
        </div>

        {/* Statistics Section */}
        <Row className="mb-5">
          <Col md={12}>
            <Card className="border-0 shadow-lg" style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}>
              <Card.Body className="p-5">
                <h3 className="text-center mb-4 fw-bold">Our Network Statistics</h3>
                <Row>
                  <Col md={3} className="text-center mb-3">
                    <div className="display-4 fw-bold">1000+</div>
                    <p className="lead mb-0">Daily Trains</p>
                    <Badge bg="light" text="dark" className="mt-2">Active</Badge>
                  </Col>
                  <Col md={3} className="text-center mb-3">
                    <div className="display-4 fw-bold">500+</div>
                    <p className="lead mb-0">Railway Stations</p>
                    <Badge bg="light" text="dark" className="mt-2">Nationwide</Badge>
                  </Col>
                  <Col md={3} className="text-center mb-3">
                    <div className="display-4 fw-bold">50K+</div>
                    <p className="lead mb-0">Daily Passengers</p>
                    <Badge bg="light" text="dark" className="mt-2">Growing</Badge>
                  </Col>
                  <Col md={3} className="text-center mb-3">
                    <div className="display-4 fw-bold">24/7</div>
                    <p className="lead mb-0">Customer Support</p>
                    <Badge bg="light" text="dark" className="mt-2">Available</Badge>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Popular Routes */}
        <Row className="mb-5">
          <Col md={12}>
            <h3 className="text-center mb-4 fw-bold">🌟 Popular Routes</h3>
            <Row>
              <Col md={6} className="mb-3">
                <Card className="border-primary">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">🏛️ Delhi → Mumbai</h5>
                        <small className="text-muted">Rajdhani Express • 1384 km</small>
                      </div>
                      <Button as={Link} to="/search" variant="outline-primary" size="sm">
                        Book Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-3">
                <Card className="border-success">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">🏖️ Chennai → Bangalore</h5>
                        <small className="text-muted">Shatabdi Express • 362 km</small>
                      </div>
                      <Button as={Link} to="/search" variant="outline-success" size="sm">
                        Book Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
