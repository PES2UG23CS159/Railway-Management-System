import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap';
import { passengerAPI, smartcardAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [smartcard, setSmartcard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [message, setMessage] = useState(null);

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Redirect admin to admin profile
    if (user.role === 'admin') {
      navigate('/admin-profile');
      return;
    }
    
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    if (!user || !user.id) {
      setMessage({ type: 'danger', text: 'Please login to view your profile' });
      return;
    }
    
    setLoading(true);
    try {
      // Get logged-in passenger details only
      const passengerRes = await passengerAPI.getById(user.id);
      const passengerData = passengerRes.data.data || passengerRes.data;
      setSelectedPassenger(passengerData);
      
      // Get railway card
      try {
        const cardRes = await passengerAPI.getRailwayCard(user.id);
        const cardData = cardRes.data.data || cardRes.data;
        setSmartcard(Array.isArray(cardData) ? cardData[0] : cardData);
      } catch (err) {
        console.error('No railway card found:', err);
        setSmartcard(null);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async (amount) => {
    if (!selectedPassenger) {
      setMessage({ type: 'danger', text: 'Please select a passenger first' });
      return;
    }

    try {
      const response = await passengerAPI.rechargeCard(selectedPassenger.Passenger_ID, amount);
      setMessage({ type: 'success', text: `✅ ${response.data.message}` });
      setRechargeAmount('');
      // Reload profile to get updated card balance
      loadUserProfile();
    } catch (err) {
      console.error('Recharge error:', err);
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to recharge card' });
    }
  };

  const handleCustomRecharge = async (e) => {
    e.preventDefault();
    await handleRecharge(parseFloat(rechargeAmount));
  };

  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Please login to view your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <div>
      {/* Header Section with Train Theme */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 0',
        marginBottom: '30px'
      }}>
        <Container>
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-2">
              👤 My Profile
            </h1>
            <p className="lead">Manage your railway journey details and smartcard</p>
          </div>
        </Container>
      </div>

      <Container>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" style={{width: '4rem', height: '4rem'}} />
            <p className="mt-3 h5">Loading profile...</p>
          </div>
        ) : selectedPassenger && (
          <>
            {/* Train Diagram Style Profile Card */}
            <Card className="mb-4 shadow-lg border-0 overflow-hidden">
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                padding: '20px',
                color: 'white'
              }}>
                <h4 className="mb-0 d-flex align-items-center">
                  <span className="me-2" style={{fontSize: '2rem'}}>🎫</span>
                  Personal Information
                </h4>
              </div>
              <Card.Body className="p-4">
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small mb-1">Full Name</div>
                      <div className="h5 mb-0 text-primary">
                        👤 {selectedPassenger.Name}
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small mb-1">Email Address</div>
                      <div className="h5 mb-0 text-primary">
                        📧 {selectedPassenger.Email}
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small mb-1">Contact Number</div>
                      <div className="h5 mb-0 text-success">
                        📱 {selectedPassenger.Contact_No}
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small mb-1">Age</div>
                      <div className="h5 mb-0 text-info">
                        🎂 {selectedPassenger.Age} years
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small mb-1">Gender</div>
                      <div className="h5 mb-0 text-warning">
                        {selectedPassenger.Gender === 'Male' ? '👨' : selectedPassenger.Gender === 'Female' ? '👩' : '👤'} {selectedPassenger.Gender}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Smartcard with Train Design */}
            <Card className="mb-4 shadow-lg border-0 overflow-hidden">
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                padding: '20px',
                color: 'white'
              }}>
                <h4 className="mb-0 d-flex align-items-center">
                  <span className="me-2" style={{fontSize: '2rem'}}>💳</span>
                  Railway Smartcard
                </h4>
              </div>
              <Card.Body className="p-4">
                {smartcard ? (
                  <>
                    {/* Visual Train Card Design */}
                    <div className="mb-4 p-4 rounded shadow" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      position: 'relative',
                      minHeight: '200px'
                    }}>
                      <div className="position-absolute top-0 end-0 p-3">
                        <span style={{fontSize: '3rem'}}>🚄</span>
                      </div>
                      <div className="mb-3">
                        <Badge bg="light" text="dark" className="px-3 py-2">
                          {smartcard.Card_Type}
                        </Badge>
                      </div>
                      <div className="h4 mb-2">Card Number</div>
                      <div className="h3 fw-bold mb-4 font-monospace">
                        {smartcard.Card_Number}
                      </div>
                      <Row>
                        <Col>
                          <div className="small opacity-75">Valid From</div>
                          <div className="fw-bold">
                            {new Date(smartcard.Issue_Date).toLocaleDateString()}
                          </div>
                        </Col>
                        <Col>
                          <div className="small opacity-75">Valid Until</div>
                          <div className="fw-bold">
                            {new Date(smartcard.Expiry_Date).toLocaleDateString()}
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Balance Display */}
                    <div className="text-center mb-4 p-4 bg-light rounded">
                      <div className="text-muted mb-2">Current Balance</div>
                      <div className="display-4 fw-bold text-success">
                        ₹{smartcard.Balance}
                      </div>
                    </div>

                    {message && (
                      <Alert variant={message.type} dismissible onClose={() => setMessage(null)} className="shadow-sm">
                        <strong>{message.text}</strong>
                      </Alert>
                    )}

                    {/* Recharge Section */}
                    <Card className="border-success">
                      <Card.Header className="bg-success text-white">
                        <h5 className="mb-0">💰 Recharge Your Smartcard</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleCustomRecharge}>
                          <Row className="align-items-end">
                            <Col md={8}>
                              <Form.Group>
                                <Form.Label className="fw-bold">Enter Amount (₹)</Form.Label>
                                <Form.Control 
                                  type="number"
                                  min="1"
                                  step="0.01"
                                  value={rechargeAmount}
                                  onChange={(e) => setRechargeAmount(e.target.value)}
                                  placeholder="Enter recharge amount"
                                  size="lg"
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Button type="submit" variant="success" size="lg" className="w-100">
                                💳 Recharge Now
                              </Button>
                            </Col>
                          </Row>
                          <div className="mt-3 d-flex gap-2">
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleRecharge(100)}
                            >
                              +₹100
                            </Button>
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleRecharge(500)}
                            >
                              +₹500
                            </Button>
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleRecharge(1000)}
                            >
                              +₹1000
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </>
                ) : (
                  <Alert variant="warning" className="shadow-sm">
                    <Alert.Heading>⚠️ No Smartcard Found</Alert.Heading>
                    <p>This passenger doesn't have a smartcard yet. Please contact support to issue a new card.</p>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
}

export default Profile;
