const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all smartcards
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT S.*, CONCAT(P.First_Name, ' ', P.Last_Name) as Passenger_Name 
      FROM Railway_Card S 
      JOIN Passenger P ON S.Passenger_ID = P.Passenger_ID
    `);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET smartcard by passenger ID
router.get('/passenger/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Railway_Card WHERE Passenger_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Smartcard not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new smartcard
router.post('/', async (req, res) => {
  try {
    const { Passenger_ID, Balance, Issue_Date, Validity } = req.body;
    
    // Generate unique card number
    const cardNumber = `RC-${Date.now()}-${Passenger_ID}`.substring(0, 20);
    
    // Calculate expiry date based on validity
    const issueDate = Issue_Date || new Date().toISOString().split('T')[0];
    const validityYears = Validity === '1 Year' ? 1 : Validity === '2 Years' ? 2 : Validity === '5 Years' ? 5 : 1;
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + validityYears);
    const expiryDateStr = expiryDate.toISOString().split('T')[0];
    
    // Determine card type based on passenger age
    const [passenger] = await db.query('SELECT Age FROM Passenger WHERE Passenger_ID = ?', [Passenger_ID]);
    const cardType = passenger[0] && passenger[0].Age >= 60 ? 'Senior Citizen' : 'Regular';
    
    const [result] = await db.query(
      'INSERT INTO Railway_Card (Card_Number, Card_Type, Issue_Date, Expiry_Date, Balance, Passenger_ID) VALUES (?, ?, ?, ?, ?, ?)',
      [cardNumber, cardType, issueDate, expiryDateStr, Balance || 100, Passenger_ID]
    );
    
    res.status(201).json({
      success: true,
      message: 'Railway Card issued successfully',
      card_id: result.insertId,
      card_number: cardNumber
    });
  } catch (error) {
    console.error('Error creating railway card:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST recharge smartcard
router.post('/:id/recharge', async (req, res) => {
  try {
    const { amount } = req.body;
    const [result] = await db.query(
      'UPDATE Railway_Card SET Balance = Balance + ? WHERE Card_ID = ?',
      [amount, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Railway Card not found' });
    }
    res.json({ success: true, message: 'Railway Card recharged successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
