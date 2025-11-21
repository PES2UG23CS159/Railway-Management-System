import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchTrains from './pages/SearchTrains';
import BookTicket from './pages/BookTicket';
import MyTickets from './pages/MyTickets';
import Profile from './pages/Profile';
import FareCalculator from './pages/FareCalculator';
import Admin from './pages/Admin';
import AdminProfile from './pages/AdminProfile';
import RoutesPage from './pages/Routes';
import Stations from './pages/Stations';
import Smartcards from './pages/Smartcards';
import TrainSchedule from './pages/TrainSchedule';
import Trains from './pages/Trains';

// Components
import Navbar from './components/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);

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

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchTrains />} />
            <Route path="/book/:trainId" element={<BookTicket />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/fare-calculator" element={<FareCalculator />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/trains" element={<Trains />} />
            <Route path="/smartcards" element={<Smartcards />} />
            <Route path="/schedule" element={<TrainSchedule />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
