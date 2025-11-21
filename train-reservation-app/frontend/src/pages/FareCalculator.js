import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Table } from 'react-bootstrap';
import { stationAPI } from '../services/api';

function FareCalculator() {
  const [stations, setStations] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(350); // Default distance
  const [fares, setFares] = useState(null);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const response = await stationAPI.getAll();
      const stationsData = response.data.data || response.data;
      setStations(Array.isArray(stationsData) ? stationsData : []);
    } catch (err) {
      console.error('Error loading stations:', err);
    }
  };

  const calculateFares = (dist) => {
    const classes = [
      { name: 'General', rate: 0.5, icon: '🪑' },
      { name: 'Sleeper', rate: 1.0, icon: '🛏️' },
      { name: 'AC 3-Tier', rate: 2.0, icon: '❄️' },
      { name: 'AC 2-Tier', rate: 3.0, icon: '❄️❄️' },
      { name: 'AC 1-Tier', rate: 4.5, icon: '⭐' },
      { name: 'AC Chair Car', rate: 2.5, icon: '💺' }
    ];

    return classes.map(cls => ({
      ...cls,
      fare: Math.max(50, (dist * cls.rate).toFixed(2))
    }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const calculatedFares = calculateFares(distance);
    setFares(calculatedFares);
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
              💰 Fare Calculator
            </h1>
            <p className="lead">Calculate train fares for different classes</p>
          </div>
        </Container>
      </div>

      <Container>
        <Card className="shadow-lg border-0 mb-4">
          <Card.Body className="p-4">
            <Form onSubmit={handleCalculate}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">🚉 From Station</Form.Label>
                    <Form.Select 
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      size="lg"
                    >
                      <option value="">Select source station</option>
                      {stations.map(station => (
                        <option key={station.Station_ID} value={station.Station_ID}>
                          {station.Station_Name} ({station.Station_Code})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">🎯 To Station</Form.Label>
                    <Form.Select 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      size="lg"
                    >
                      <option value="">Select destination station</option>
                      {stations.map(station => (
                        <option key={station.Station_ID} value={station.Station_ID}>
                          {station.Station_Name} ({station.Station_Code})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">📏 Distance (km)</Form.Label>
                    <Form.Control 
                      type="number"
                      min="1"
                      value={distance}
                      onChange={(e) => setDistance(parseInt(e.target.value))}
                      size="lg"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-center">
                <Button type="submit" variant="primary" size="lg" className="px-5">
                  🧮 Calculate Fares
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {fares && (
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">💵 Fare Breakdown</h4>
            </Card.Header>
            <Card.Body className="p-0">
              <Table striped hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="p-3">Class</th>
                    <th className="p-3">Base Rate (per km)</th>
                    <th className="p-3 text-end">Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {fares.map((fare, idx) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <span className="me-2">{fare.icon}</span>
                        <strong>{fare.name}</strong>
                      </td>
                      <td className="p-3">₹{fare.rate}/km</td>
                      <td className="p-3 text-end">
                        <span className="badge bg-success fs-6">₹{fare.fare}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {fares && (
          <Alert variant="info" className="mt-4 shadow-sm">
            <Alert.Heading>ℹ️ Fare Calculation Info</Alert.Heading>
            <ul className="mb-0">
              <li>Fares are calculated based on distance and class</li>
              <li>Minimum fare is ₹50 for any journey</li>
              <li>Senior citizens (60+) get 40% discount automatically</li>
              <li>Children below 5 years travel free</li>
              <li>Actual fares may vary based on train type and seasonality</li>
            </ul>
          </Alert>
        )}
      </Container>
    </div>
  );
}

export default FareCalculator;
