import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Badge, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function LocoPilots() {
  const [pilots, setPilots] = useState([]);
  const [trains, setTrains] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';
  
  const [pilotForm, setPilotForm] = useState({
    Name: '',
    Role: 'Pilot',
    Age: '',
    License_Number: '',
    Experience_Years: '',
    Station_ID: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const trainsRes = await axios.get(`${API_URL}/trains`);
      setTrains(trainsRes.data.data || trainsRes.data || []);
      
      // Try to load pilots
      try {
        const pilotsRes = await axios.get(`${API_URL}/pilots`);
        setPilots(pilotsRes.data.data || pilotsRes.data || []);
      } catch (err) {
        console.error('Error loading pilots:', err);
        setPilots([]);
        // Don't show error message, just use empty array
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setMessage({ type: 'warning', text: 'Could not load some data. The Loco_Pilot table may not exist in your database.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/pilots`, pilotForm);
      setMessage({ type: 'success', text: 'Loco Pilot added successfully!' });
      setShowModal(false);
      loadData();
      setPilotForm({
        Name: '',
        Role: 'Pilot',
        Age: '',
        License_Number: '',
        Experience_Years: '',
        Station_ID: ''
      });
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to add pilot' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👨‍✈️ Loco Pilots</h2>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add New Pilot
          </Button>
        )}
      </div>

      {!isAdmin && (
        <Alert variant="info">
          <strong>📖 View Only Mode:</strong> You are viewing pilot information as a passenger. Only administrators can add pilots.
        </Alert>
      )}

      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      {/* Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Total Pilots</h6>
              <h2>{pilots.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Active Trains</h6>
              <h2>{trains.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Avg Experience</h6>
              <h2>
                {pilots.length > 0 
                  ? Math.round(pilots.reduce((sum, p) => sum + (parseInt(p.Experience_Years) || 0), 0) / pilots.length)
                  : 0} yrs
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">On Duty</h6>
              <h2>{pilots.filter(p => p.Status === 'Active').length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table striped hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Pilot ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Age</th>
                <th>License Number</th>
                <th>Experience</th>
                <th>Home Station</th>
              </tr>
            </thead>
            <tbody>
              {pilots.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="text-muted">
                      <h5>⚠️ Loco Pilot Data Not Available</h5>
                      <p>No pilots found. Add pilots using the button above.</p>
                      <p className="small">Tables: <code>Loco_Pilot</code>, <code>Operates</code></p>
                    </div>
                  </td>
                </tr>
              ) : (
                pilots.map(pilot => (
                  <tr key={pilot.Loco_Pilot_ID}>
                    <td>
                      <Badge bg="primary">LP-{pilot.Loco_Pilot_ID}</Badge>
                    </td>
                    <td className="fw-bold">{pilot.Name}</td>
                    <td>
                      <Badge bg={
                        pilot.Role === 'Senior Pilot' ? 'success' : 
                        pilot.Role === 'Pilot' ? 'primary' : 
                        'secondary'
                      }>
                        {pilot.Role}
                      </Badge>
                    </td>
                    <td>{pilot.Age} years</td>
                    <td><code>{pilot.License_Number}</code></td>
                    <td>{pilot.Experience_Years} years</td>
                    <td>
                      <Badge bg="info">Station {pilot.Station_ID || 'N/A'}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Pilot Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Loco Pilot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                type="text"
                value={pilotForm.Name}
                onChange={(e) => setPilotForm({...pilotForm, Name: e.target.value})}
                placeholder="Enter pilot's name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role *</Form.Label>
              <Form.Select
                value={pilotForm.Role}
                onChange={(e) => setPilotForm({...pilotForm, Role: e.target.value})}
                required
              >
                <option value="Senior Pilot">Senior Pilot</option>
                <option value="Pilot">Pilot</option>
                <option value="Junior Pilot">Junior Pilot</option>
                <option value="Trainee">Trainee</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Age *</Form.Label>
              <Form.Control
                type="number"
                min="21"
                max="65"
                value={pilotForm.Age}
                onChange={(e) => setPilotForm({...pilotForm, Age: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>License Number *</Form.Label>
              <Form.Control
                type="text"
                value={pilotForm.License_Number}
                onChange={(e) => setPilotForm({...pilotForm, License_Number: e.target.value})}
                placeholder="e.g., LP001"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience (Years) *</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="40"
                value={pilotForm.Experience_Years}
                onChange={(e) => setPilotForm({...pilotForm, Experience_Years: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Home Station *</Form.Label>
              <Form.Select
                value={pilotForm.Station_ID}
                onChange={(e) => setPilotForm({...pilotForm, Station_ID: e.target.value})}
                required
              >
                <option value="">Select Station</option>
                {trains.length > 0 && trains.map(train => (
                  <option key={train.Train_ID} value={train.Train_ID}>{train.Train_Name}</option>
                ))}
              </Form.Select>
              <Form.Text>Assign pilot to a home station (using train IDs as placeholder)</Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Pilot'}
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Card className="mt-4 bg-light">
        <Card.Body>
          <h6>📌 Backend Implementation Required:</h6>
          <p className="mb-2">Create pilot routes in your backend:</p>
          <pre className="bg-white p-3 rounded small">
{`// backend/routes/pilotRoutes.js
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Loco_Pilot');
  res.json({ success: true, data: rows });
});

router.post('/', async (req, res) => {
  const { Name, License_Number, Experience_Years, Contact_No, Date_of_Joining } = req.body;
  const [result] = await db.query(
    'INSERT INTO Loco_Pilot (Name, License_Number, Experience_Years, Contact_No, Date_of_Joining) VALUES (?, ?, ?, ?, ?)',
    [Name, License_Number, Experience_Years, Contact_No, Date_of_Joining]
  );
  res.json({ success: true, pilot_id: result.insertId });
});`}
          </pre>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LocoPilots;
