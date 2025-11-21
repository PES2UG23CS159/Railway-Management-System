const db = require('./config/db');

async function checkSearch() {
  try {
    console.log('=== CHECKING TRAIN SEARCH SETUP ===\n');
    
    // Check Train 6
    const [train] = await db.query('SELECT * FROM Train WHERE Train_Number = ?', ['12786']);
    console.log('Train 12786:', JSON.stringify(train, null, 2));
    
    // Check schedules for train 6
    const [schedules] = await db.query(`
      SELECT ts.*, s.Station_Name, s.Station_Code 
      FROM Train_Schedule ts 
      JOIN Station s ON ts.Station_ID = s.Station_ID 
      WHERE ts.Train_ID = 6 
      ORDER BY ts.Stop_Number
    `);
    console.log('\nSchedules for Train 6:', JSON.stringify(schedules, null, 2));
    
    // Test the search query
    console.log('\n=== TESTING SEARCH QUERY ===');
    const [searchResults] = await db.query(`
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
      WHERE S1.Station_ID = 4
        AND S2.Station_ID = 11
        AND TS1.Stop_Number < TS2.Stop_Number
      ORDER BY TS1.Departure_Time
    `);
    
    console.log('\nSearch Results (From Bangalore:4 to Tirupathi:11):', JSON.stringify(searchResults, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('SQL:', error.sql);
    process.exit(1);
  }
}

checkSearch();
