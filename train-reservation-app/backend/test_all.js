const db = require('./config/db');

async function testAll() {
  try {
    console.log('🧪 TESTING ALL FEATURES\n');
    console.log('='.repeat(60));

    // 1. Check Stations
    const [stations] = await db.query('SELECT Station_ID, Station_Code, Station_Name, City FROM Station ORDER BY Station_ID');
    console.log('\n✅ STATIONS (' + stations.length + ' total):');
    stations.forEach(s => console.log(`   ${s.Station_ID}. ${s.Station_Code} - ${s.Station_Name}, ${s.City}`));

    // 2. Check Trains
    const [trains] = await db.query('SELECT Train_ID, Train_Number, Train_Name, Route_ID FROM Train ORDER BY Train_ID');
    console.log('\n✅ TRAINS (' + trains.length + ' total):');
    trains.forEach(t => console.log(`   ${t.Train_ID}. ${t.Train_Number} - ${t.Train_Name} (Route: ${t.Route_ID || 'N/A'})`));

    // 3. Check Routes
    const [routes] = await db.query(`
      SELECT r.Route_ID, r.Route_Name, 
             s1.Station_Name as Start, s2.Station_Name as End, r.Distance_KM
      FROM Route r
      JOIN Station s1 ON r.Start_Station_ID = s1.Station_ID
      JOIN Station s2 ON r.End_Station_ID = s2.Station_ID
      ORDER BY r.Route_ID
    `);
    console.log('\n✅ ROUTES (' + routes.length + ' total):');
    routes.forEach(r => console.log(`   ${r.Route_ID}. ${r.Route_Name}: ${r.Start} → ${r.End} (${r.Distance_KM}km)`));

    // 4. Check Train Schedules
    const [schedules] = await db.query(`
      SELECT ts.Train_ID, t.Train_Number, t.Train_Name,
             s.Station_Name, ts.Departure_Time, ts.Arrival_Time, ts.Stop_Number
      FROM Train_Schedule ts
      JOIN Train t ON ts.Train_ID = t.Train_ID
      JOIN Station s ON ts.Station_ID = s.Station_ID
      ORDER BY ts.Train_ID, ts.Stop_Number
    `);
    console.log('\n✅ TRAIN SCHEDULES:');
    let currentTrain = null;
    schedules.forEach(sch => {
      if (currentTrain !== sch.Train_ID) {
        console.log(`\n   Train ${sch.Train_Number} (${sch.Train_Name}):`);
        currentTrain = sch.Train_ID;
      }
      const dep = sch.Departure_Time || '---';
      const arr = sch.Arrival_Time || '---';
      console.log(`      Stop ${sch.Stop_Number}: ${sch.Station_Name} (Arr: ${arr}, Dep: ${dep})`);
    });

    // 5. Check Passengers
    const [passengers] = await db.query('SELECT Passenger_ID, First_Name, Last_Name, Email FROM Passenger LIMIT 5');
    console.log('\n✅ PASSENGERS (' + passengers.length + ' shown):');
    passengers.forEach(p => console.log(`   ${p.Passenger_ID}. ${p.First_Name} ${p.Last_Name} (${p.Email})`));

    // 6. Check Railway Cards
    const [cards] = await db.query('SELECT COUNT(*) as count FROM Railway_Card');
    console.log(`\n✅ RAILWAY CARDS: ${cards[0].count} issued`);

    // 7. Check Tickets
    const [tickets] = await db.query(`
      SELECT t.Ticket_ID, t.PNR, t.Journey_Date, 
             s1.Station_Name as Source, s2.Station_Name as Dest,
             tr.Train_Number, p.First_Name, p.Last_Name
      FROM Ticket t
      JOIN Station s1 ON t.Source_Station_ID = s1.Station_ID
      JOIN Station s2 ON t.Destination_Station_ID = s2.Station_ID
      JOIN Train tr ON t.Train_ID = tr.Train_ID
      JOIN Passenger p ON t.Passenger_ID = p.Passenger_ID
      ORDER BY t.Ticket_ID DESC
      LIMIT 5
    `);
    console.log(`\n✅ RECENT TICKETS:`);
    tickets.forEach(t => {
      console.log(`   PNR ${t.PNR}: ${t.First_Name} ${t.Last_Name}`);
      console.log(`      ${t.Source} → ${t.Dest} on Train ${t.Train_Number} (${t.Journey_Date})`);
    });

    // 8. Test Search Query for Tirupathi → Bangalore
    console.log('\n' + '='.repeat(60));
    console.log('🔍 TESTING SEARCH: Tirupathi → Bangalore City\n');
    
    const [searchResults] = await db.query(`
      SELECT DISTINCT
        t.Train_ID,
        t.Train_Number,
        t.Train_Name,
        t.Train_Type,
        ts_source.Station_ID as source_station_id,
        source.Station_Name as source_station,
        ts_source.Departure_Time as departure_time,
        ts_dest.Station_ID as dest_station_id,
        dest.Station_Name as destination_station,
        ts_dest.Arrival_Time as arrival_time,
        t.Sleeper_Capacity,
        t.AC_Capacity,
        t.General_Capacity
      FROM Train t
      JOIN Train_Schedule ts_source ON t.Train_ID = ts_source.Train_ID
      JOIN Station source ON ts_source.Station_ID = source.Station_ID
      JOIN Train_Schedule ts_dest ON t.Train_ID = ts_dest.Train_ID
      JOIN Station dest ON ts_dest.Station_ID = dest.Station_ID
      WHERE source.Station_Name = 'Tirupathi'
        AND dest.Station_Name = 'Bangalore City'
        AND ts_source.Stop_Number < ts_dest.Stop_Number
    `);

    if (searchResults.length > 0) {
      console.log('✅ FOUND TRAINS:');
      searchResults.forEach(train => {
        console.log(`   🚂 ${train.Train_Number} - ${train.Train_Name}`);
        console.log(`      ${train.source_station} (${train.departure_time}) → ${train.destination_station} (${train.arrival_time})`);
        console.log(`      Seats: AC=${train.AC_Capacity}, Sleeper=${train.Sleeper_Capacity}, General=${train.General_Capacity}`);
      });
    } else {
      console.log('❌ No trains found for this route!');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS COMPLETE!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAll();
