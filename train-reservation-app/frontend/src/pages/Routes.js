import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { routeAPI, stationAPI } from '../services/api';

function Routes() {
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';
  
  const [routeForm, setRouteForm] = useState({
    Route_Name: '',
    Start_Station: '',
    End_Station: '',
    Distance_KM: '',
    Route_Type: 'Express'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [routesRes, stationsRes] = await Promise.all([
        routeAPI.getAll(),
        stationAPI.getAll()
      ]);
      
      setRoutes(routesRes.data.data || routesRes.data || []);
      setStations(stationsRes.data.data || stationsRes.data || []);
    } catch (err) {
      console.error('Error loading routes:', err);
      setMessage({ type: 'danger', text: 'Failed to load routes' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await routeAPI.create(routeForm);
      setMessage({ type: 'success', text: 'Route added successfully!' });
      setShowModal(false);
      loadData();
      setRouteForm({
        Route_Name: '',
        Start_Station: '',
        End_Station: '',
        Distance_KM: '',
        Route_Type: 'Express'
      });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to add route' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🛤️ Train Routes</h2>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add New Route
          </Button>
        )}
      </div>

      {!isAdmin && (
        <Alert variant="info">
          <strong>📖 View Only Mode:</strong> You are viewing routes as a passenger. Only administrators can add routes.
        </Alert>
      )}

      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table striped hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Route ID</th>
                <th>Route Name</th>
                <th>Start Station</th>
                <th>End Station</th>
                <th>Distance (km)</th>
                <th>Route Type</th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No routes found
                  </td>
                </tr>
              ) : (
                routes.map(route => (
                  <tr key={route.Route_ID}>
                    <td>
                      <Badge bg="primary">{route.Route_ID}</Badge>
                    </td>
                    <td className="fw-bold">{route.Route_Name}</td>
                    <td>{route.Start_Station}</td>
                    <td>{route.End_Station}</td>
                    <td>{route.Distance_KM} km</td>
                    <td>
                      <Badge bg="info">{route.Route_Type}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Route Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Route</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Route Name *</Form.Label>
              <Form.Control
                type="text"
                value={routeForm.Route_Name}
                onChange={(e) => setRouteForm({...routeForm, Route_Name: e.target.value})}
                placeholder="e.g., Delhi-Mumbai Route"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Station *</Form.Label>
              <Form.Select
                value={routeForm.Start_Station}
                onChange={(e) => setRouteForm({...routeForm, Start_Station: e.target.value})}
                required
              >
                <option value="">Select Start Station</option>
                {stations.map(station => (
                  <option key={station.Station_ID} value={station.Station_Code}>
                    {station.Name} ({station.Station_Code})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Station *</Form.Label>
              <Form.Select
                value={routeForm.End_Station}
                onChange={(e) => setRouteForm({...routeForm, End_Station: e.target.value})}
                required
              >
                <option value="">Select End Station</option>
                {stations.map(station => (
                  <option key={station.Station_ID} value={station.Station_Code}>
                    {station.Name} ({station.Station_Code})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Distance (km) *</Form.Label>
              <Form.Control
                type="number"
                value={routeForm.Distance_KM}
                onChange={(e) => setRouteForm({...routeForm, Distance_KM: e.target.value})}
                placeholder="e.g., 1400"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Route Type *</Form.Label>
              <Form.Select
                value={routeForm.Route_Type}
                onChange={(e) => setRouteForm({...routeForm, Route_Type: e.target.value})}
                required
              >
                <option value="Express">Express</option>
                <option value="Superfast">Superfast</option>
                <option value="Mail">Mail</option>
                <option value="Passenger">Passenger</option>
                <option value="Local">Local</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Route'}
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Routes;
