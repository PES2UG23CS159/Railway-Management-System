import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

function TicketCard({ ticket, onCancel }) {
  const getStatusBadge = (status) => {
    const variants = {
      'confirmed': 'success',
      'cancelled': 'danger',
      'waitlisted': 'warning',
      'pending': 'secondary'
    };
    return <Badge bg={variants[status.toLowerCase()] || 'secondary'}>{status}</Badge>;
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          <span>PNR: {ticket.PNR_Number}</span>
          {getStatusBadge(ticket.Status)}
        </Card.Title>
        <div className="row">
          <div className="col-md-6">
            <p className="mb-1">
              <strong>From:</strong> {ticket.Source_Station}
            </p>
            <p className="mb-1">
              <strong>To:</strong> {ticket.Destination_Station}
            </p>
            <p className="mb-1">
              <strong>Journey Date:</strong> {new Date(ticket.Journey_Date).toLocaleDateString()}
            </p>
          </div>
          <div className="col-md-6">
            <p className="mb-1">
              <strong>Class:</strong> {ticket.Class}
            </p>
            <p className="mb-1">
              <strong>Coach:</strong> {ticket.Coach_Number} | 
              <strong> Seat:</strong> {ticket.Seat_Number}
            </p>
            <p className="mb-1">
              <strong>Fare:</strong> ₹{ticket.Fare}
            </p>
          </div>
        </div>
        {ticket.Status.toLowerCase() === 'confirmed' && (
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onCancel(ticket.Ticket_ID)}
          >
            Cancel Ticket
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default TicketCard;
