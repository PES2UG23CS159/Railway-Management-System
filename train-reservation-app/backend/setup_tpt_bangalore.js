const db = require('./config/db');

async function setupRoute() {
  try {
    // Update Route 7
    await db.query(`
      UPDATE Route 
      SET Start_Station_ID = 11, 
          End_Station_ID = 4, 
          Route_Name = 'Tirupathi - Bangalore Route', 
          Route_Type = 'Superfast', 
          Distance_KM = 232 
      WHERE Route_ID = 7
    `);
    console.log('✅ Route updated');

    // Update Train 6
    await db.query(`
      UPDATE Train 
      SET Train_Number = '12786', 
          Train_Name = 'Tirupathi Bangalore SF Express', 
          Train_Type = 'Superfast', 
          Route_ID = 7, 
          Total_Coaches = 18, 
          Sleeper_Capacity = 400, 
          AC_Capacity = 200, 
          General_Capacity = 100 
      WHERE Train_ID = 6
    `);
    console.log('✅ Train updated');

    // Delete old schedules
    await db.query('DELETE FROM Train_Schedule WHERE Train_ID = 6');

    // Insert new schedules
    await db.query(`
      INSERT INTO Train_Schedule 
      (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) 
      VALUES 
      (6, 11, NULL, '08:00:00', 1, 1, 0),
      (6, 4, '12:30:00', NULL, 2, 2, 232)
    `);
    console.log('✅ Schedules created');

    // Verify
    const [result] = await db.query(`
      SELECT 
        t.Train_Number, 
        t.Train_Name, 
        s1.Station_Name as Source, 
        s2.Station_Name as Destination,
        r.Distance_KM
      FROM Train t
      JOIN Route r ON t.Route_ID = r.Route_ID
      JOIN Station s1 ON r.Start_Station_ID = s1.Station_ID
      JOIN Station s2 ON r.End_Station_ID = s2.Station_ID
      WHERE t.Train_ID = 6
    `);
    
    console.log('\n📍 Train Setup Complete:');
    console.log(JSON.stringify(result[0], null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupRoute();
