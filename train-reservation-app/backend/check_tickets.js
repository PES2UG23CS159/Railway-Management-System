const db = require('./config/db');

async function checkTickets() {
  try {
    const [countResult] = await db.query('SELECT COUNT(*) as count FROM Ticket');
    console.log('✅ Total tickets in database:', countResult[0].count);
    
    const [tickets] = await db.query(`
      SELECT 
        t.Ticket_ID,
        t.PNR_Number,
        t.Booking_Date_Time,
        t.Journey_Date,
        t.Status,
        t.Fare,
        CONCAT(p.First_Name, ' ', p.Last_Name) as Passenger_Name,
        ss.Station_Name as Source,
        ds.Station_Name as Destination
      FROM Ticket t
      JOIN Passenger p ON t.Passenger_ID = p.Passenger_ID
      LEFT JOIN Station ss ON t.Source_Station_ID = ss.Station_ID
      LEFT JOIN Station ds ON t.Destination_Station_ID = ds.Station_ID
      ORDER BY t.Booking_Date_Time DESC
      LIMIT 5
    `);
    
    console.log('\n📋 Latest 5 tickets:');
    tickets.forEach((ticket, i) => {
      console.log(`\n${i + 1}. PNR: ${ticket.PNR_Number}`);
      console.log(`   Passenger: ${ticket.Passenger_Name}`);
      console.log(`   Route: ${ticket.Source} → ${ticket.Destination}`);
      console.log(`   Journey Date: ${ticket.Journey_Date}`);
      console.log(`   Booked: ${ticket.Booking_Date_Time}`);
      console.log(`   Status: ${ticket.Status} | Fare: ₹${ticket.Fare}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTickets();
