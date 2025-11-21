const db = require('../config/db');

// Register new passenger
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, age, gender } = req.body;
    
    // Check if email already exists
    const [existing] = await db.query(
      'SELECT * FROM Passenger WHERE Email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Insert passenger (Passenger table has: First_Name, Last_Name, Age, Gender, Email)
    const [result] = await db.query(
      'INSERT INTO Passenger (First_Name, Last_Name, Age, Gender, Email) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, age, gender, email]
    );
    
    const passengerId = result.insertId;
    
    // Automatically create a railway card for the new passenger
    const cardNumber = `CARD${Date.now()}${passengerId}`.substring(0, 20); // Generate unique card number
    const issueDate = new Date().toISOString().split('T')[0]; // Today's date
    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 1 year from now
    const cardType = 'Senior Citizen'; // Default card type
    
    await db.query(
      'INSERT INTO Railway_Card (Card_Number, Card_Type, Issue_Date, Expiry_Date, Passenger_ID) VALUES (?, ?, ?, ?, ?)',
      [cardNumber, cardType, issueDate, expiryDate, passengerId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Registration successful! A railway card has been created for you.',
      passenger_id: passengerId,
      card_number: cardNumber
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find passenger by email only (Password bypassed for testing)
    const [rows] = await db.query(
      'SELECT Passenger_ID, First_Name, Last_Name, Email, Age, Gender FROM Passenger WHERE Email = ?',
      [email]
    );
    
    // If email not found, just use first passenger in database for testing
    let user;
    if (rows.length === 0) {
      const [allUsers] = await db.query(
        'SELECT Passenger_ID, First_Name, Last_Name, Email, Age, Gender FROM Passenger LIMIT 1'
      );
      if (allUsers.length > 0) {
        user = allUsers[0];
      } else {
        return res.status(401).json({
          success: false,
          message: 'No passengers found in database'
        });
      }
    } else {
      user = rows[0];
    }
    
    // Detect admin role based on email
    const isAdmin = user.Email && user.Email.toLowerCase().includes('admin');
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.Passenger_ID,
        name: `${user.First_Name} ${user.Last_Name}`,
        email: user.Email,
        age: user.Age,
        gender: user.Gender,
        role: isAdmin ? 'admin' : 'passenger'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const [rows] = await db.query(
      'SELECT Passenger_ID, First_Name, Last_Name, Email, Age, Gender FROM Passenger WHERE Passenger_ID = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = rows[0];
    res.json({
      success: true,
      user: {
        id: user.Passenger_ID,
        name: `${user.First_Name} ${user.Last_Name}`,
        email: user.Email,
        age: user.Age,
        gender: user.Gender
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};
