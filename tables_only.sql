-- ============================================================================
-- TRAIN RESERVATION SYSTEM - TABLES ONLY
-- ============================================================================
-- This file contains ONLY table definitions and sample data
-- No triggers, functions, or stored procedures
-- ============================================================================

-- 1. DROP AND CREATE DATABASE
DROP DATABASE IF EXISTS train_reservation;
CREATE DATABASE train_reservation;
USE train_reservation;

-- ============================================================================
-- 2. TABLE CREATION
-- ============================================================================

-- 2.1 Passenger Table
CREATE TABLE Passenger (
    Passenger_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Age INT,
    Contact_No VARCHAR(15),
    Gender VARCHAR(10),
    Email VARCHAR(100),
    Password VARCHAR(255)
);

-- 2.2 Station Table
CREATE TABLE Station (
    Station_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Location VARCHAR(100),
    Station_Code VARCHAR(10) UNIQUE,
    Platform_Count INT DEFAULT 1
);

-- 2.3 Route Table
CREATE TABLE Route (
    Route_ID INT AUTO_INCREMENT PRIMARY KEY,
    Route_Name VARCHAR(100) NOT NULL,
    Start_Station VARCHAR(100),
    End_Station VARCHAR(100),
    Distance_KM DECIMAL(10,2),
    Route_Type VARCHAR(50)
);

-- 2.4 Train Table
CREATE TABLE Train (
    Train_ID INT AUTO_INCREMENT PRIMARY KEY,
    Train_Name VARCHAR(100) NOT NULL,
    Train_Number VARCHAR(10) UNIQUE,
    Capacity INT,
    Total_Coaches INT,
    Train_Type VARCHAR(50)
);

