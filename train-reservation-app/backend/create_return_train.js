const db = require('./config/db');

async function createReturnTrain() {
  try {
    console.log('Creating return train: Bangalore → Tirupathi\n');
    
    // Create return train
    const [trainResult] = await db.query(`
      INSERT INTO Train 
      (Train_Number, Train_Name, Train_Type, Total_Coaches, Sleeper_Capacity, AC_Capacity, General_Capacity, Route_ID) 
      VALUES ('12785', 'Bangalore Tirupathi SF Express', 'Superfast', 18, 400, 200, 100, 7)
    `);
    
    const newTrainId = trainResult.insertId;
    console.log(`✅ Train created with ID: ${newTrainId}`);
    
    // Add schedules (reverse direction)
    await db.query(`
      INSERT INTO Train_Schedule 
      (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) 
      VALUES 
      (${newTrainId}, 4, NULL, '14:00:00', 1, 1, 0),
      (${newTrainId}, 11, '18:30:00', NULL, 2, 2, 232)
    `);
    console.log('✅ Schedules created\n');
    
    // Verify
    const [schedules] = await db.query(`
      SELECT ts.*, s.Station_Name 
      FROM Train_Schedule ts 
      JOIN Station s ON ts.Station_ID = s.Station_ID 
      WHERE ts.Train_ID = ?
      ORDER BY ts.Stop_Number
    `, [newTrainId]);
    
    console.log('Train Schedule:');
    schedules.forEach(s => {
      console.log(`  Stop ${s.Stop_Number}: ${s.Station_Name} - Dep: ${s.Departure_Time || 'N/A'}, Arr: ${s.Arrival_Time || 'N/A'}`);
    });
    
    console.log('\n✅ Return train created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createReturnTrain();
