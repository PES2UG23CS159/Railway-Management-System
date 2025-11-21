-- Add Tirupathi to Bangalore Train Route
-- Run this SQL script in MySQL Workbench

USE train_reservation;

-- Step 1: Add Stations (if they don't exist)
INSERT IGNORE INTO Station (Station_Name, City, State) VALUES
('Tirupati Railway Station', 'Tirupati', 'Andhra Pradesh'),
('Renigunta Junction', 'Renigunta', 'Andhra Pradesh'),
('Katpadi Junction', 'Katpadi', 'Tamil Nadu'),
('Jolarpettai Junction', 'Jolarpettai', 'Tamil Nadu'),
('Bangalore City Junction', 'Bangalore', 'Karnataka'),
('Bangalore Cantonment', 'Bangalore', 'Karnataka');

-- Step 2: Add a Route (if doesn't exist)
INSERT IGNORE INTO Route (Source_Station_ID, Destination_Station_ID, Distance_KM) 
SELECT 
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Tirupati Railway Station' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Bangalore City Junction' LIMIT 1),
    250;

-- Step 3: Add Trains
INSERT IGNORE INTO Train (Train_Name, Train_Type, Total_Seats) VALUES
('Tirupati Express', 'Express', 500),
('Bangalore Mail', 'Mail', 450),
('Vande Bharat Express', 'Superfast', 600);

-- Step 4: Add Train Schedule (connecting stations)
-- For Train 1: Tirupati Express
INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
SELECT 
    (SELECT Train_ID FROM Train WHERE Train_Name = 'Tirupati Express' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Tirupati Railway Station' LIMIT 1),
    NULL,
    '06:00:00',
    1,
    1,
    0
WHERE NOT EXISTS (
    SELECT 1 FROM Train_Schedule ts 
    WHERE ts.Train_ID = (SELECT Train_ID FROM Train WHERE Train_Name = 'Tirupati Express' LIMIT 1)
    AND ts.Station_ID = (SELECT Station_ID FROM Station WHERE Station_Name = 'Tirupati Railway Station' LIMIT 1)
);

INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
SELECT 
    (SELECT Train_ID FROM Train WHERE Train_Name = 'Tirupati Express' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Renigunta Junction' LIMIT 1),
    '06:20:00',
    '06:25:00',
    2,
    2,
    15
WHERE NOT EXISTS (
    SELECT 1 FROM Train_Schedule ts 
    WHERE ts.Train_ID = (SELECT Train_ID FROM Train WHERE Train_Name = 'Tirupati Express' LIMIT 1)
    AND ts.Station_ID = (SELECT Station_ID FROM Station WHERE Station_Name = 'Renigunta Junction' LIMIT 1)
);

INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
SELECT 
    (SELECT Train_ID FROM Train WHERE Train_Name = 'Tirupati Express' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Katpadi Junction' LIMIT 1),
    '07:30:00',
    '07:35:00',
    1,
    3,
    80
WHERE NOT EXISTS (
    SELECT 1 FROM Train_Schedule ts 
    WHERE ts.Train_ID = (SELECT Train_ID FROM Train WHERE Train_Name = 'Tirupati Express' LIMIT 1)
    AND ts.Station_ID = (SELECT Station_ID FROM Station WHERE Station_Name = 'Katpadi Junction' LIMIT 1)
);

INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
SELECT 
    (SELECT Train_ID FROM Train WHERE Train_Name = 'Tirupati Express' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Jolarpettai Junction' LIMIT 1),
    '08:45:00',
    '08:50:00',
    3,
    4,
    150
WHERE NOT EXISTS (
    SELECT 1 FROM Train_Schedule ts 
    WHERE ts.Train_ID = (SELECT Train_ID FROM Train WHERE Train_Name = 'Tirupati Express' LIMIT 1)
    AND ts.Station_ID = (SELECT Station_ID FROM Station WHERE Station_Name = 'Jolarpettai Junction' LIMIT 1)
);

INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
SELECT 
    (SELECT Train_ID FROM Train WHERE Train_Name = 'Tirupati Express' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Bangalore City Junction' LIMIT 1),
    '10:30:00',
    NULL,
    4,
    5,
    250
WHERE NOT EXISTS (
    SELECT 1 FROM Train_Schedule ts 
    WHERE ts.Train_ID = (SELECT Train_ID FROM Train WHERE Train_Name = 'Tirupati Express' LIMIT 1)
    AND ts.Station_ID = (SELECT Station_ID FROM Station WHERE Station_Name = 'Bangalore City Junction' LIMIT 1)
);

-- For Train 2: Bangalore Mail
INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
SELECT 
    (SELECT Train_ID FROM Train WHERE Train_Name = 'Bangalore Mail' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Tirupati Railway Station' LIMIT 1),
    NULL,
    '14:00:00',
    2,
    1,
    0
WHERE NOT EXISTS (
    SELECT 1 FROM Train_Schedule ts 
    WHERE ts.Train_ID = (SELECT Train_ID FROM Train WHERE Train_Name = 'Bangalore Mail' LIMIT 1)
    AND ts.Station_ID = (SELECT Station_ID FROM Station WHERE Station_Name = 'Tirupati Railway Station' LIMIT 1)
);

INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
SELECT 
    (SELECT Train_ID FROM Train WHERE Train_Name = 'Bangalore Mail' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Katpadi Junction' LIMIT 1),
    '15:15:00',
    '15:20:00',
    2,
    2,
    80
WHERE NOT EXISTS (
    SELECT 1 FROM Train_Schedule ts 
    WHERE ts.Train_ID = (SELECT Train_ID FROM Train WHERE Train_Name = 'Bangalore Mail' LIMIT 1)
    AND ts.Station_ID = (SELECT Station_ID FROM Station WHERE Station_Name = 'Katpadi Junction' LIMIT 1)
);

INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
SELECT 
    (SELECT Train_ID FROM Train WHERE Train_Name = 'Bangalore Mail' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Bangalore City Junction' LIMIT 1),
    '18:00:00',
    NULL,
    3,
    3,
    250
WHERE NOT EXISTS (
    SELECT 1 FROM Train_Schedule ts 
    WHERE ts.Train_ID = (SELECT Train_ID FROM Train WHERE Train_Name = 'Bangalore Mail' LIMIT 1)
    AND ts.Station_ID = (SELECT Station_ID FROM Station WHERE Station_Name = 'Bangalore City Junction' LIMIT 1)
);

-- For Train 3: Vande Bharat Express
INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
SELECT 
    (SELECT Train_ID FROM Train WHERE Train_Name = 'Vande Bharat Express' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Tirupati Railway Station' LIMIT 1),
    NULL,
    '09:00:00',
    3,
    1,
    0
WHERE NOT EXISTS (
    SELECT 1 FROM Train_Schedule ts 
    WHERE ts.Train_ID = (SELECT Train_ID FROM Train WHERE Train_Name = 'Vande Bharat Express' LIMIT 1)
    AND ts.Station_ID = (SELECT Station_ID FROM Station WHERE Station_Name = 'Tirupati Railway Station' LIMIT 1)
);

INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
SELECT 
    (SELECT Train_ID FROM Train WHERE Train_Name = 'Vande Bharat Express' LIMIT 1),
    (SELECT Station_ID FROM Station WHERE Station_Name = 'Bangalore City Junction' LIMIT 1),
    '12:30:00',
    NULL,
    5,
    2,
    250
WHERE NOT EXISTS (
    SELECT 1 FROM Train_Schedule ts 
    WHERE ts.Train_ID = (SELECT Train_ID FROM Train WHERE Train_Name = 'Vande Bharat Express' LIMIT 1)
    AND ts.Station_ID = (SELECT Station_ID FROM Station WHERE Station_Name = 'Bangalore City Junction' LIMIT 1)
);

-- Verify the data
SELECT 'Stations Added:' as Info;
SELECT * FROM Station WHERE Station_Name IN ('Tirupati Railway Station', 'Bangalore City Junction', 'Renigunta Junction', 'Katpadi Junction', 'Jolarpettai Junction', 'Bangalore Cantonment');

SELECT 'Trains Added:' as Info;
SELECT * FROM Train WHERE Train_Name IN ('Tirupati Express', 'Bangalore Mail', 'Vande Bharat Express');

SELECT 'Train Schedules:' as Info;
SELECT 
    t.Train_Name,
    s.Station_Name,
    ts.Arrival_Time,
    ts.Departure_Time,
    ts.Platform_Number,
    ts.Stop_Number,
    ts.Distance_From_Source
FROM Train_Schedule ts
JOIN Train t ON ts.Train_ID = t.Train_ID
JOIN Station s ON ts.Station_ID = s.Station_ID
WHERE t.Train_Name IN ('Tirupati Express', 'Bangalore Mail', 'Vande Bharat Express')
ORDER BY t.Train_Name, ts.Stop_Number;
