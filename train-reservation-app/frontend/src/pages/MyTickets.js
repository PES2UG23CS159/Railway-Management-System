import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';
import TicketCard from '../components/TicketCard';
import { ticketAPI } from '../services/api';

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchPNR, setSearchPNR] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, statusFilter, searchPNR, sortBy]);

  const loadTickets = async () => {
    try {
      const response = await ticketAPI.getAll();
      // Handle both response formats
      const ticketsData = response.data.data || response.data;
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
    } catch (err) {
      setError('Failed to load tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(t => t.Status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Filter by PNR search
    if (searchPNR) {
      filtered = filtered.filter(t => t.PNR_Number.toLowerCase().includes(searchPNR.toLowerCase()));
    }

    // Sort
    switch(sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.Journey_Date) - new Date(a.Journey_Date));
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.Journey_Date) - new Date(b.Journey_Date));
        break;
      case 'fare-high':
        filtered.sort((a, b) => b.Fare - a.Fare);
        break;
      case 'fare-low':
        filtered.sort((a, b) => a.Fare - b.Fare);
        break;
      default:
        break;
    }

    setFilteredTickets(filtered);
  };

  const handleCancelClick = (ticketId) => {
    setSelectedTicket(ticketId);
    setShowModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await ticketAPI.cancel(selectedTicket);
      setShowModal(false);
      setSelectedTicket(null);
      loadTickets(); // Reload tickets
      alert('Ticket cancelled successfully');
    } catch (err) {
      alert('Failed to cancel ticket: ' + (err.response?.data?.error || err.message));
    }
  };

  const getStatusCounts = () => {
    const counts = {
      All: tickets.length,
      Confirmed: tickets.filter(t => t.Status.toLowerCase() === 'confirmed').length,
      Cancelled: tickets.filter(t => t.Status.toLowerCase() === 'cancelled').length,
      Waiting: tickets.filter(t => t.Status.toLowerCase() === 'waiting').length,
      RAC: tickets.filter(t => t.Status.toLowerCase() === 'rac').length,
    };
    return counts;
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your tickets...</p>
      </Container>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <Container>
      <h2 className="mb-4">🎫 My Tickets</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {tickets.length === 0 ? (
        <Alert variant="info">
          You haven't booked any tickets yet. 
          <Alert.Link href="/search"> Search trains</Alert.Link> to book your first ticket.
        </Alert>
      ) : (
        <div>
          {/* Filter Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">🔍 Search by PNR</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter PNR number"
                      value={searchPNR}
                      onChange={(e) => setSearchPNR(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">📊 Filter by Status</Form.Label>
                    <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="All">All Tickets ({statusCounts.All})</option>
                      <option value="Confirmed">Confirmed ({statusCounts.Confirmed})</option>
                      <option value="Cancelled">Cancelled ({statusCounts.Cancelled})</option>
                      <option value="Waiting">Waiting ({statusCounts.Waiting})</option>
                      <option value="RAC">RAC ({statusCounts.RAC})</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold small">🔄 Sort by</Form.Label>
                    <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="date-desc">Journey Date (Newest First)</option>
                      <option value="date-asc">Journey Date (Oldest First)</option>
                      <option value="fare-high">Fare (High to Low)</option>
                      <option value="fare-low">Fare (Low to High)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>

          {/* Results Summary */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-muted mb-0">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </p>
            <div>
              {Object.entries(statusCounts).filter(([key]) => key !== 'All').map(([status, count]) => (
                count > 0 && (
                  <Badge 
                    key={status} 
                    bg={status === 'Confirmed' ? 'success' : status === 'Cancelled' ? 'danger' : 'warning'}
                    className="ms-2"
                  >
                    {status}: {count}
                  </Badge>
                )
              ))}
            </div>
          </div>

          {/* Tickets List */}
          {filteredTickets.length === 0 ? (
            <Alert variant="warning">
              No tickets found matching your filters. Try adjusting your search criteria.
            </Alert>
          ) : (
            filteredTickets.map(ticket => (
              <TicketCard 
                key={ticket.Ticket_ID} 
                ticket={ticket}
                onCancel={handleCancelClick}
              />
            ))
          )}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this ticket? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No, Keep Ticket
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Yes, Cancel Ticket
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyTickets;
