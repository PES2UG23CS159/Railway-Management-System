import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Button, Modal, Form, Alert, Badge, InputGroup } from 'react-bootstrap';
import { smartcardAPI, passengerAPI } from '../services/api';

function Smartcards() {
  const [smartcards, setSmartcards] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';
  
  const [cardForm, setCardForm] = useState({
    Passenger_ID: '',
    Balance: 100,
    Issue_Date: new Date().toISOString().split('T')[0],
    Validity: '1 Year'
  });

  const [rechargeAmount, setRechargeAmount] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (isAdmin) {
        // Admin can see all cards and passengers
        const [cardsRes, passRes] = await Promise.all([
          smartcardAPI.getAll(),
          passengerAPI.getAll()
        ]);
        setSmartcards(cardsRes.data.data || cardsRes.data || []);
        setPassengers(passRes.data.data || passRes.data || []);
      } else if (user?.id) {
        // Regular user can only see their own card
        try {
          const cardRes = await passengerAPI.getRailwayCard(user.id);
          const cardData = cardRes.data.data || cardRes.data;
          setSmartcards(Array.isArray(cardData) ? cardData : [cardData]);
        } catch (err) {
          console.log('No card found for user');
          setSmartcards([]);
        }
      }
    } catch (err) {
      console.error('Error loading smartcards:', err);
      setMessage({ type: 'danger', text: 'Failed to load smartcards' });
    }
  };

  const handleIssueCard = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await smartcardAPI.create(cardForm);
      setMessage({ type: 'success', text: 'Smartcard issued successfully!' });
      setShowModal(false);
      loadData();
      setCardForm({
        Passenger_ID: '',
        Balance: 100,
        Issue_Date: new Date().toISOString().split('T')[0],
        Validity: '1 Year'
      });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to issue smartcard' });
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await smartcardAPI.recharge(selectedCard.Card_ID, parseFloat(rechargeAmount));
      setMessage({ type: 'success', text: `Recharged ₹${rechargeAmount} successfully!` });
      setShowRechargeModal(false);
      setRechargeAmount('');
      loadData();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to recharge card' });
    } finally {
      setLoading(false);
    }
  };

  const openRechargeModal = (card) => {
    setSelectedCard(card);
    setShowRechargeModal(true);
  };

  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Please login to view your smartcard.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>💳 {isAdmin ? 'Smartcard Management' : 'My Smartcard'}</h2>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Issue New Card
          </Button>
        )}
      </div>

      {!isAdmin && smartcards.length === 0 && (
        <Alert variant="info">
          <Alert.Heading>No Smartcard Found</Alert.Heading>
          <p>You don't have a smartcard yet. Please contact admin or register a new account to get one.</p>
        </Alert>
      )}

      {!isAdmin && smartcards.length > 0 && (
        <Alert variant="info">
          <strong>📖 View Only Mode:</strong> You are viewing smartcards as a passenger. Only administrators can issue new cards. You can recharge your card from your Profile page.
        </Alert>
      )}

      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Total Cards Issued</h6>
              <h2>{smartcards.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Active Cards</h6>
              <h2>{smartcards.filter(c => parseFloat(c.Balance) > 0).length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Total Balance</h6>
              <h2>₹{smartcards.reduce((sum, c) => sum + parseFloat(c.Balance || 0), 0).toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table striped hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Card ID</th>
                <th>Passenger</th>
                <th>Balance</th>
                <th>Issue Date</th>
                <th>Validity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {smartcards.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No smartcards issued yet
                  </td>
                </tr>
              ) : (
                smartcards.map(card => (
                  <tr key={card.Card_ID}>
                    <td>
                      <Badge bg="info">{card.Card_ID}</Badge>
                    </td>
                    <td>{card.Passenger_Name || `Passenger #${card.Passenger_ID}`}</td>
                    <td className="fw-bold">₹{parseFloat(card.Balance).toFixed(2)}</td>
                    <td>{new Date(card.Issue_Date).toLocaleDateString()}</td>
                    <td>{card.Validity}</td>
                    <td>
                      {parseFloat(card.Balance) > 0 ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="warning">Low Balance</Badge>
                      )}
                    </td>
                    <td>
                      {isAdmin ? (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openRechargeModal(card)}
                        >
                          💰 Recharge
                        </Button>
                      ) : (
                        <Badge bg="secondary">View Only</Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Issue Card Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Issue New Smartcard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleIssueCard}>
            <Form.Group className="mb-3">
              <Form.Label>Select Passenger *</Form.Label>
              <Form.Select
                value={cardForm.Passenger_ID}
                onChange={(e) => setCardForm({...cardForm, Passenger_ID: e.target.value})}
                required
              >
                <option value="">Choose passenger...</option>
                {passengers.map(passenger => (
                  <option key={passenger.Passenger_ID} value={passenger.Passenger_ID}>
                    {passenger.Name} - {passenger.Email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Initial Balance (₹) *</Form.Label>
              <Form.Control
                type="number"
                min="100"
                step="0.01"
                value={cardForm.Balance}
                onChange={(e) => setCardForm({...cardForm, Balance: e.target.value})}
                required
              />
              <Form.Text>Minimum balance: ₹100</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Validity *</Form.Label>
              <Form.Select
                value={cardForm.Validity}
                onChange={(e) => setCardForm({...cardForm, Validity: e.target.value})}
                required
              >
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="5 Years">5 Years</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Issuing...' : 'Issue Card'}
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Recharge Modal */}
      <Modal show={showRechargeModal} onHide={() => setShowRechargeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Recharge Smartcard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCard && (
            <div className="mb-3">
              <p><strong>Card ID:</strong> {selectedCard.Card_ID}</p>
              <p><strong>Current Balance:</strong> ₹{parseFloat(selectedCard.Balance).toFixed(2)}</p>
            </div>
          )}
          
          <Form onSubmit={handleRecharge}>
            <Form.Group className="mb-3">
              <Form.Label>Recharge Amount (₹) *</Form.Label>
              <InputGroup>
                <InputGroup.Text>₹</InputGroup.Text>
                <Form.Control
                  type="number"
                  min="50"
                  step="0.01"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </InputGroup>
              <Form.Text>Minimum recharge: ₹50</Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? 'Processing...' : 'Recharge'}
              </Button>
              <Button variant="secondary" onClick={() => setShowRechargeModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Smartcards;
