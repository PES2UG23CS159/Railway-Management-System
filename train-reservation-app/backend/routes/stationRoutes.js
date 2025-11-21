const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all stations
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Station ORDER BY City');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET station by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Station WHERE Station_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new station
router.post('/', async (req, res) => {
  try {
    console.log('Received station data:', req.body);
    const { stationCode, stationName, city, state, platformCount } = req.body;
    
    if (!stationCode || !stationName || !city || !state) {
      return res.status(400).json({ 
        success: false, 
        message: 'Station code, name, city, and state are required' 
      });
    }
    
    const [result] = await db.query(
      'INSERT INTO Station (Station_Code, Station_Name, City, State, Platform_Count) VALUES (?, ?, ?, ?, ?)',
      [stationCode, stationName, city, state, platformCount || 1]
    );
    
    res.status(201).json({
      success: true,
      message: 'Station created successfully',
      station_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating station:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update station
router.put('/:id', async (req, res) => {
  try {
    const { stationCode, stationName, city, state, platformCount } = req.body;
    
    const [result] = await db.query(
      'UPDATE Station SET Station_Code = ?, Station_Name = ?, City = ?, State = ?, Platform_Count = ? WHERE Station_ID = ?',
      [stationCode, stationName, city, state, platformCount || 1, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }
    
    res.json({ success: true, message: 'Station updated successfully' });
  } catch (error) {
    console.error('Error updating station:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE station
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Station WHERE Station_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }
    
    res.json({ success: true, message: 'Station deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
