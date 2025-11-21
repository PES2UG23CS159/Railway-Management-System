import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);

    // Listen for login events
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginStateChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStateChange', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <BSNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          🚂 Railway Reservation
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/search">Search Trains</Nav.Link>
            <Nav.Link as={Link} to="/stations">Stations</Nav.Link>
            <Nav.Link as={Link} to="/routes">Routes</Nav.Link>
            <Nav.Link as={Link} to="/trains">Trains</Nav.Link>
            <Nav.Link as={Link} to="/schedule">Schedule</Nav.Link>
            <Nav.Link as={Link} to="/smartcards">Smartcards</Nav.Link>
            <Nav.Link as={Link} to="/fare-calculator">Fare Calculator</Nav.Link>
            
            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Nav.Link as={Link} to="/my-tickets">My Tickets</Nav.Link>
                )}
                <Nav.Link as={Link} to={user.role === 'admin' ? '/admin-profile' : '/profile'}>
                  Profile
                </Nav.Link>
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" className="text-warning fw-bold">👨‍💼 Admin</Nav.Link>
                )}
                <Nav.Item className="d-flex align-items-center ms-3">
                  <span className="text-white me-3">👤 {user.name}</span>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </Nav.Item>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-warning fw-bold">
                Login / Register
              </Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
