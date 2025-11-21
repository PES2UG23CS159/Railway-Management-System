const db = require('../config/db');

// Get all trains
exports.getAllTrains = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        T.*,
        R.Route_Name,
        S1.Station_Name as Start_Station,
        S2.Station_Name as End_Station,
        R.Distance_KM
      FROM Train T
      LEFT JOIN Route R ON T.Route_ID = R.Route_ID
      LEFT JOIN Station S1 ON R.Start_Station_ID = S1.Station_ID
      LEFT JOIN Station S2 ON R.End_Station_ID = S2.Station_ID
    `);
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Get all trains error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trains',
      error: error.message
    });
  }
};

// Get train by ID
exports.getTrainById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Train WHERE Train_ID = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching train',
      error: error.message
    });
  }
};

// Create new train
exports.createTrain = async (req, res) => {
  try {
    // Accept both camelCase (from frontend) and snake_case (from API)
    const trainName = req.body.trainName || req.body.Train_Name;
    const trainNumber = req.body.trainNumber || req.body.Train_Number || `TRN${Date.now().toString().slice(-6)}`;
    const trainType = req.body.trainType || req.body.Train_Type || 'Express';
    const totalCoaches = req.body.totalCoaches || req.body.Total_Coaches || 0;
    const totalSeats = req.body.totalSeats || 500;
    const sleeperCapacity = req.body.sleeperCapacity || req.body.Sleeper_Capacity || Math.floor(totalSeats * 0.4);
    const acCapacity = req.body.acCapacity || req.body.AC_Capacity || Math.floor(totalSeats * 0.3);
    const generalCapacity = req.body.generalCapacity || req.body.General_Capacity || Math.floor(totalSeats * 0.3);
    const routeId = req.body.routeId || req.body.Route_ID || null;
    
    const [result] = await db.query(
      'INSERT INTO Train (Train_Number, Train_Name, Train_Type, Total_Coaches, Sleeper_Capacity, AC_Capacity, General_Capacity, Route_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [trainNumber, trainName, trainType, totalCoaches, sleeperCapacity, acCapacity, generalCapacity, routeId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Train created successfully',
      data: {
        Train_ID: result.insertId,
        Train_Name: trainName,
        Train_Number: trainNumber
      }
    });
  } catch (error) {
    console.error('Create train error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating train',
      error: error.message
    });
  }
};

// Search trains
exports.searchTrains = async (req, res) => {
  try {
    const { source, destination } = req.query;
    
    console.log('Search params:', { source, destination });
    
    // If source and destination are provided
    if (source && destination) {
      // Find trains that have both stations in their schedule
      const [rows] = await db.query(`
        SELECT DISTINCT 
          T.*,
          S1.Station_Name as Source_Name,
          S2.Station_Name as Destination_Name,
          TS1.Departure_Time,
          TS2.Arrival_Time,
          (TS2.Distance_From_Source - TS1.Distance_From_Source) as Distance_KM
        FROM Train T
        INNER JOIN Train_Schedule TS1 ON T.Train_ID = TS1.Train_ID
        INNER JOIN Train_Schedule TS2 ON T.Train_ID = TS2.Train_ID
        INNER JOIN Station S1 ON TS1.Station_ID = S1.Station_ID
        INNER JOIN Station S2 ON TS2.Station_ID = S2.Station_ID
        WHERE TS1.Station_ID = ?
          AND TS2.Station_ID = ?
          AND TS1.Stop_Number < TS2.Stop_Number
      `, [source, destination]);
      
      console.log('Search results:', rows.length);
      
      return res.json({
        success: true,
        count: rows.length,
        data: rows
      });
    }
    
    // If no search params, return all trains
    const [rows] = await db.query(`
      SELECT T.* FROM Train T
    `);
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Search trains error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching trains',
      error: error.message
    });
  }
};

// Get train schedule
exports.getTrainSchedule = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT TS.*, S.Station_Name, S.Station_Code
      FROM Train_Schedule TS
      JOIN Station S ON TS.Station_ID = S.Station_ID
      WHERE TS.Train_ID = ?
      ORDER BY TS.Stop_Number
    `, [req.params.id]);
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Get train schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching train schedule',
      error: error.message
    });
  }
};
