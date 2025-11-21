import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { passengerAPI, trainAPI, stationAPI, ticketAPI } from '../services/api';

function AdminProfile() {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [stats, setStats] = useState({
    totalPassengers: 0,
    totalTrains: 0,
    totalStations: 0,
    totalTickets: 0
  });
  const [recentPassengers, setRecentPassengers] = useState([]);
  const [recentTrains, setRecentTrains] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setAdminInfo(user);
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      const [passRes, trainRes, stationRes, ticketRes] = await Promise.all([
        passengerAPI.getAll(),
        trainAPI.getAll(),
        stationAPI.getAll(),
        ticketAPI.getAll()
      ]);

      const passengers = passRes.data.data || passRes.data || [];
      const trains = trainRes.data.data || trainRes.data || [];
      const stations = stationRes.data.data || stationRes.data || [];
      const tickets = ticketRes.data.data || ticketRes.data || [];

      setStats({
        totalPassengers: passengers.length,
        totalTrains: trains.length,
        totalStations: stations.length,
        totalTickets: tickets.length
      });

      // Get recent 5 passengers and trains
      setRecentPassengers(passengers.slice(0, 5));
      setRecentTrains(trains.slice(0, 5));
    } catch (error) {
      console.error('Error loading stats:', error);
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
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>👨‍💼</div>
            <h1 className="display-4 fw-bold mb-2">Admin Profile</h1>
            <p className="lead">System Administrator Panel</p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Admin Info Card */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <Row>
              <Col md={8}>
                <h4 className="mb-3">Administrator Information</h4>
                <div className="mb-2">
                  <strong>Email:</strong> {adminInfo?.email || 'admin@trainreservation.com'}
                </div>
                <div className="mb-2">
                  <strong>Role:</strong> <Badge bg="danger">Administrator</Badge>
                </div>
                <div className="mb-2">
                  <strong>Access Level:</strong> Full System Access
                </div>
                <div className="mb-2">
                  <strong>Login Status:</strong> <Badge bg="success">Active</Badge>
                </div>
              </Col>
              <Col md={4} className="text-end">
                <Button 
                  variant="outline-primary" 
                  className="me-2"
                  onClick={() => navigate('/admin')}
                >
                  📊 Dashboard
                </Button>
                <Button 
                  variant="outline-danger"
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('loginStateChange'));
                    navigate('/login');
                  }}
                >
                  Logout
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Quick Stats */}
        <h4 className="mb-3">Quick Statistics</h4>
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
                    <div className="text-muted small">Total Stations</div>
                    <h2 className="mb-0">{stats.totalStations}</h2>
                  </div>
                  <div style={{fontSize: '3rem', opacity: 0.3}}>🚉</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 mb-3" style={{borderLeft: '4px solid #43e97b'}}>
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
        </Row>

        {/* Quick Actions */}
        <h4 className="mb-3">Quick Actions</h4>
        <Row className="mb-4">
          <Col md={3}>
            <Card 
              className="shadow-sm border-0 mb-3 hover-card" 
              style={{cursor: 'pointer'}}
              onClick={() => navigate('/admin')}
            >
              <Card.Body className="text-center">
                <div style={{fontSize: '3rem', marginBottom: '10px'}}>👥</div>
                <h6>View All Passengers</h6>
                <p className="text-muted small mb-0">Manage passenger records</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card 
              className="shadow-sm border-0 mb-3 hover-card" 
              style={{cursor: 'pointer'}}
              onClick={() => navigate('/trains')}
            >
              <Card.Body className="text-center">
                <div style={{fontSize: '3rem', marginBottom: '10px'}}>🚂</div>
                <h6>Manage Trains</h6>
                <p className="text-muted small mb-0">Add, edit, view trains</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card 
              className="shadow-sm border-0 mb-3 hover-card" 
              style={{cursor: 'pointer'}}
              onClick={() => navigate('/stations')}
            >
              <Card.Body className="text-center">
                <div style={{fontSize: '3rem', marginBottom: '10px'}}>🚉</div>
                <h6>Manage Stations</h6>
                <p className="text-muted small mb-0">Station operations</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card 
              className="shadow-sm border-0 mb-3 hover-card" 
              style={{cursor: 'pointer'}}
              onClick={() => navigate('/smartcards')}
            >
              <Card.Body className="text-center">
                <div style={{fontSize: '3rem', marginBottom: '10px'}}>💳</div>
                <h6>Smartcards</h6>
                <p className="text-muted small mb-0">Manage smartcards</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Passengers Preview */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Recent Passengers</h5>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => navigate('/admin')}
            >
              View All →
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {recentPassengers.length > 0 ? (
                  recentPassengers.map(passenger => (
                    <tr key={passenger.Passenger_ID}>
                      <td>{passenger.Passenger_ID}</td>
                      <td>{passenger.Name}</td>
                      <td>{passenger.Email}</td>
                      <td>{passenger.Age}</td>
                      <td>{passenger.Gender}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No passengers found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Recent Trains Preview */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Trains Overview</h5>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => navigate('/trains')}
            >
              View All →
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Train Number</th>
                  <th>Train Name</th>
                  <th>Type</th>
                  <th>Total Seats</th>
                </tr>
              </thead>
              <tbody>
                {recentTrains.length > 0 ? (
                  recentTrains.map(train => (
                    <tr key={train.Train_ID}>
                      <td className="font-monospace">{train.Train_Number || '-'}</td>
                      <td>{train.Train_Name}</td>
                      <td><Badge bg="info">{train.Train_Type}</Badge></td>
                      <td>{train.Total_Seats || train.Capacity || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">No trains found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AdminProfile;
