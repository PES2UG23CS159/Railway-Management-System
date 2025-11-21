import React, { useState } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import SearchForm from '../components/SearchForm';
import TrainCard from '../components/TrainCard';
import { trainAPI } from '../services/api';

function SearchTrains() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchData) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await trainAPI.search(
        searchData.source, 
        searchData.destination
      );
      // Handle both response formats
      const trainsData = response.data.data || response.data;
      setTrains(Array.isArray(trainsData) ? trainsData : []);
    } catch (err) {
      setError('Failed to search trains. Please try again.');
      console.error('Search error:', err);
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Search Trains</h2>
      
      <SearchForm onSearch={handleSearch} />

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Searching trains...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!loading && searched && trains.length === 0 && (
        <Alert variant="info">
          No trains found for the selected route. Please try different stations.
        </Alert>
      )}

      {!loading && trains.length > 0 && (
        <div>
          <h4 className="mb-3">Available Trains ({trains.length})</h4>
          {trains.map(train => (
            <TrainCard key={train.Train_ID} train={train} />
          ))}
        </div>
      )}
    </Container>
  );
}

export default SearchTrains;
