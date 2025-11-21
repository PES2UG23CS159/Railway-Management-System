import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Badge, Row, Col } from 'react-bootstrap';
import { stationAPI } from '../services/api';

function Stations() {
  const [stations, setStations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';
  
  const [stationForm, setStationForm] = useState({
    stationCode: '',
    stationName: '',
    city: '',
    state: '',
    platformCount: 1
  });

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const response = await stationAPI.getAll();
      setStations(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error loading stations:', err);
      setMessage({ type: 'danger', text: 'Failed to load stations' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingStation) {
        await stationAPI.update(editingStation.Station_ID, stationForm);
        setMessage({ type: 'success', text: 'Station updated successfully!' });
      } else {
        await stationAPI.create(stationForm);
        setMessage({ type: 'success', text: 'Station added successfully!' });
      }
      
      setShowModal(false);
      setEditingStation(null);
      loadStations();
      resetForm();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setStationForm({
      stationCode: station.Station_Code,
      stationName: station.Station_Name,
      city: station.City,
      state: station.State,
      platformCount: station.Platform_Count || 1
    });
    setShowModal(true);
  };

  const handleDelete = async (stationId) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        await stationAPI.delete(stationId);
        setMessage({ type: 'success', text: 'Station deleted successfully!' });
        loadStations();
      } catch (err) {
        setMessage({ type: 'danger', text: 'Failed to delete station' });
      }
    }
  };

  const resetForm = () => {
    setStationForm({
      stationCode: '',
      stationName: '',
      city: '',
      state: '',
      platformCount: 1
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStation(null);
    resetForm();
  };

  // Group stations by state
  const stationsByState = stations.reduce((acc, station) => {
    const state = station.State || 'Unknown';
    if (!acc[state]) acc[state] = [];
    acc[state].push(station);
    return acc;
  }, {});

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🚉 Railway Stations</h2>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add New Station
          </Button>
        )}
      </div>

      {!isAdmin && (
        <Alert variant="info">
          <strong>📖 View Only Mode:</strong> You are viewing stations as a passenger. Only administrators can add, edit, or delete stations.
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
              <h6 className="text-muted">Total Stations</h6>
              <h2>{stations.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">States</h6>
              <h2>{Object.keys(stationsByState).length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Cities</h6>
              <h2>{[...new Set(stations.map(s => s.City))].length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Total Platforms</h6>
              <h2>{stations.reduce((sum, s) => sum + (parseInt(s.Platform_Count) || 0), 0)}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table striped hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Code</th>
                <th>Station Name</th>
                <th>City</th>
                <th>State</th>
                <th>Platforms</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No stations found. Add your first station!
                  </td>
                </tr>
              ) : (
                stations.map(station => (
                  <tr key={station.Station_ID}>
                    <td>
                      <Badge bg="info">{station.Station_Code}</Badge>
                    </td>
                    <td className="fw-bold">{station.Station_Name}</td>
                    <td>{station.City}</td>
                    <td>{station.State}</td>
                    <td>
                      <Badge bg="secondary">{station.Platform_Count}</Badge>
                    </td>
                    <td>
                      {isAdmin ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-2"
                            onClick={() => handleEdit(station)}
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(station.Station_ID)}
                          >
                            🗑️ Delete
                          </Button>
                        </>
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

      {/* Add/Edit Station Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingStation ? 'Edit Station' : 'Add New Station'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Station Code *</Form.Label>
              <Form.Control
                type="text"
                value={stationForm.stationCode}
                onChange={(e) => setStationForm({...stationForm, stationCode: e.target.value.toUpperCase()})}
                placeholder="e.g., TPTY, SBC"
                maxLength="10"
                required
                disabled={editingStation !== null}
              />
              <Form.Text>3-5 letter code</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Station Name *</Form.Label>
              <Form.Control
                type="text"
                value={stationForm.stationName}
                onChange={(e) => setStationForm({...stationForm, stationName: e.target.value})}
                placeholder="e.g., Tirupati Railway Station"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City *</Form.Label>
              <Form.Control
                type="text"
                value={stationForm.city}
                onChange={(e) => setStationForm({...stationForm, city: e.target.value})}
                placeholder="e.g., Tirupati"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>State *</Form.Label>
              <Form.Control
                type="text"
                value={stationForm.state}
                onChange={(e) => setStationForm({...stationForm, state: e.target.value})}
                placeholder="e.g., Andhra Pradesh"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Platform Count *</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="30"
                value={stationForm.platformCount}
                onChange={(e) => setStationForm({...stationForm, platformCount: e.target.value})}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : editingStation ? 'Update Station' : 'Add Station'}
              </Button>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Stations;
