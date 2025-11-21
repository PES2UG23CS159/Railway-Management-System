import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

function Trains() {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingTrain, setEditingTrain] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    stationId: '',
    arrivalTime: '',
    departureTime: '',
    platformNumber: '',
    stopNumber: '',
    distanceFromSource: ''
  });
  const [formData, setFormData] = useState({
    trainName: '',
    trainType: 'Express',
    totalSeats: 500
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setIsAdmin(user?.role === 'admin');
    fetchTrains();
    fetchStations();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/trains');
      setTrains(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching trains:', error);
      setMessage({ type: 'danger', text: 'Failed to fetch trains' });
      setTrains([]);
    }
  };

  const fetchStations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stations');
      setStations(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching stations:', error);
      setStations([]);
    }
  };

  const fetchSchedules = async (trainId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/schedules/train/${trainId}`);
      setSchedules(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
    }
  };

  const handleShowModal = (train = null) => {
    if (train) {
      setEditingTrain(train);
      setFormData({
        trainName: train.Train_Name,
        trainType: train.Train_Type,
        totalSeats: train.Total_Seats
      });
    } else {
      setEditingTrain(null);
      setFormData({
        trainName: '',
        trainType: 'Express',
        totalSeats: 500
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTrain(null);
    setFormData({
      trainName: '',
      trainType: 'Express',
      totalSeats: 500
    });
  };

  const handleShowScheduleModal = async (train) => {
    setSelectedTrain(train);
    await fetchSchedules(train.Train_ID);
    setShowScheduleModal(true);
  };

  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedTrain(null);
    setSchedules([]);
    setNewSchedule({
      stationId: '',
      arrivalTime: '',
      departureTime: '',
      platformNumber: '',
      stopNumber: '',
      distanceFromSource: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrain) {
        await axios.put(`http://localhost:5000/api/trains/${editingTrain.Train_ID}`, {
          trainName: formData.trainName,
          trainType: formData.trainType,
          totalSeats: formData.totalSeats
        });
        setMessage({ type: 'success', text: 'Train updated successfully!' });
      } else {
        await axios.post('http://localhost:5000/api/trains', {
          trainName: formData.trainName,
          trainType: formData.trainType,
          totalSeats: formData.totalSeats
        });
        setMessage({ type: 'success', text: 'Train added successfully!' });
      }
      handleCloseModal();
      fetchTrains();
    } catch (error) {
      console.error('Error saving train:', error);
      setMessage({ type: 'danger', text: 'Failed to save train' });
    }
  };

  const handleDelete = async (trainId) => {
    if (window.confirm('Are you sure you want to delete this train?')) {
      try {
        await axios.delete(`http://localhost:5000/api/trains/${trainId}`);
        setMessage({ type: 'success', text: 'Train deleted successfully!' });
        fetchTrains();
      } catch (error) {
        console.error('Error deleting train:', error);
        setMessage({ type: 'danger', text: 'Failed to delete train' });
      }
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/schedules', {
        trainId: selectedTrain.Train_ID,
        stationId: newSchedule.stationId,
        arrivalTime: newSchedule.arrivalTime || null,
        departureTime: newSchedule.departureTime || null,
        platformNumber: newSchedule.platformNumber,
        stopNumber: newSchedule.stopNumber,
        distanceFromSource: newSchedule.distanceFromSource
      });
      setMessage({ type: 'success', text: 'Schedule added successfully!' });
      await fetchSchedules(selectedTrain.Train_ID);
      setNewSchedule({
        stationId: '',
        arrivalTime: '',
        departureTime: '',
        platformNumber: '',
        stopNumber: '',
        distanceFromSource: ''
      });
    } catch (error) {
      console.error('Error adding schedule:', error);
      setMessage({ type: 'danger', text: 'Failed to add schedule' });
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await axios.delete(`http://localhost:5000/api/schedules/${scheduleId}`);
        setMessage({ type: 'success', text: 'Schedule deleted successfully!' });
        await fetchSchedules(selectedTrain.Train_ID);
      } catch (error) {
        console.error('Error deleting schedule:', error);
        setMessage({ type: 'danger', text: 'Failed to delete schedule' });
      }
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>🚂 Trains Management</h3>
          {isAdmin && (
            <Button variant="primary" onClick={() => handleShowModal()}>
              + Add New Train
            </Button>
          )}
          {!isAdmin && (
            <Badge bg="info">View Only Mode</Badge>
          )}
        </Card.Header>
        <Card.Body>
          {message.text && (
            <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
              {message.text}
            </Alert>
          )}

          {trains.length === 0 ? (
            <Alert variant="info">
              No trains found. {isAdmin && 'Click "Add New Train" to create one.'}
            </Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Train ID</th>
                  <th>Train Name</th>
                  <th>Type</th>
                  <th>Total Seats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trains.map((train) => (
                  <tr key={train.Train_ID}>
                    <td>{train.Train_ID}</td>
                    <td>{train.Train_Name}</td>
                    <td>
                      <Badge bg={train.Train_Type === 'Superfast' ? 'danger' : train.Train_Type === 'Express' ? 'primary' : 'secondary'}>
                        {train.Train_Type}
                      </Badge>
                    </td>
                    <td>{train.Total_Seats}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowScheduleModal(train)}
                      >
                        📅 Schedule
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleShowModal(train)}
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(train.Train_ID)}
                          >
                            🗑️ Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Train Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTrain ? 'Edit Train' : 'Add New Train'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Train Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter train name"
                value={formData.trainName}
                onChange={(e) => setFormData({ ...formData, trainName: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Train Type</Form.Label>
              <Form.Select
                value={formData.trainType}
                onChange={(e) => setFormData({ ...formData, trainType: e.target.value })}
                required
              >
                <option value="Express">Express</option>
                <option value="Superfast">Superfast</option>
                <option value="Mail">Mail</option>
                <option value="Local">Local</option>
                <option value="Passenger">Passenger</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Seats</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter total seats"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                required
                min="1"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingTrain ? 'Update' : 'Add'} Train
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Schedule Management Modal */}
      <Modal show={showScheduleModal} onHide={handleCloseScheduleModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Schedule for {selectedTrain?.Train_Name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Existing Schedules */}
          <h5>Current Schedule</h5>
          {schedules.length === 0 ? (
            <Alert variant="info">No schedule added yet. Add stations below.</Alert>
          ) : (
            <Table striped bordered hover size="sm" className="mb-4">
              <thead>
                <tr>
                  <th>Stop #</th>
                  <th>Station</th>
                  <th>Arrival</th>
                  <th>Departure</th>
                  <th>Platform</th>
                  <th>Distance (km)</th>
                  {isAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.Schedule_ID}>
                    <td>{schedule.Stop_Number}</td>
                    <td>{schedule.Station_Name}</td>
                    <td>{schedule.Arrival_Time || '-'}</td>
                    <td>{schedule.Departure_Time || '-'}</td>
                    <td>{schedule.Platform_Number}</td>
                    <td>{schedule.Distance_From_Source}</td>
                    {isAdmin && (
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteSchedule(schedule.Schedule_ID)}
                        >
                          🗑️
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Add New Schedule */}
          {isAdmin && (
            <>
              <hr />
              <h5>Add New Stop</h5>
              <Form onSubmit={handleAddSchedule}>
                <Form.Group className="mb-3">
                  <Form.Label>Station</Form.Label>
                  <Form.Select
                    value={newSchedule.stationId}
                    onChange={(e) => setNewSchedule({ ...newSchedule, stationId: e.target.value })}
                    required
                  >
                    <option value="">Select Station</option>
                    {stations.map((station) => (
                      <option key={station.Station_ID} value={station.Station_ID}>
                        {station.Station_Name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Arrival Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={newSchedule.arrivalTime}
                        onChange={(e) => setNewSchedule({ ...newSchedule, arrivalTime: e.target.value })}
                      />
                      <Form.Text>Leave empty for first station</Form.Text>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Departure Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={newSchedule.departureTime}
                        onChange={(e) => setNewSchedule({ ...newSchedule, departureTime: e.target.value })}
                      />
                      <Form.Text>Leave empty for last station</Form.Text>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Platform Number</Form.Label>
                      <Form.Control
                        type="number"
                        value={newSchedule.platformNumber}
                        onChange={(e) => setNewSchedule({ ...newSchedule, platformNumber: e.target.value })}
                        required
                        min="1"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Stop Number</Form.Label>
                      <Form.Control
                        type="number"
                        value={newSchedule.stopNumber}
                        onChange={(e) => setNewSchedule({ ...newSchedule, stopNumber: e.target.value })}
                        required
                        min="1"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Distance (km)</Form.Label>
                      <Form.Control
                        type="number"
                        value={newSchedule.distanceFromSource}
                        onChange={(e) => setNewSchedule({ ...newSchedule, distanceFromSource: e.target.value })}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </div>
                </div>

                <Button variant="success" type="submit">
                  + Add Stop to Schedule
                </Button>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Trains;
