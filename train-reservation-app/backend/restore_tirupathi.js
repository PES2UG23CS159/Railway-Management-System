const db = require('./config/db');

async function restoreTirupathiData() {
  try {
    console.log('🔧 Restoring Tirupathi-Bangalore route...\n');

    // Check if stations exist
    const [stations] = await db.query("SELECT * FROM Station WHERE Station_Name IN ('Tirupathi', 'Bangalore City')");
    
    let tirupathiId, bangaloreId;
    
    // Add Tirupathi if not exists
    const tirupathi = stations.find(s => s.Station_Name === 'Tirupathi');
    if (!tirupathi) {
      const [result] = await db.query(
        "INSERT INTO Station (Station_Code, Station_Name, City, State, Platform_Count) VALUES ('TPT', 'Tirupathi', 'Tirupathi', 'Andhra Pradesh', 5)"
      );
      tirupathiId = result.insertId;
      console.log('✅ Added Tirupathi station (ID:', tirupathiId, ')');
    } else {
      tirupathiId = tirupathi.Station_ID;
      console.log('✅ Tirupathi station exists (ID:', tirupathiId, ')');
    }

    // Bangalore City already exists (ID 4)
    bangaloreId = 4;
    console.log('✅ Bangalore City station exists (ID:', bangaloreId, ')');

    // Check if trains exist
    const [existingTrains] = await db.query("SELECT * FROM Train WHERE Train_Number IN ('12786', '12785')");
    
    let train1Id, train2Id;

    // Train 1: Tirupathi to Bangalore (12786)
    const train1 = existingTrains.find(t => t.Train_Number === '12786');
    if (!train1) {
      const [result] = await db.query(
        `INSERT INTO Train (Train_Number, Train_Name, Source_Station_ID, Destination_Station_ID, 
         Total_AC_Coaches, Total_Sleeper_Coaches, Total_General_Coaches,
         AC_Seat_Capacity, Sleeper_Seat_Capacity, General_Seat_Capacity)
         VALUES ('12786', 'Tirupathi Bangalore SF Express', ?, ?, 5, 10, 5, 360, 720, 400)`,
        [tirupathiId, bangaloreId]
      );
      train1Id = result.insertId;
      console.log('✅ Added Train 12786 Tirupathi→Bangalore (ID:', train1Id, ')');
    } else {
      train1Id = train1.Train_ID;
      console.log('✅ Train 12786 exists (ID:', train1Id, ')');
    }

    // Train 2: Bangalore to Tirupathi (12785)
    const train2 = existingTrains.find(t => t.Train_Number === '12785');
    if (!train2) {
      const [result] = await db.query(
        `INSERT INTO Train (Train_Number, Train_Name, Source_Station_ID, Destination_Station_ID,
         Total_AC_Coaches, Total_Sleeper_Coaches, Total_General_Coaches,
         AC_Seat_Capacity, Sleeper_Seat_Capacity, General_Seat_Capacity)
         VALUES ('12785', 'Bangalore Tirupathi SF Express', ?, ?, 5, 10, 5, 360, 720, 400)`,
        [bangaloreId, tirupathiId]
      );
      train2Id = result.insertId;
      console.log('✅ Added Train 12785 Bangalore→Tirupathi (ID:', train2Id, ')');
    } else {
      train2Id = train2.Train_ID;
      console.log('✅ Train 12785 exists (ID:', train2Id, ')');
    }

    // Add schedules for Train 1 (TPT→BLR)
    const [sched1] = await db.query('SELECT * FROM Train_Schedule WHERE Train_ID = ?', [train1Id]);
    if (sched1.length === 0) {
      await db.query(
        `INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Stop_Number, Distance_From_Source)
         VALUES 
         (?, ?, NULL, '06:00:00', 1, 0),
         (?, ?, '09:30:00', NULL, 2, 250)`,
        [train1Id, tirupathiId, train1Id, bangaloreId]
      );
      console.log('✅ Added schedule for Train 12786');
    } else {
      console.log('✅ Schedule exists for Train 12786');
    }

    // Add schedules for Train 2 (BLR→TPT)
    const [sched2] = await db.query('SELECT * FROM Train_Schedule WHERE Train_ID = ?', [train2Id]);
    if (sched2.length === 0) {
      await db.query(
        `INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Stop_Number, Distance_From_Source)
         VALUES 
         (?, ?, NULL, '14:00:00', 1, 0),
         (?, ?, '17:30:00', NULL, 2, 250)`,
        [train2Id, bangaloreId, train2Id, tirupathiId]
      );
      console.log('✅ Added schedule for Train 12785');
    } else {
      console.log('✅ Schedule exists for Train 12785');
    }

    // Add route entries
    const [route1] = await db.query('SELECT * FROM Route WHERE Train_ID = ? AND Start_Station_ID = ?', [train1Id, tirupathiId]);
    if (route1.length === 0) {
      await db.query(
        'INSERT INTO Route (Train_ID, Start_Station_ID, End_Station_ID, Distance, Duration) VALUES (?, ?, ?, 250, "03:30:00")',
        [train1Id, tirupathiId, bangaloreId]
      );
      console.log('✅ Added route for Train 12786');
    }

    const [route2] = await db.query('SELECT * FROM Route WHERE Train_ID = ? AND Start_Station_ID = ?', [train2Id, bangaloreId]);
    if (route2.length === 0) {
      await db.query(
        'INSERT INTO Route (Train_ID, Start_Station_ID, End_Station_ID, Distance, Duration) VALUES (?, ?, ?, 250, "03:30:00")',
        [train2Id, bangaloreId, tirupathiId]
      );
      console.log('✅ Added route for Train 12785');
    }

    console.log('\n✅ Tirupathi-Bangalore route restored successfully!');
    console.log('\nSummary:');
    console.log(`- Tirupathi Station ID: ${tirupathiId}`);
    console.log(`- Bangalore Station ID: ${bangaloreId}`);
    console.log(`- Train 12786 (TPT→BLR) ID: ${train1Id}`);
    console.log(`- Train 12785 (BLR→TPT) ID: ${train2Id}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restoreTirupathiData();
