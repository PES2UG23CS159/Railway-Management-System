-- Setup Tirupathi to Bangalore Train Route
-- This script creates a complete route with train and schedules

-- Step 1: Update the route to have proper station IDs
UPDATE Route 
SET Start_Station_ID = 11,  -- TPT (Tirupathi)
    End_Station_ID = 4,      -- SBC (Bangalore)
    Route_Name = 'Tirupathi - Bangalore Route',
    Route_Type = 'Superfast',
    Distance_KM = 232
WHERE Route_ID = 7;

-- Step 2: Create a new train for this route (or update existing train 6)
UPDATE Train
SET Train_Number = '12786',
    Train_Name = 'Tirupathi Bangalore SF Express',
    Train_Type = 'Superfast',
    Route_ID = 7,
    Total_Coaches = 18,
    Sleeper_Capacity = 400,
    AC_Capacity = 200,
    General_Capacity = 100
WHERE Train_ID = 6;

-- Step 3: Add train schedules (stops at both stations)
-- Delete any existing schedules for this train first
DELETE FROM Train_Schedule WHERE Train_ID = 6;

-- Add Tirupathi as starting station
INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
VALUES (6, 11, NULL, '08:00:00', 1, 1, 0);  -- Starts at Tirupathi at 8:00 AM

-- Add Bangalore as destination station
INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
VALUES (6, 4, '12:30:00', NULL, 2, 2, 232);  -- Arrives at Bangalore at 12:30 PM

-- Verify the setup
SELECT 
    t.Train_ID,
    t.Train_Number,
    t.Train_Name,
    r.Route_Name,
    s1.Station_Name as Start_Station,
    s2.Station_Name as End_Station,
    r.Distance_KM
FROM Train t
JOIN Route r ON t.Route_ID = r.Route_ID
JOIN Station s1 ON r.Start_Station_ID = s1.Station_ID
JOIN Station s2 ON r.End_Station_ID = s2.Station_ID
WHERE t.Train_ID = 6;

-- Verify schedules
SELECT 
    ts.Stop_Number,
    s.Station_Name,
    ts.Arrival_Time,
    ts.Departure_Time,
    ts.Distance_From_Source,
    ts.Platform_Number
FROM Train_Schedule ts
JOIN Station s ON ts.Station_ID = s.Station_ID
WHERE ts.Train_ID = 6
ORDER BY ts.Stop_Number;
