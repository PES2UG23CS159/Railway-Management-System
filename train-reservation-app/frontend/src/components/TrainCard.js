import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TrainCard({ train }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/book/${train.Train_ID}`);
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          <span>{train.Train_Name}</span>
          <span className="badge bg-primary">{train.Train_Number}</span>
        </Card.Title>
        <div>
          <div className="mb-2">
            <strong>Type:</strong> {train.Train_Type} | 
            <strong> Capacity:</strong> {train.Capacity} passengers
          </div>
          {train.Source_Name && train.Destination_Name && (
            <div className="mb-2">
              <strong>Route:</strong> {train.Source_Name} → {train.Destination_Name}
              {train.Distance_KM && (
                <>
                  <br />
                  <strong>Distance:</strong> {train.Distance_KM} km
                </>
              )}
            </div>
          )}
          {train.Departure_Time && train.Arrival_Time && (
            <div className="text-muted">
              <strong>Departure:</strong> {train.Departure_Time} | <strong>Arrival:</strong> {train.Arrival_Time}
            </div>
          )}
        </div>
        <Button variant="success" onClick={handleBookNow}>
          Book Now
        </Button>
      </Card.Body>
    </Card>
  );
}

export default TrainCard;
