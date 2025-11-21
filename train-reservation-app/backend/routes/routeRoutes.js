const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all routes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Route');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET route by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Route WHERE Route_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new route
router.post('/', async (req, res) => {
  try {
    const { Route_Name, Start_Station_ID, End_Station_ID, Distance_KM, Route_Type } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO Route (Route_Name, Start_Station_ID, End_Station_ID, Distance_KM, Route_Type) VALUES (?, ?, ?, ?, ?)',
      [Route_Name, Start_Station_ID, End_Station_ID, Distance_KM, Route_Type || 'Express']
    );
    
    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      route_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update route
router.put('/:id', async (req, res) => {
  try {
    const { Route_Name, Distance_KM, Route_Type } = req.body;
    
    const [result] = await db.query(
      'UPDATE Route SET Route_Name = ?, Distance_KM = ?, Route_Type = ? WHERE Route_ID = ?',
      [Route_Name, Distance_KM, Route_Type, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    
    res.json({ success: true, message: 'Route updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE route
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Route WHERE Route_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    
    res.json({ success: true, message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