-- 2.5 Loco_Pilot Table
CREATE TABLE Loco_Pilot (
    Loco_Pilot_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Role VARCHAR(50),
    Age INT,
    License_Number VARCHAR(50) UNIQUE,
    Experience_Years INT,
    Station_ID INT,
    FOREIGN KEY (Station_ID) REFERENCES Station(Station_ID)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- 2.6 Ticket Table
CREATE TABLE Ticket (
    Ticket_ID INT AUTO_INCREMENT PRIMARY KEY,
    PNR_Number VARCHAR(10) UNIQUE,
    Date_Time DATETIME NOT NULL,
    Journey_Date DATE NOT NULL,
    Fare DECIMAL(10,2),
    Source_Station VARCHAR(100) NOT NULL,
    Destination_Station VARCHAR(100) NOT NULL,
    Class VARCHAR(20),
    Seat_Number VARCHAR(10),
    Coach_Number VARCHAR(10),
    Status VARCHAR(20) DEFAULT 'Confirmed',
    Passenger_ID INT,
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.7 Smartcard Table
CREATE TABLE Smartcard (
    Card_ID INT AUTO_INCREMENT PRIMARY KEY,
    Card_Number VARCHAR(20) UNIQUE NOT NULL,
    Card_Type VARCHAR(30),
    Issue_Date DATE NOT NULL,
    Expiry_Date DATE NOT NULL,
    Balance DECIMAL(10,2),
    Passenger_ID INT,
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.8 Train Schedule Table
CREATE TABLE Train_Schedule (
    Schedule_ID INT AUTO_INCREMENT PRIMARY KEY,
    Train_ID INT NOT NULL,
    Station_ID INT NOT NULL,
    Arrival_Time TIME,
    Departure_Time TIME,
    Platform_Number INT,
    Stop_Number INT,
    Distance_From_Source DECIMAL(10,2),
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Station_ID) REFERENCES Station(Station_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.9 Ticket Audit Log Table
CREATE TABLE Ticket_Audit_Log (
    Log_ID INT AUTO_INCREMENT PRIMARY KEY,
    Ticket_ID INT,
    Action_Type VARCHAR(20),
    Old_Status VARCHAR(20),
    New_Status VARCHAR(20),
    Changed_By VARCHAR(50),
    Changed_At DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. ASSOCIATIVE TABLES (Many-to-Many Relationships)
-- ============================================================================

-- 3.1 Passenger_Smartcard Relationship
CREATE TABLE Passenger_Smartcard (
    Passenger_ID INT NOT NULL,
    Card_ID INT NOT NULL,
    PRIMARY KEY (Passenger_ID, Card_ID),
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Card_ID) REFERENCES Smartcard(Card_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3.2 Linked_To Relationship (Ticket - Train)
CREATE TABLE Linked_To (
    Ticket_ID INT NOT NULL,
    Train_ID INT NOT NULL,
    PRIMARY KEY (Ticket_ID, Train_ID),
    FOREIGN KEY (Ticket_ID) REFERENCES Ticket(Ticket_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3.3 Follows Relationship (Train - Route)
CREATE TABLE Follows (
    Train_ID INT NOT NULL,
    Route_ID INT NOT NULL,
    PRIMARY KEY (Train_ID, Route_ID),
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Route_ID) REFERENCES Route(Route_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3.4 Consists_Of Relationship (Route - Station)
CREATE TABLE Consists_Of (
    Route_ID INT NOT NULL,
    Station_ID INT NOT NULL,
    Stop_Sequence INT,
    Distance_From_Start DECIMAL(10,2),
    PRIMARY KEY (Route_ID, Station_ID),
    FOREIGN KEY (Route_ID) REFERENCES Route(Route_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Station_ID) REFERENCES Station(Station_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3.5 Operates Relationship (Loco_Pilot - Train)
CREATE TABLE Operates (
    Loco_Pilot_ID INT NOT NULL,
    Train_ID INT NOT NULL,
    Duty_Date DATE,
    Shift VARCHAR(20),
    PRIMARY KEY (Loco_Pilot_ID, Train_ID),
    FOREIGN KEY (Loco_Pilot_ID) REFERENCES Loco_Pilot(Loco_Pilot_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================================
-- 4. SAMPLE DATA INSERTION
-- ============================================================================

-- 4.1 Passengers
INSERT INTO Passenger (Name, Age, Contact_No, Gender, Email, Password) VALUES
('Rajesh Kumar', 35, '9876543210', 'Male', 'rajesh.kumar@email.com', 'pass123'),
('Priya Sharma', 28, '9876509876', 'Female', 'priya.sharma@email.com', 'pass123'),
('Amit Patel', 42, '9123456789', 'Male', 'amit.patel@email.com', 'pass123'),
('Sneha Reddy', 31, '9988776655', 'Female', 'sneha.reddy@email.com', 'pass123'),
('Vikram Singh', 65, '8899776655', 'Male', 'vikram.singh@email.com', 'pass123');

-- 4.2 Stations
INSERT INTO Station (Name, Location, Station_Code, Platform_Count) VALUES
('New Delhi', 'Delhi', 'NDLS', 16),
('Mumbai Central', 'Mumbai', 'BCT', 7),
('Chennai Central', 'Chennai', 'MAS', 12),
('Bangalore City', 'Bangalore', 'SBC', 10),
('Howrah Junction', 'Kolkata', 'HWH', 23),
('Patna Junction', 'Patna', 'PNBE', 10),
('Lucknow', 'Lucknow', 'LKO', 8),
('Jamnagar', 'Jamnagar', 'JAT', 5);

-- 4.3 Routes
INSERT INTO Route (Route_Name, Start_Station, End_Station, Distance_KM, Route_Type) VALUES
('New Delhi - Mumbai Route', 'New Delhi', 'Mumbai', 1384.0, 'Rajdhani Express'),
('Chennai - Bangalore Route', 'Chennai', 'Bangalore', 362.0, 'Shatabdi Express'),
('Delhi - Kolkata Route', 'New Delhi', 'Kolkata', 1441.0, 'Superfast'),
('Delhi - Lucknow Route', 'New Delhi', 'Lucknow', 495.0, 'Mail Express'),
('Mumbai - Chennai Route', 'Mumbai', 'Chennai', 1279.0, 'Express');

-- 4.4 Trains
INSERT INTO Train (Train_Name, Train_Number, Capacity, Total_Coaches, Train_Type) VALUES
('Mumbai Rajdhani', '12951', 500, 18, 'Rajdhani'),
('Shatabdi Express', '12028', 400, 12, 'Shatabdi'),
('Kolkata Rajdhani', '12302', 550, 20, 'Rajdhani'),
('Lucknow Mail', '12430', 1100, 22, 'Mail Express'),
('Chennai Express', '12164', 1300, 24, 'Superfast');

-- 4.5 Loco Pilots
INSERT INTO Loco_Pilot (Name, Role, Age, License_Number, Experience_Years, Station_ID) VALUES
('Ramesh Verma', 'Senior Driver', 45, 'LP-2018-001', 15, 1),
('Suresh Yadav', 'Senior Driver', 42, 'LP-2019-042', 12, 2),
('Anil Kumar', 'Assistant Driver', 38, 'LP-2020-125', 8, 3),
('Prakash Joshi', 'Assistant Driver', 35, 'LP-2021-089', 6, 4),
('Manoj Tiwari', 'Trainee', 28, 'LP-2022-156', 3, 5);

-- 4.6 Tickets
INSERT INTO Ticket (PNR_Number, Date_Time, Journey_Date, Fare, Source_Station, Destination_Station, Class, Seat_Number, Coach_Number, Status, Passenger_ID) VALUES
('2510123456', '2025-10-20 10:30:00', '2025-11-05', 2500.00, 'New Delhi', 'Mumbai', 'AC-2', '45', 'A1', 'Confirmed', 1),
('2510123457', '2025-10-21 14:15:00', '2025-11-08', 800.00, 'Chennai', 'Bangalore', 'AC-Chair', '12', 'C3', 'Confirmed', 2),
('2510123458', '2025-10-22 09:00:00', '2025-11-10', 1800.00, 'New Delhi', 'Kolkata', 'AC-3', '28', 'B2', 'Confirmed', 3),
('2510123459', '2025-10-23 16:30:00', '2025-11-12', 600.00, 'New Delhi', 'Lucknow', 'Sleeper', '52', 'S7', 'RAC', 4),
('2510123460', '2025-10-24 11:00:00', '2025-11-15', 1200.00, 'Mumbai', 'Chennai', 'AC-3', '34', 'B4', 'Waiting', 5);

-- 4.7 Smartcards
INSERT INTO Smartcard (Card_Number, Card_Type, Issue_Date, Expiry_Date, Balance, Passenger_ID) VALUES
('RC-2025-001234', 'Regular', '2025-01-15', '2026-01-15', 5000.00, 1),
('RC-2025-001235', 'Senior Citizen', '2025-02-20', '2026-02-20', 3000.00, 2),
('RC-2025-001236', 'Regular', '2025-03-10', '2026-03-10', 7000.00, 3),
('RC-2025-001237', 'Student', '2025-04-05', '2026-04-05', 2500.00, 4),
('RC-2025-001238', 'Senior Citizen', '2025-05-12', '2026-05-12', 4500.00, 5);

-- 4.8 Train Schedule
INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) VALUES
-- Mumbai Rajdhani Schedule
(1, 1, NULL, '16:30:00', 5, 1, 0),           -- New Delhi (Start)
(1, 2, '08:35:00', NULL, 3, 2, 1384.0),      -- Mumbai (End)
-- Shatabdi Express Schedule
(2, 3, NULL, '06:00:00', 7, 1, 0),           -- Chennai (Start)
(2, 4, '11:45:00', NULL, 4, 2, 362.0),       -- Bangalore (End)
-- Kolkata Rajdhani Schedule
(3, 1, NULL, '17:00:00', 8, 1, 0),           -- New Delhi (Start)
(3, 5, '10:05:00', NULL, 12, 2, 1441.0);     -- Kolkata (End)

-- 4.9 Associative Tables

-- Passenger_Smartcard
INSERT INTO Passenger_Smartcard (Passenger_ID, Card_ID) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5);

-- Linked_To (Ticket - Train)
INSERT INTO Linked_To (Ticket_ID, Train_ID) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5);

-- Follows (Train - Route)
INSERT INTO Follows (Train_ID, Route_ID) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5);

-- Consists_Of (Route - Station)
INSERT INTO Consists_Of (Route_ID, Station_ID, Stop_Sequence, Distance_From_Start) VALUES
-- Route 1: New Delhi to Mumbai
(1, 1, 1, 0),
(1, 2, 2, 1384.0),
-- Route 2: Chennai to Bangalore
(2, 3, 1, 0),
(2, 4, 2, 362.0),
-- Route 3: Delhi to Kolkata
(3, 1, 1, 0),
(3, 6, 2, 997.0),
(3, 5, 3, 1441.0),
-- Route 4: Delhi to Lucknow
(4, 1, 1, 0),
(4, 7, 2, 495.0);

-- Operates (Loco_Pilot - Train)
INSERT INTO Operates (Loco_Pilot_ID, Train_ID, Duty_Date, Shift) VALUES
(1, 1, '2025-11-05', 'Evening'),
(2, 2, '2025-11-08', 'Morning'),
(3, 3, '2025-11-10', 'Evening'),
(4, 4, '2025-11-12', 'Morning'),
(5, 5, '2025-11-15', 'Morning');

-- ============================================================================
-- 5. VERIFICATION QUERIES
-- ============================================================================

-- Show all tables
SHOW TABLES;

-- View all data
SELECT * FROM Passenger;
SELECT * FROM Station;
SELECT * FROM Route;
SELECT * FROM Train;
SELECT * FROM Loco_Pilot;
SELECT * FROM Ticket;
SELECT * FROM Smartcard;
SELECT * FROM Train_Schedule;

-- View Passengers with Smartcards
SELECT 
    P.Passenger_ID,
    P.Name AS Passenger_Name,
    P.Age,
    SC.Card_Number,
    SC.Card_Type,
    SC.Balance,
    SC.Expiry_Date
FROM Passenger P
LEFT JOIN Smartcard SC ON P.Passenger_ID = SC.Passenger_ID;

-- View All Tickets with Details
SELECT 
    T.PNR_Number,
    P.Name AS Passenger_Name,
    T.Journey_Date,
    T.Source_Station,
    T.Destination_Station,
    TR.Train_Name,
    T.Class,
    T.Seat_Number,
    T.Fare,
    T.Status
FROM Ticket T
JOIN Passenger P ON T.Passenger_ID = P.Passenger_ID
LEFT JOIN Linked_To LT ON T.Ticket_ID = LT.Ticket_ID
LEFT JOIN Train TR ON LT.Train_ID = TR.Train_ID
ORDER BY T.Journey_Date;

-- View Train Routes
SELECT 
    T.Train_Number,
    T.Train_Name,
    T.Train_Type,
    R.Route_Name,
    R.Start_Station,
    R.End_Station,
    R.Distance_KM
FROM Train T
JOIN Follows F ON T.Train_ID = F.Train_ID
JOIN Route R ON F.Route_ID = R.Route_ID;

-- View Train Schedule with Station Details
SELECT 
    T.Train_Name,
    T.Train_Number,
    S.Name AS Station_Name,
    TS.Arrival_Time,
    TS.Departure_Time,
    TS.Platform_Number,
    TS.Stop_Number
FROM Train_Schedule TS
JOIN Train T ON TS.Train_ID = T.Train_ID
JOIN Station S ON TS.Station_ID = S.Station_ID
ORDER BY T.Train_ID, TS.Stop_Number;

-- View Loco Pilots with their Assigned Stations
SELECT 
    LP.Name AS Pilot_Name,
    LP.Role,
    LP.Age,
    LP.License_Number,
    LP.Experience_Years,
    S.Name AS Assigned_Station
FROM Loco_Pilot LP
LEFT JOIN Station S ON LP.Station_ID = S.Station_ID;

-- ============================================================================
-- END OF TABLES ONLY FILE
-- ============================================================================
