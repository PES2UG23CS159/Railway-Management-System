const db = require('./config/db');

async function restore() {
  try {
    console.log('🔧 Final restore of Tirupathi-Bangalore trains...\n');

    const tirupathiId = 11;  // Already added
    const bangaloreId = 4;    // Already exists

    // Trains already added (IDs 6 and 7)
    const train1Id = 6;  // 12786 TPT→BLR
    const train2Id = 7;  // 12785 BLR→TPT
    
    console.log('✅ Train 12786 exists (ID:', train1Id, ')');
    console.log('✅ Train 12785 exists (ID:', train2Id, ')');

    // Add Route 1: TPT → BLR
    const [route1Check] = await db.query(
      'SELECT * FROM Route WHERE Start_Station_ID = ? AND End_Station_ID = ?',
      [tirupathiId, bangaloreId]
    );
    let route1Id;
    if (route1Check.length === 0) {
      const [result] = await db.query(
        `INSERT INTO Route (Route_Name, Route_Type, Distance_KM, Start_Station_ID, End_Station_ID)
         VALUES ('Tirupathi-Bangalore Route', 'Express', 250, ?, ?)`,
        [tirupathiId, bangaloreId]
      );
      route1Id = result.insertId;
      console.log('✅ Added Route TPT→BLR (ID:', route1Id, ')');
      
      // Link train to route
      await db.query('UPDATE Train SET Route_ID = ? WHERE Train_ID = ?', [route1Id, train1Id]);
      console.log('✅ Linked Train 12786 to route');
    } else {
      route1Id = route1Check[0].Route_ID;
      console.log('✅ Route TPT→BLR exists (ID:', route1Id, ')');
    }

    // Add Route 2: BLR → TPT
    const [route2Check] = await db.query(
      'SELECT * FROM Route WHERE Start_Station_ID = ? AND End_Station_ID = ?',
      [bangaloreId, tirupathiId]
    );
    let route2Id;
    if (route2Check.length === 0) {
      const [result] = await db.query(
        `INSERT INTO Route (Route_Name, Route_Type, Distance_KM, Start_Station_ID, End_Station_ID)
         VALUES ('Bangalore-Tirupathi Route', 'Express', 250, ?, ?)`,
        [bangaloreId, tirupathiId]
      );
      route2Id = result.insertId;
      console.log('✅ Added Route BLR→TPT (ID:', route2Id, ')');
      
      // Link train to route
      await db.query('UPDATE Train SET Route_ID = ? WHERE Train_ID = ?', [route2Id, train2Id]);
      console.log('✅ Linked Train 12785 to route');
    } else {
      route2Id = route2Check[0].Route_ID;
      console.log('✅ Route BLR→TPT exists (ID:', route2Id, ')');
    }

    // Add Schedules for Train 1 (TPT→BLR)
    const [sched1] = await db.query('SELECT * FROM Train_Schedule WHERE Train_ID = ?', [train1Id]);
    if (sched1.length === 0) {
      await db.query(
        `INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Stop_Number, Distance_From_Source, Platform_Number)
         VALUES 
         (?, ?, NULL, '06:00:00', 1, 0, 1),
         (?, ?, '09:30:00', NULL, 2, 250, 3)`,
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
        `INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Stop_Number, Distance_From_Source, Platform_Number)
         VALUES 
         (?, ?, NULL, '14:00:00', 1, 0, 2),
         (?, ?, '17:30:00', NULL, 2, 250, 4)`,
        [train2Id, bangaloreId, train2Id, tirupathiId]
      );
      console.log('✅ Added schedules for Train 12785');
    } else {
      console.log('✅ Schedules exist for Train 12785');
    }

    console.log('\n✅ RESTORATION COMPLETE!');
    console.log('\nAvailable trains:');
    console.log('🚂 Train 12786: Tirupathi → Bangalore City (Departs 06:00, Arrives 09:30)');
    console.log('🚂 Train 12785: Bangalore City → Tirupathi (Departs 14:00, Arrives 17:30)');
    console.log('\n✅ You can now search and book these trains!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restore();
