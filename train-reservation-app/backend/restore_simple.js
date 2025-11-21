const db = require('./config/db');

async function restore() {
  try {
    console.log('🔧 Restoring Tirupathi-Bangalore data...\n');

    // Station 11 = Tirupathi (already added)
    // Station 4 = Bangalore City (already exists)
    
    const tirupathiId = 11;
    const bangaloreId = 4;

    // Add Train 1: TPT → BLR (12786)
    const [train1Check] = await db.query("SELECT * FROM Train WHERE Train_Number = '12786'");
    let train1Id;
    if (train1Check.length === 0) {
      const [result] = await db.query(
        `INSERT INTO Train (Train_Number, Train_Name, Train_Type, Total_Coaches, Sleeper_Capacity, AC_Capacity, General_Capacity)
         VALUES ('12786', 'Tirupathi Bangalore SF Express', 'Express', 20, 720, 360, 400)`
      );
      train1Id = result.insertId;
      console.log('✅ Added Train 12786 TPT→BLR (ID:', train1Id, ')');
    } else {
      train1Id = train1Check[0].Train_ID;
      console.log('✅ Train 12786 exists (ID:', train1Id, ')');
    }

    // Add Train 2: BLR → TPT (12785)
    const [train2Check] = await db.query("SELECT * FROM Train WHERE Train_Number = '12785'");
    let train2Id;
    if (train2Check.length === 0) {
      const [result] = await db.query(
        `INSERT INTO Train (Train_Number, Train_Name, Train_Type, Total_Coaches, Sleeper_Capacity, AC_Capacity, General_Capacity)
         VALUES ('12785', 'Bangalore Tirupathi SF Express', 'Express', 20, 720, 360, 400)`
      );
      train2Id = result.insertId;
      console.log('✅ Added Train 12785 BLR→TPT (ID:', train2Id, ')');
    } else {
      train2Id = train2Check[0].Train_ID;
      console.log('✅ Train 12785 exists (ID:', train2Id, ')');
    }

    // Add Route 1: TPT → BLR
    const [route1Check] = await db.query('SELECT * FROM Route WHERE Train_ID = ?', [train1Id]);
    let route1Id;
    if (route1Check.length === 0) {
      const [result] = await db.query(
        'INSERT INTO Route (Train_ID, Start_Station_ID, End_Station_ID, Distance, Duration) VALUES (?, ?, ?, 250, "03:30:00")',
        [train1Id, tirupathiId, bangaloreId]
      );
      route1Id = result.insertId;
      console.log('✅ Added Route for Train 12786');
      
      // Update train with route_id
      await db.query('UPDATE Train SET Route_ID = ? WHERE Train_ID = ?', [route1Id, train1Id]);
    } else {
      route1Id = route1Check[0].Route_ID;
      console.log('✅ Route exists for Train 12786');
    }

    // Add Route 2: BLR → TPT
    const [route2Check] = await db.query('SELECT * FROM Route WHERE Train_ID = ?', [train2Id]);
    let route2Id;
    if (route2Check.length === 0) {
      const [result] = await db.query(
        'INSERT INTO Route (Train_ID, Start_Station_ID, End_Station_ID, Distance, Duration) VALUES (?, ?, ?, 250, "03:30:00")',
        [train2Id, bangaloreId, tirupathiId]
      );
      route2Id = result.insertId;
      console.log('✅ Added Route for Train 12785');
      
      // Update train with route_id
      await db.query('UPDATE Train SET Route_ID = ? WHERE Train_ID = ?', [route2Id, train2Id]);
    } else {
      route2Id = route2Check[0].Route_ID;
      console.log('✅ Route exists for Train 12785');
    }

    // Add Schedules for Train 1 (TPT→BLR)
    const [sched1] = await db.query('SELECT * FROM Train_Schedule WHERE Train_ID = ?', [train1Id]);
    if (sched1.length === 0) {
      await db.query(
        `INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Stop_Number, Distance_From_Source)
         VALUES 
         (?, ?, NULL, '06:00:00', 1, 0),
         (?, ?, '09:30:00', NULL, 2, 250)`,
        [train1Id, tirupathiId, train1Id, bangaloreId]
      );
      console.log('✅ Added schedules for Train 12786');
    } else {
      console.log('✅ Schedules exist for Train 12786');
    }

    // Add Schedules for Train 2 (BLR→TPT)
    const [sched2] = await db.query('SELECT * FROM Train_Schedule WHERE Train_ID = ?', [train2Id]);
    if (sched2.length === 0) {
      await db.query(
        `INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Stop_Number, Distance_From_Source)
         VALUES 
         (?, ?, NULL, '14:00:00', 1, 0),
         (?, ?, '17:30:00', NULL, 2, 250)`,
        [train2Id, bangaloreId, train2Id, tirupathiId]
      );
      console.log('✅ Added schedules for Train 12785');
    } else {
      console.log('✅ Schedules exist for Train 12785');
    }

    console.log('\n✅ ALL DONE! Tirupathi-Bangalore trains restored.');
    console.log('\nYou can now search:');
    console.log('- Tirupathi → Bangalore City (Train 12786, departs 06:00)');
    console.log('- Bangalore City → Tirupathi (Train 12785, departs 14:00)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restore();
