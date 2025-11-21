import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function TrainSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const trainsRes = await axios.get(`${API_URL}/trains`);
      setTrains(trainsRes.data.data || trainsRes.data || []);
      
      // Load all schedules
      loadSchedules();
    } catch (err) {
      console.error('Error loading data:', err);
      setMessage({ type: 'danger', text: 'Failed to load data' });
    }
  };

  const loadSchedules = async (trainId = null) => {
    try {
      const url = trainId 
        ? `${API_URL}/schedules?train_id=${trainId}`
        : `${API_URL}/schedules`;
      
      const response = await axios.get(url);
      setSchedules(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error loading schedules:', err);
      // If endpoint doesn't exist, show sample data
      setSchedules([]);
    }
  };

  const handleTrainChange = (trainId) => {
    setSelectedTrain(trainId);
    if (trainId) {
      loadSchedules(trainId);
    } else {
      loadSchedules();
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">🕐 Train Schedule</h2>

      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Train</Form.Label>
            <Form.Select 
              value={selectedTrain}
              onChange={(e) => handleTrainChange(e.target.value)}
            >
              <option value="">All Trains</option>
              {trains.map(train => (
                <option key={train.Train_ID} value={train.Train_ID}>
                  {train.Train_Number} - {train.Train_Name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table striped hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Train</th>
                <th>Station</th>
                <th>Arrival Time</th>
                <th>Departure Time</th>
                <th>Platform</th>
                <th>Stop Number</th>
                <th>Distance</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="text-muted">
                      <h5>⚠️ Schedule Data Not Available</h5>
                      <p>Train schedule endpoint needs to be implemented in the backend.</p>
                      <p className="small">Table: <code>Train_Schedule</code></p>
                    </div>
                  </td>
                </tr>
              ) : (
                schedules.map((schedule, idx) => (
                  <tr key={idx}>
                    <td>
                      <div>
                        <strong>{schedule.Train_Number}</strong>
                        <div className="small text-muted">{schedule.Train_Name}</div>
                      </div>
                    </td>
                    <td>{schedule.Station_Name}</td>
                    <td className="text-success">{schedule.Arrival_Time}</td>
                    <td className="text-danger">{schedule.Departure_Time}</td>
                    <td>
                      <Badge bg="secondary">Platform {schedule.Platform_Number}</Badge>
                    </td>
                    <td>
                      <Badge bg="info">Stop {schedule.Stop_Number}</Badge>
                    </td>
                    <td>{schedule.Distance_From_Source} km</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {schedules.length > 0 && (
        <Card className="mt-4 bg-light">
          <Card.Body>
            <h6>� Schedule Statistics:</h6>
            <Row>
              <Col md={4}>
                <p className="mb-1"><strong>Total Schedules:</strong> {schedules.length}</p>
              </Col>
              <Col md={4}>
                <p className="mb-1"><strong>Trains:</strong> {new Set(schedules.map(s => s.Train_ID)).size}</p>
              </Col>
              <Col md={4}>
                <p className="mb-1"><strong>Stations:</strong> {new Set(schedules.map(s => s.Station_ID)).size}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default TrainSchedule;
