import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Badge, Button, Modal, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { passengerAPI, trainAPI, ticketAPI, stationAPI } from '../services/api';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalPassengers: 0,
    totalTrains: 0,
    totalTickets: 0,
    totalStations: 0,
    revenue: 0
  });
  
  // Data states
  const [passengers, setPassengers] = useState([]);
  const [trains, setTrains] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [stations, setStations] = useState([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'passenger', 'train', 'station'
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  
  // Form states
  const [passengerForm, setPassengerForm] = useState({
    Name: '',
    Age: '',
    Contact_No: '',
    Gender: 'Male',
    Email: ''
  });
  
  const [trainForm, setTrainForm] = useState({
    trainName: '',
    trainType: 'Express',
    totalSeats: ''
  });
  
  const [stationForm, setStationForm] = useState({
    stationName: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [passRes, trainRes, ticketRes, stationRes] = await Promise.all([
        passengerAPI.getAll(),
        trainAPI.getAll(),
        ticketAPI.getAll(),
        stationAPI.getAll()
      ]);

      const passengersData = passRes.data.data || passRes.data;
      const trainsData = trainRes.data.data || trainRes.data;
      const ticketsData = ticketRes.data.data || ticketRes.data;
      const stationsData = stationRes.data.data || stationRes.data;

      setPassengers(Array.isArray(passengersData) ? passengersData : []);
      setTrains(Array.isArray(trainsData) ? trainsData : []);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      setStations(Array.isArray(stationsData) ? stationsData : []);

      // Calculate stats
      const revenue = ticketsData.reduce((sum, ticket) => sum + parseFloat(ticket.Fare || 0), 0);
      setStats({
        totalPassengers: passengersData.length,
        totalTrains: trainsData.length,
        totalTickets: ticketsData.length,
        totalStations: stationsData.length,
        revenue: revenue
      });
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    if (item) {
      if (type === 'passenger') setPassengerForm(item);
      if (type === 'train') setTrainForm(item);
      if (type === 'station') setStationForm(item);
    } else {
      // Reset forms
      setPassengerForm({ Name: '', Age: '', Contact_No: '', Gender: 'Male', Email: '' });
      setTrainForm({ trainName: '', trainType: 'Express', totalSeats: '' });
      setStationForm({ stationName: '', city: '', state: '' });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setMessage(null);
  };

  const handleSavePassenger = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await passengerAPI.update(editingItem.Passenger_ID, passengerForm);
        setMessage({ type: 'success', text: 'Passenger updated successfully!' });
      } else {
        await passengerAPI.create(passengerForm);
        setMessage({ type: 'success', text: 'Passenger created successfully!' });
      }
      loadAllData();
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to save passenger' });
    }
  };

  const handleSaveTrain = async (e) => {
    e.preventDefault();
    try {
      await trainAPI.create({
        Train_Name: trainForm.trainName,
        Train_Type: trainForm.trainType,
        Total_Seats: trainForm.totalSeats
      });
      setMessage({ type: 'success', text: 'Train created successfully!' });
      loadAllData();
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      console.error('Train creation error:', err);
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save train' });
    }
  };

  const handleDeletePassenger = async (id) => {
    if (window.confirm('Are you sure you want to delete this passenger?')) {
      try {
        await passengerAPI.delete(id);
        setMessage({ type: 'success', text: 'Passenger deleted successfully!' });
        loadAllData();
      } catch (err) {
        setMessage({ type: 'danger', text: 'Failed to delete passenger' });
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 0',
        marginBottom: '30px'
      }}>
        <Container>
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-2">
              👨‍💼 Admin Dashboard
            </h1>
            <p className="lead">Manage Railway System Operations</p>
          </div>
        </Container>
      </div>

      <Container>
        {message && (
          <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          {/* Dashboard Tab */}
          <Tab eventKey="dashboard" title="📊 Dashboard">
            <Row className="mb-4">
              <Col md={3}>
                <Card className="shadow-sm border-0 mb-3" style={{borderLeft: '4px solid #667eea'}}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small">Total Passengers</div>
                        <h2 className="mb-0">{stats.totalPassengers}</h2>
                      </div>
                      <div style={{fontSize: '3rem', opacity: 0.3}}>👥</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="shadow-sm border-0 mb-3" style={{borderLeft: '4px solid #f093fb'}}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small">Total Trains</div>
                        <h2 className="mb-0">{stats.totalTrains}</h2>
                      </div>
                      <div style={{fontSize: '3rem', opacity: 0.3}}>🚂</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="shadow-sm border-0 mb-3" style={{borderLeft: '4px solid #4facfe'}}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small">Total Bookings</div>
                        <h2 className="mb-0">{stats.totalTickets}</h2>
                      </div>
                      <div style={{fontSize: '3rem', opacity: 0.3}}>🎫</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="shadow-sm border-0 mb-3" style={{borderLeft: '4px solid #43e97b'}}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small">Total Revenue</div>
                        <h2 className="mb-0">₹{stats.revenue.toFixed(0)}</h2>
                      </div>
                      <div style={{fontSize: '3rem', opacity: 0.3}}>💰</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent Bookings */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">📋 Recent Bookings</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table striped hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>PNR</th>
                      <th>Passenger</th>
                      <th>Journey Date</th>
                      <th>Status</th>
                      <th>Fare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.slice(0, 5).map(ticket => (
                      <tr key={ticket.Ticket_ID}>
                        <td className="font-monospace">{ticket.PNR_Number}</td>
                        <td>{ticket.Passenger_Name}</td>
                        <td>{new Date(ticket.Journey_Date).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={ticket.Status === 'Confirmed' ? 'success' : 'warning'}>
                            {ticket.Status}
                          </Badge>
                        </td>
                        <td>₹{ticket.Fare}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          {/* Passengers Tab */}
          <Tab eventKey="passengers" title="👥 Passengers">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Manage Passengers</h5>
                <Button variant="primary" size="sm" onClick={() => handleOpenModal('passenger')}>
                  + Add Passenger
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <Table striped hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passengers.map(passenger => (
                      <tr key={passenger.Passenger_ID}>
                        <td>{passenger.Passenger_ID}</td>
                        <td>{passenger.Name}</td>
                        <td>{passenger.Age}</td>
                        <td>{passenger.Gender}</td>
                        <td>{passenger.Email}</td>
                        <td>{passenger.Contact_No}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleOpenModal('passenger', passenger)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeletePassenger(passenger.Passenger_ID)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          {/* Trains Tab */}
          <Tab eventKey="trains" title="🚂 Trains">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Manage Trains</h5>
                <Button variant="primary" size="sm" onClick={() => handleOpenModal('train')}>
                  + Add Train
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <Table striped hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Train Number</th>
                      <th>Train Name</th>
                      <th>Type</th>
                      <th>Capacity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trains.map(train => (
                      <tr key={train.Train_ID}>
                        <td className="font-monospace">{train.Train_Number || '-'}</td>
                        <td>{train.Train_Name}</td>
                        <td>
                          <Badge bg="info">{train.Train_Type}</Badge>
                        </td>
                        <td>{train.Total_Seats || train.Capacity || train.Total_Coaches || '-'}</td>
                        <td>
                          <Button variant="outline-primary" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          {/* Stations Tab */}
          <Tab eventKey="stations" title="🚉 Stations">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Manage Stations</h5>
                <Button variant="primary" size="sm" onClick={() => handleOpenModal('station')}>
                  + Add Station
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <Table striped hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Station Name</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Platforms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stations.map(station => (
                      <tr key={station.Station_ID}>
                        <td className="font-monospace fw-bold">{station.Station_Code}</td>
                        <td>{station.Name || station.Station_Name}</td>
                        <td>{station.Location || station.City}</td>
                        <td>{station.State || '-'}</td>
                        <td>{station.Platform_Count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? 'Edit' : 'Add'} {modalType === 'passenger' ? 'Passenger' : modalType === 'train' ? 'Train' : 'Station'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert variant={message.type}>{message.text}</Alert>}
          
          {modalType === 'passenger' && (
            <Form onSubmit={handleSavePassenger}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control 
                      type="text"
                      value={passengerForm.Name}
                      onChange={(e) => setPassengerForm({...passengerForm, Name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control 
                      type="email"
                      value={passengerForm.Email}
                      onChange={(e) => setPassengerForm({...passengerForm, Email: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Age *</Form.Label>
                    <Form.Control 
                      type="number"
                      value={passengerForm.Age}
                      onChange={(e) => setPassengerForm({...passengerForm, Age: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender *</Form.Label>
                    <Form.Select 
                      value={passengerForm.Gender}
                      onChange={(e) => setPassengerForm({...passengerForm, Gender: e.target.value})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Number *</Form.Label>
                    <Form.Control 
                      type="text"
                      value={passengerForm.Contact_No}
                      onChange={(e) => setPassengerForm({...passengerForm, Contact_No: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex gap-2">
                <Button type="submit" variant="primary">
                  {editingItem ? 'Update' : 'Create'} Passenger
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </div>
            </Form>
          )}

          {modalType === 'train' && (
            <Form onSubmit={handleSaveTrain}>
              <Form.Group className="mb-3">
                <Form.Label>Train Name *</Form.Label>
                <Form.Control 
                  type="text"
                  value={trainForm.trainName}
                  onChange={(e) => setTrainForm({...trainForm, trainName: e.target.value})}
                  placeholder="e.g., Tirupati Express"
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Train Type *</Form.Label>
                    <Form.Select 
                      value={trainForm.trainType}
                      onChange={(e) => setTrainForm({...trainForm, trainType: e.target.value})}
                    >
                      <option value="Express">Express</option>
                      <option value="Superfast">Superfast</option>
                      <option value="Mail">Mail</option>
                      <option value="Local">Local</option>
                      <option value="Passenger">Passenger</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Seats *</Form.Label>
                    <Form.Control 
                      type="number"
                      value={trainForm.totalSeats}
                      onChange={(e) => setTrainForm({...trainForm, totalSeats: e.target.value})}
                      placeholder="e.g., 500"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex gap-2">
                <Button type="submit" variant="primary">
                  Create Train
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Admin;
