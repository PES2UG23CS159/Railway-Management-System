-- Fix for missing Loco_Pilot table and Train_Schedule data
-- Run this in MySQL Workbench to fix the errors

USE train_reservation;

-- Check if Loco_Pilot table exists, create if not
CREATE TABLE IF NOT EXISTS Loco_Pilot (
    Pilot_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    License_Number VARCHAR(50) UNIQUE,
    Experience_Years INT,
    Contact_No VARCHAR(15),
    Date_of_Joining DATE
);

-- Insert sample loco pilots if table is empty
INSERT IGNORE INTO Loco_Pilot (Name, License_Number, Experience_Years, Contact_No, Date_of_Joining) VALUES
('Rajesh Sharma', 'LP001', 15, '9876543210', '2010-05-15'),
('Amit Kumar', 'LP002', 12, '9876543211', '2012-08-20'),
('Suresh Patil', 'LP003', 10, '9876543212', '2014-03-10'),
('Vikram Singh', 'LP004', 8, '9876543213', '2016-07-25'),
('Ramesh Verma', 'LP005', 6, '9876543214', '2018-11-30');

-- Check if Train_Schedule table exists, create if not
CREATE TABLE IF NOT EXISTS Train_Schedule (
    Schedule_ID INT AUTO_INCREMENT PRIMARY KEY,
    Train_ID INT,
    Station_ID INT,
    Arrival_Time TIME,
    Departure_Time TIME,
    Platform_Number INT,
    Stop_Number INT,
    Distance_From_Source DECIMAL(10,2),
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID) ON DELETE CASCADE,
    FOREIGN KEY (Station_ID) REFERENCES Station(Station_ID) ON DELETE CASCADE
);

-- Insert sample train schedules if table is empty
-- Schedule for Train 1 (Rajdhani Express)
INSERT IGNORE INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) VALUES
(1, 1, '00:00:00', '08:00:00', 1, 1, 0),       -- Mumbai Central
(1, 2, '08:30:00', '08:45:00', 2, 2, 30),      -- Borivali
(1, 3, '16:00:00', '16:30:00', 1, 3, 450),     -- Ahmedabad
(1, 4, '22:00:00', '22:20:00', 3, 4, 950),     -- Delhi
(1, 5, '23:00:00', '23:00:00', 2, 5, 1000);    -- New Delhi

-- Schedule for Train 2 (Shatabdi Express)
INSERT IGNORE INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) VALUES
(2, 4, '00:00:00', '06:00:00', 1, 1, 0),       -- Delhi
(2, 6, '09:30:00', '09:45:00', 2, 2, 200),     -- Jaipur
(2, 3, '14:00:00', '14:00:00', 1, 3, 550);     -- Ahmedabad

-- Schedule for Train 3 (Duronto Express)
INSERT IGNORE INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) VALUES
(3, 7, '00:00:00', '10:00:00', 1, 1, 0),       -- Kolkata
(3, 8, '18:00:00', '18:20:00', 2, 2, 500),     -- Bhubaneswar
(3, 1, '08:00:00', '08:00:00', 3, 3, 2000);    -- Mumbai Central

-- Schedule for Train 4 (Express Local)
INSERT IGNORE INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) VALUES
(4, 1, '00:00:00', '07:00:00', 1, 1, 0),       -- Mumbai Central
(4, 2, '07:30:00', '07:35:00', 2, 2, 30),      -- Borivali
(4, 9, '08:00:00', '08:00:00', 1, 3, 60);      -- Virar

-- Schedule for Train 5 (Chennai Express)
INSERT IGNORE INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) VALUES
(5, 1, '00:00:00', '20:00:00', 1, 1, 0),       -- Mumbai Central
(5, 8, '08:00:00', '08:30:00', 2, 2, 800),     -- Bhubaneswar
(5, 9, '14:00:00', '14:00:00', 1, 3, 1200);    -- Chennai (using station 9 as placeholder)

-- Create Operates table if not exists (links pilots to trains)
CREATE TABLE IF NOT EXISTS Operates (
    Operate_ID INT AUTO_INCREMENT PRIMARY KEY,
    Pilot_ID INT,
    Train_ID INT,
    FOREIGN KEY (Pilot_ID) REFERENCES Loco_Pilot(Pilot_ID) ON DELETE CASCADE,
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID) ON DELETE CASCADE
);

-- Link pilots to trains
INSERT IGNORE INTO Operates (Pilot_ID, Train_ID) VALUES
(1, 1),  -- Rajesh operates Rajdhani
(2, 2),  -- Amit operates Shatabdi
(3, 3),  -- Suresh operates Duronto
(4, 4),  -- Vikram operates Express Local
(5, 5);  -- Ramesh operates Chennai Express

-- Verify the data
SELECT 'Loco_Pilot Table:' as Info;
SELECT * FROM Loco_Pilot;

SELECT 'Train_Schedule Sample:' as Info;
SELECT TS.*, T.Train_Name, S.Name as Station_Name 
FROM Train_Schedule TS
JOIN Train T ON TS.Train_ID = T.Train_ID
JOIN Station S ON TS.Station_ID = S.Station_ID
ORDER BY TS.Train_ID, TS.Stop_Number
LIMIT 10;

SELECT 'Done! Tables created and data inserted.' as Status;
