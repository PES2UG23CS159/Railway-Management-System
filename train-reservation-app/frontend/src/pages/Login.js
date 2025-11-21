import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: 'passenger'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Admin login
      if (loginData.role === 'admin') {
        if (loginData.email === 'admin@railway.com' && loginData.password === 'admin123') {
          const user = {
            email: 'admin@railway.com',
            name: 'Admin',
            role: 'admin',
            id: 0
          };
          localStorage.setItem('user', JSON.stringify(user));
          window.dispatchEvent(new Event('loginStateChange'));
          navigate('/admin');
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        // Passenger login - check against database (password bypassed for testing)
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: loginData.email,
            password: 'any' // Password is bypassed in backend
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const user = {
            ...data.user,
            role: 'passenger'
          };
          localStorage.setItem('user', JSON.stringify(user));
          window.dispatchEvent(new Event('loginStateChange'));
          navigate('/');
        } else {
          setError('Email not found. Please check your email address.');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '60px',
      paddingBottom: '60px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="text-center mb-4">
              <h1 className="text-white display-4 fw-bold mb-2">🚂 Railway System</h1>
              <p className="text-white-50 lead">Login to your account</p>
            </div>

            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <h3 className="text-center mb-4">Welcome Back</h3>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Login As</Form.Label>
                    <div className="d-flex gap-3">
                      <Form.Check
                        type="radio"
                        name="role"
                        value="passenger"
                        label="👤 Passenger"
                        checked={loginData.role === 'passenger'}
                        onChange={handleChange}
                      />
                      <Form.Check
                        type="radio"
                        name="role"
                        value="admin"
                        label="👨‍💼 Admin"
                        checked={loginData.role === 'admin'}
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      size="lg"
                    />
                  </Form.Group>

                  {loginData.role === 'admin' && (
                    <Alert variant="info" className="small">
                      <strong>Admin Demo Credentials:</strong><br />
                      Email: admin@railway.com<br />
                      Password: admin123
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>

                  {loginData.role === 'passenger' && (
                    <div className="text-center">
                      <p className="mb-0">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-decoration-none fw-bold">
                          Register here
                        </Link>
                      </p>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-3">
              <Link to="/" className="text-white text-decoration-none">
                ← Back to Home
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
