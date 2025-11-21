const db = require('../config/db');

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT T.*, 
             CONCAT(P.First_Name, ' ', P.Last_Name) as Passenger_Name, 
             TR.Train_Name, 
             TR.Train_Number,
             SS.Station_Name as Source_Station_Name,
             DS.Station_Name as Destination_Station_Name
      FROM Ticket T
      JOIN Passenger P ON T.Passenger_ID = P.Passenger_ID
      LEFT JOIN Train TR ON T.Train_ID = TR.Train_ID
      LEFT JOIN Station SS ON T.Source_Station_ID = SS.Station_ID
      LEFT JOIN Station DS ON T.Destination_Station_ID = DS.Station_ID
      ORDER BY T.Journey_Date DESC
    `);
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets',
      error: error.message
    });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT T.*, 
              CONCAT(P.First_Name, ' ', P.Last_Name) as Passenger_Name, 
              TR.Train_Name,
              SS.Station_Name as Source_Station_Name,
              DS.Station_Name as Destination_Station_Name
       FROM Ticket T
       JOIN Passenger P ON T.Passenger_ID = P.Passenger_ID
       LEFT JOIN Train TR ON T.Train_ID = TR.Train_ID
       LEFT JOIN Station SS ON T.Source_Station_ID = SS.Station_ID
       LEFT JOIN Station DS ON T.Destination_Station_ID = DS.Station_ID
       WHERE T.Ticket_ID = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket',
      error: error.message
    });
  }
};

// Book new ticket
exports.bookTicket = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    console.log('Booking request body:', req.body);
    
    const {
      passenger_id,
      train_id,
      journey_date,
      source_station,
      destination_station,
      class: ticketClass,
      seat_number,
      coach_number
    } = req.body;
    
    // Validate required fields
    if (!passenger_id || !journey_date || !source_station || !destination_station) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['passenger_id', 'journey_date', 'source_station', 'destination_station']
      });
    }
    
    // Convert station names/codes to IDs if they're not already numbers
    let sourceStationId = source_station;
    let destinationStationId = destination_station;
    
    if (isNaN(source_station)) {
      // It's a name or code, find the ID
      const [sourceResults] = await connection.query(
        'SELECT Station_ID FROM Station WHERE Station_Name LIKE ? OR Station_Code = ? OR City LIKE ?',
        [`%${source_station}%`, source_station.toUpperCase(), `%${source_station}%`]
      );
      if (sourceResults.length > 0) {
        sourceStationId = sourceResults[0].Station_ID;
      }
    }
    
    if (isNaN(destination_station)) {
      // It's a name or code, find the ID
      const [destResults] = await connection.query(
        'SELECT Station_ID FROM Station WHERE Station_Name LIKE ? OR Station_Code = ? OR City LIKE ?',
        [`%${destination_station}%`, destination_station.toUpperCase(), `%${destination_station}%`]
      );
      if (destResults.length > 0) {
        destinationStationId = destResults[0].Station_ID;
      }
    }
    
    // Generate PNR number (10 characters: PNR + 7 digits)
    const pnr = 'PNR' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    
    // Calculate fare (simple calculation)
    const baseFare = 500;
    const classFares = {
      'Sleeper': 1,
      'AC 3-Tier': 2,
      'AC 2-Tier': 3,
      'AC 1-Tier': 4,
      'General': 0.5
    };
    const fare = baseFare * (classFares[ticketClass] || 1);
    
    console.log('Inserting ticket with PNR:', pnr);
    
    // Insert ticket
    const [ticketResult] = await connection.query(
      `INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, 
       Source_Station_ID, Destination_Station_ID, Class, Seat_Number, Coach_Number, 
       Status, Passenger_ID, Train_ID) 
       VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?, ?)`,
      [pnr, journey_date, fare, sourceStationId, destinationStationId, 
       ticketClass, seat_number, coach_number, passenger_id, train_id]
    );
    
    const ticketId = ticketResult.insertId;
    console.log('Ticket created with ID:', ticketId);
    
    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: 'Ticket booked successfully',
      ticket_id: ticketId,
      pnr: pnr,
      fare: fare
    });
  } catch (error) {
    await connection.rollback();
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking ticket',
      error: error.message,
      details: error.sqlMessage || 'Database error'
    });
  } finally {
    connection.release();
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    const { Status, Seat_Number, Coach_Number } = req.body;
    
    const [result] = await db.query(
      'UPDATE Ticket SET Status = ?, Seat_Number = ?, Coach_Number = ? WHERE Ticket_ID = ?',
      [Status, Seat_Number, Coach_Number, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Ticket updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating ticket',
      error: error.message
    });
  }
};

// Cancel ticket
exports.cancelTicket = async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE Ticket SET Status = ? WHERE Ticket_ID = ?',
      ['Cancelled', req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Ticket cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling ticket',
      error: error.message
    });
  }
};
