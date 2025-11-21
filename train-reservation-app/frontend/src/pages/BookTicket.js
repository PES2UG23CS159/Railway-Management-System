import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { trainAPI, ticketAPI, passengerAPI } from '../services/api';

function BookTicket() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  
  const [train, setTrain] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';

  const [bookingData, setBookingData] = useState({
    passengerId: '',
    passengerName: '',
    journeyDate: '',
    sourceStation: '',
    destinationStation: '',
    class: 'Sleeper',
    coachNumber: '',
    seatNumber: ''
  });

  useEffect(() => {
    loadData();
  }, [trainId]);

  const loadData = async () => {
    try {
      const [trainRes, passengersRes] = await Promise.all([
        trainAPI.getById(trainId),
        passengerAPI.getAll()
      ]);
      
      // Handle both response formats
      const trainData = trainRes.data.data || trainRes.data;
      const passengersData = passengersRes.data.data || passengersRes.data;
      
      setTrain(trainData);
      setPassengers(Array.isArray(passengersData) ? passengersData : []);
    } catch (err) {
      setError('Failed to load booking data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value
    });

    // When passenger is selected from dropdown, auto-fill the name
    if (name === 'passengerId' && value) {
      const selectedPassenger = passengers.find(p => p.Passenger_ID === parseInt(value));
      if (selectedPassenger) {
        setBookingData(prev => ({
          ...prev,
          passengerId: value,
          passengerName: `${selectedPassenger.First_Name} ${selectedPassenger.Last_Name}`
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await ticketAPI.book({
        passenger_id: parseInt(bookingData.passengerId),
        train_id: parseInt(trainId),
        journey_date: bookingData.journeyDate,
        source_station: bookingData.sourceStation,
        destination_station: bookingData.destinationStation,
        class: bookingData.class,
        coach_number: bookingData.coachNumber,
        seat_number: bookingData.seatNumber
      });

      setSuccess(`Ticket booked successfully! PNR: ${response.data.pnr}`);
      setTimeout(() => {
        navigate('/my-tickets');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to book ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading booking details...</p>
      </Container>
    );
  }

  if (!train) {
    return (
      <Container>
        <Alert variant="danger">Train not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Book Ticket</h2>

      {isAdmin && (
        <Alert variant="info" className="mb-3">
          <strong>👨‍💼 Admin Mode:</strong> You are booking a ticket for a passenger. Select an existing passenger from the dropdown or enter new passenger details.
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{train.Train_Name} ({train.Train_Number})</Card.Title>
          <Card.Text>
            <strong>Type:</strong> {train.Train_Type} | 
            <strong> Capacity:</strong> {train.Capacity}
          </Card.Text>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                {isAdmin ? '👤 Select Passenger *' : 'Select Passenger (Optional)'}
              </Form.Label>
              <Form.Select 
                name="passengerId" 
                value={bookingData.passengerId}
                onChange={handleChange}
                required={isAdmin}
              >
                <option value="">{isAdmin ? 'Choose a passenger to book for' : 'Choose existing passenger or enter name below'}</option>
                {passengers.map(p => (
                  <option key={p.Passenger_ID} value={p.Passenger_ID}>
                    {p.First_Name} {p.Last_Name} - {p.Email}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                {isAdmin ? 'Required: Select which passenger this ticket is for' : 'Select a saved passenger or manually enter name below'}
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Passenger Name *</Form.Label>
              <Form.Control 
                type="text"
                name="passengerName"
                value={bookingData.passengerName}
                onChange={handleChange}
                placeholder="Enter passenger name"
                required
                disabled={isAdmin && !bookingData.passengerId}
              />
              <Form.Text className="text-muted">
                {isAdmin ? 'Auto-filled when you select a passenger' : 'This will be shown on the ticket'}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Journey Date</Form.Label>
              <Form.Control 
                type="date"
                name="journeyDate"
                value={bookingData.journeyDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Class</Form.Label>
              <Form.Select 
                name="class"
                value={bookingData.class}
                onChange={handleChange}
                required
              >
                <option value="Sleeper">Sleeper</option>
                <option value="AC 3-Tier">AC 3-Tier</option>
                <option value="AC 2-Tier">AC 2-Tier</option>
                <option value="AC 1-Tier">AC 1-Tier</option>
                <option value="General">General</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Source Station</Form.Label>
              <Form.Control 
                type="text"
                name="sourceStation"
                value={bookingData.sourceStation}
                onChange={handleChange}
                placeholder="e.g., New Delhi"
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Destination Station</Form.Label>
              <Form.Control 
                type="text"
                name="destinationStation"
                value={bookingData.destinationStation}
                onChange={handleChange}
                placeholder="e.g., Mumbai"
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Coach Number</Form.Label>
              <Form.Control 
                type="text"
                name="coachNumber"
                value={bookingData.coachNumber}
                onChange={handleChange}
                placeholder="e.g., S1"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Seat Number</Form.Label>
              <Form.Control 
                type="text"
                name="seatNumber"
                value={bookingData.seatNumber}
                onChange={handleChange}
                placeholder="e.g., 25"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Booking...' : 'Book Ticket'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/search')}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default BookTicket;
