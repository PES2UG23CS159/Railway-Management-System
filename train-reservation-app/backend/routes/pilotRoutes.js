const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all loco pilots
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM Loco_Pilot 
      ORDER BY Date_of_Joining DESC
    `);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET pilot by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Loco_Pilot WHERE Loco_Pilot_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pilot not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new pilot
router.post('/', async (req, res) => {
  try {
    const { Name, Role, Age, License_Number, Experience_Years, Station_ID } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO Loco_Pilot (Name, Role, Age, License_Number, Experience_Years, Station_ID) VALUES (?, ?, ?, ?, ?, ?)',
      [Name, Role, Age, License_Number, Experience_Years, Station_ID]
    );
    
    res.status(201).json({
      success: true,
      message: 'Pilot created successfully',
      pilot_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update pilot
router.put('/:id', async (req, res) => {
  try {
    const { Name, Role, Age, License_Number, Experience_Years, Station_ID } = req.body;
    
    const [result] = await db.query(
      'UPDATE Loco_Pilot SET Name = ?, Role = ?, Age = ?, License_Number = ?, Experience_Years = ?, Station_ID = ? WHERE Loco_Pilot_ID = ?',
      [Name, Role, Age, License_Number, Experience_Years, Station_ID, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pilot not found' });
    }
    
    res.json({ success: true, message: 'Pilot updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE pilot
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Loco_Pilot WHERE Loco_Pilot_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pilot not found' });
    }
    
    res.json({ success: true, message: 'Pilot deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
