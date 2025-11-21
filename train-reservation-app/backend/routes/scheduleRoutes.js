const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all train schedules
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ts.*,
        t.Train_Name,
        t.Train_Number,
        s.Station_Name,
        s.Station_Code
      FROM Train_Schedule ts
      JOIN Train t ON ts.Train_ID = t.Train_ID
      JOIN Station s ON ts.Station_ID = s.Station_ID
      ORDER BY ts.Departure_Time
    `);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET schedule by train ID
router.get('/train/:trainId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ts.*,
        s.Station_Name,
        s.Station_Code
      FROM Train_Schedule ts
      JOIN Station s ON ts.Station_ID = s.Station_ID
      WHERE ts.Train_ID = ?
      ORDER BY ts.Stop_Number, ts.Departure_Time
    `, [req.params.trainId]);
    
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create schedule
router.post('/', async (req, res) => {
  try {
    // Accept both camelCase (from frontend) and snake_case (from API)
    const trainId = req.body.trainId || req.body.Train_ID;
    const stationId = req.body.stationId || req.body.Station_ID;
    const arrivalTime = req.body.arrivalTime || req.body.Arrival_Time || null;
    const departureTime = req.body.departureTime || req.body.Departure_Time || null;
    const platformNumber = req.body.platformNumber || req.body.Platform_Number || 1;
    const stopNumber = req.body.stopNumber || req.body.Stop_Number || 1;
    const distanceFromSource = req.body.distanceFromSource || req.body.Distance_From_Source || 0;
    
    const [result] = await db.query(
      'INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [trainId, stationId, arrivalTime, departureTime, platformNumber, stopNumber, distanceFromSource]
    );
    
    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      schedule_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE schedule by ID
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM Train_Schedule WHERE Schedule_ID = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
