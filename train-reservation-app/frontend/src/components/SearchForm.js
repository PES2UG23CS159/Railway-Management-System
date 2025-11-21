import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { stationAPI } from '../services/api';

function SearchForm({ onSearch }) {
  const [stations, setStations] = useState([]);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    journeyDate: ''
  });

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const response = await stationAPI.getAll();
      // Handle both response formats
      const stationsData = response.data.data || response.data;
      setStations(Array.isArray(stationsData) ? stationsData : []);
    } catch (error) {
      console.error('Error loading stations:', error);
      setStations([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4 p-4 bg-light rounded">
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>From Station</Form.Label>
            <Form.Select 
              name="source" 
              value={formData.source} 
              onChange={handleChange}
              required
            >
              <option value="">Select Source</option>
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
            <Form.Label>To Station</Form.Label>
            <Form.Select 
              name="destination" 
              value={formData.destination} 
              onChange={handleChange}
              required
            >
              <option value="">Select Destination</option>
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
            <Form.Label>Journey Date</Form.Label>
            <Form.Control 
              type="date" 
              name="journeyDate" 
              value={formData.journeyDate} 
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Button variant="primary" type="submit" size="lg">
        🔍 Search Trains
      </Button>
    </Form>
  );
}

export default SearchForm;
