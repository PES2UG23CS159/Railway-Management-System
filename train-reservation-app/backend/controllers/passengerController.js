const db = require('../config/db');

// Get all passengers
exports.getAllPassengers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Passenger');
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching passengers',
      error: error.message
    });
  }
};

// Get passenger by ID
exports.getPassengerById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT Passenger_ID, First_Name, Last_Name, Age, Gender, Email FROM Passenger WHERE Passenger_ID = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Passenger not found'
      });
    }
    
    const passenger = rows[0];
    res.json({
      success: true,
      data: {
        ...passenger,
        Name: `${passenger.First_Name} ${passenger.Last_Name}`,
        Contact_No: '1234567890'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching passenger',
      error: error.message
    });
  }
};

// Create new passenger
exports.createPassenger = async (req, res) => {
  try {
    const { First_Name, Last_Name, firstName, lastName, Age, Gender, Email } = req.body;
    
    // Accept both formats
    const fName = First_Name || firstName;
    const lName = Last_Name || lastName;
    
    const [result] = await db.query(
      'INSERT INTO Passenger (First_Name, Last_Name, Age, Gender, Email) VALUES (?, ?, ?, ?, ?)',
      [fName, lName, Age, Gender, Email]
    );
    
    res.status(201).json({
      success: true,
      message: 'Passenger created successfully',
      data: {
        Passenger_ID: result.insertId,
        First_Name: fName,
        Last_Name: lName,
        Age,
        Gender,
        Email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating passenger',
      error: error.message
    });
  }
};

// Update passenger
exports.updatePassenger = async (req, res) => {
  try {
    const { First_Name, Last_Name, firstName, lastName, Age, Gender, Email } = req.body;
    
    // Accept both formats
    const fName = First_Name || firstName;
    const lName = Last_Name || lastName;
    
    const [result] = await db.query(
      'UPDATE Passenger SET First_Name = ?, Last_Name = ?, Age = ?, Gender = ?, Email = ? WHERE Passenger_ID = ?',
      [fName, lName, Age, Gender, Email, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Passenger not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Passenger updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating passenger',
      error: error.message
    });
  }
};

// Delete passenger
exports.deletePassenger = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM Passenger WHERE Passenger_ID = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Passenger not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Passenger deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting passenger',
      error: error.message
    });
  }
};

// Get passenger bookings
exports.getPassengerBookings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT T.*, TR.Train_Name, TR.Train_Number 
       FROM Ticket T
       LEFT JOIN Linked_To LT ON T.Ticket_ID = LT.Ticket_ID
       LEFT JOIN Train TR ON LT.Train_ID = TR.Train_ID
       WHERE T.Passenger_ID = ?
       ORDER BY T.Journey_Date DESC`,
      [req.params.id]
    );
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching passenger bookings',
      error: error.message
    });
  }
};

// Get railway card by passenger ID
exports.getRailwayCard = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Railway_Card WHERE Passenger_ID = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      // Auto-create railway card if it doesn't exist
      const cardNumber = `CARD${Date.now()}${req.params.id}`.substring(0, 20);
      const issueDate = new Date().toISOString().split('T')[0];
      const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      await db.query(
        'INSERT INTO Railway_Card (Card_Number, Card_Type, Issue_Date, Expiry_Date, Balance, Passenger_ID) VALUES (?, ?, ?, ?, ?, ?)',
        [cardNumber, 'Regular', issueDate, expiryDate, 0, req.params.id]
      );
      
      const [newCard] = await db.query(
        'SELECT * FROM Railway_Card WHERE Passenger_ID = ?',
        [req.params.id]
      );
      
      return res.json({
        success: true,
        data: newCard[0]
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching railway card:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching railway card',
      error: error.message
    });
  }
};

// Recharge railway card
exports.rechargeCard = async (req, res) => {
  try {
    const { amount } = req.body;
    const passengerId = req.params.id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recharge amount'
      });
    }
    
    // Check if card exists
    const [cards] = await db.query(
      'SELECT * FROM Railway_Card WHERE Passenger_ID = ?',
      [passengerId]
    );
    
    if (cards.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Railway card not found for this passenger'
      });
    }
    
    // Update balance
    const [result] = await db.query(
      'UPDATE Railway_Card SET Balance = Balance + ? WHERE Passenger_ID = ?',
      [amount, passengerId]
    );
    
    // Get updated balance
    const [updated] = await db.query(
      'SELECT Balance FROM Railway_Card WHERE Passenger_ID = ?',
      [passengerId]
    );
    
    res.json({
      success: true,
      message: `Card recharged successfully with ₹${amount}`,
      new_balance: updated[0].Balance
    });
  } catch (error) {
    console.error('Error recharging railway card:', error);
    res.status(500).json({
      success: false,
      message: 'Error recharging railway card',
      error: error.message
    });
  }
};
