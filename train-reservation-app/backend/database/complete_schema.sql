-- =========================================
-- TRAIN RESERVATION SYSTEM - COMPLETE SCHEMA
-- Database Management System Project
-- =========================================

-- Create and use database
DROP DATABASE IF EXISTS train_reservation;
CREATE DATABASE train_reservation;
USE train_reservation;

-- =========================================
-- TABLE CREATION
-- =========================================

-- Passenger Table
CREATE TABLE Passenger (
    Passenger_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Age INT CHECK (Age > 0 AND Age < 120),
    Contact_No VARCHAR(15),
    Gender ENUM('Male', 'Female', 'Other'),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    
    INDEX idx_passenger_email (Email),
    INDEX idx_passenger_name (Name)
);

-- Smartcard Table
CREATE TABLE Smartcard (
    Card_ID INT PRIMARY KEY AUTO_INCREMENT,
    Card_Number VARCHAR(20) UNIQUE NOT NULL,
    Card_Type VARCHAR(30) DEFAULT 'Standard',
    Issue_Date DATE NOT NULL,
    Expiry_Date DATE NOT NULL,
    Balance DECIMAL(10, 2) DEFAULT 0.00,
    Passenger_ID INT,
    
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE,
    INDEX idx_smartcard_passenger (Passenger_ID),
    INDEX idx_smartcard_number (Card_Number)
);

-- Station Table
CREATE TABLE Station (
    Station_ID INT PRIMARY KEY AUTO_INCREMENT,
    Station_Code VARCHAR(10) UNIQUE NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Location VARCHAR(200),
    Platform_Count INT DEFAULT 1,
    
    INDEX idx_station_code (Station_Code),
    INDEX idx_station_name (Name)
);

-- Route Table
CREATE TABLE Route (
    Route_ID INT PRIMARY KEY AUTO_INCREMENT,
    Route_Name VARCHAR(100) NOT NULL,
    Start_Station INT,
    End_Station INT,
    Distance_KM DECIMAL(10, 2),
    Route_Type VARCHAR(50),
    
    FOREIGN KEY (Start_Station) REFERENCES Station(Station_ID) ON DELETE RESTRICT,
    FOREIGN KEY (End_Station) REFERENCES Station(Station_ID) ON DELETE RESTRICT,
    INDEX idx_route_stations (Start_Station, End_Station)
);

-- Train Table
CREATE TABLE Train (
    Train_ID INT PRIMARY KEY AUTO_INCREMENT,
    Train_Name VARCHAR(100) NOT NULL,
    Train_Number VARCHAR(20) UNIQUE NOT NULL,
    Type VARCHAR(50),
    Total_Seats INT CHECK (Total_Seats > 0),
    
    INDEX idx_train_number (Train_Number),
    INDEX idx_train_type (Type)
);

-- Train_Schedule Table
CREATE TABLE Train_Schedule (
    Schedule_ID INT PRIMARY KEY AUTO_INCREMENT,
    Train_ID INT,
    Station_ID INT,
    Arrival_Time TIME,
    Departure_Time TIME,
    Platform_Number INT,
    Stop_Number INT,
    Distance_From_Source DECIMAL(10, 2),
    
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID) ON DELETE CASCADE,
    FOREIGN KEY (Station_ID) REFERENCES Station(Station_ID) ON DELETE CASCADE,
    INDEX idx_schedule_train (Train_ID),
    INDEX idx_schedule_station (Station_ID),
    INDEX idx_schedule_times (Arrival_Time, Departure_Time)
);

-- Ticket Table
CREATE TABLE Ticket (
    Ticket_ID INT PRIMARY KEY AUTO_INCREMENT,
    Booking_Date DATE NOT NULL,
    Journey_Date DATE NOT NULL,
    Fare DECIMAL(10, 2),
    Status ENUM('Confirmed', 'Cancelled', 'Completed') DEFAULT 'Confirmed',
    Class VARCHAR(20),
    Seat_No VARCHAR(10),
    Passenger_ID INT,
    
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE,
    INDEX idx_ticket_passenger (Passenger_ID),
    INDEX idx_ticket_journey_date (Journey_Date),
    INDEX idx_ticket_status (Status)
);

-- Loco_Pilot Table
CREATE TABLE Loco_Pilot (
    Pilot_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    License_Number VARCHAR(50) UNIQUE,
    Experience_Years INT CHECK (Experience_Years >= 0),
    Contact_No VARCHAR(15),
    Date_of_Joining DATE,
    
    INDEX idx_pilot_license (License_Number)
);

-- Linked_To Table (Ticket-Train Relationship)
CREATE TABLE Linked_To (
    Link_ID INT PRIMARY KEY AUTO_INCREMENT,
    Ticket_ID INT,
    Train_ID INT,
    Journey_Date DATE,
    
    FOREIGN KEY (Ticket_ID) REFERENCES Ticket(Ticket_ID) ON DELETE CASCADE,
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID) ON DELETE CASCADE,
    INDEX idx_linked_ticket (Ticket_ID),
    INDEX idx_linked_train (Train_ID)
);

-- Operates Table (Pilot-Train Assignment)
CREATE TABLE Operates (
    Operate_ID INT PRIMARY KEY AUTO_INCREMENT,
    Pilot_ID INT,
    Train_ID INT,
    Assignment_Date DATE,
    
    FOREIGN KEY (Pilot_ID) REFERENCES Loco_Pilot(Pilot_ID) ON DELETE CASCADE,
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID) ON DELETE CASCADE,
    INDEX idx_operates_pilot (Pilot_ID),
    INDEX idx_operates_train (Train_ID)
);

-- Passenger_Smartcard Table
CREATE TABLE Passenger_Smartcard (
    PS_ID INT PRIMARY KEY AUTO_INCREMENT,
    Passenger_ID INT,
    Card_ID INT,
    Link_Date DATE DEFAULT (CURRENT_DATE),
    
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE,
    FOREIGN KEY (Card_ID) REFERENCES Smartcard(Card_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_passenger_card (Passenger_ID, Card_ID)
);

-- Ticket_Audit_Log Table
CREATE TABLE Ticket_Audit_Log (
    Log_ID INT PRIMARY KEY AUTO_INCREMENT,
    Ticket_ID INT,
    Change_Type VARCHAR(50),
    Old_Value VARCHAR(100),
    New_Value VARCHAR(100),
    Changed_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Changed_By VARCHAR(100),
    
    FOREIGN KEY (Ticket_ID) REFERENCES Ticket(Ticket_ID) ON DELETE CASCADE,
    INDEX idx_audit_ticket (Ticket_ID),
    INDEX idx_audit_date (Changed_At)
);

-- Follows Table (Route Relationships)
CREATE TABLE Follows (
    Follow_ID INT PRIMARY KEY AUTO_INCREMENT,
    Route_ID INT,
    Next_Route_ID INT,
    
    FOREIGN KEY (Route_ID) REFERENCES Route(Route_ID) ON DELETE CASCADE,
    FOREIGN KEY (Next_Route_ID) REFERENCES Route(Route_ID) ON DELETE CASCADE
);

-- Consists_Of Table (Route-Station Mapping)
CREATE TABLE Consists_Of (
    CO_ID INT PRIMARY KEY AUTO_INCREMENT,
    Route_ID INT,
    Station_ID INT,
    Stop_Order INT,
    
    FOREIGN KEY (Route_ID) REFERENCES Route(Route_ID) ON DELETE CASCADE,
    FOREIGN KEY (Station_ID) REFERENCES Station(Station_ID) ON DELETE CASCADE,
    INDEX idx_consists_route (Route_ID),
    INDEX idx_consists_station (Station_ID)
);

-- =========================================
-- SAMPLE DATA INSERTION
-- =========================================

-- Insert Sample Passengers
INSERT INTO Passenger (Name, Age, Contact_No, Gender, Email, Password) VALUES
('Rajesh Kumar', 28, '9876543210', 'Male', 'rajesh.kumar@email.com', 'pass123'),
('Priya Sharma', 25, '9876543211', 'Female', 'priya.sharma@email.com', 'pass123'),
('Amit Patel', 32, '9876543212', 'Male', 'amit.patel@email.com', 'pass123'),
('Sneha Reddy', 22, '9876543213', 'Female', 'sneha.reddy@email.com', 'pass123'),
('Vikram Singh', 35, '9876543214', 'Male', 'vikram.singh@email.com', 'pass123'),
('Yogesh', 24, '9876543215', 'Male', 'yogesh@gmail.com', 'pass123');

-- Insert Sample Smartcards
INSERT INTO Smartcard (Card_Number, Card_Type, Issue_Date, Expiry_Date, Balance, Passenger_ID) VALUES
('SC1001234567', 'Standard', '2024-01-15', '2025-01-15', 21200.00, 1),
('SC1001234568', 'Standard', '2024-02-20', '2025-02-20', 1500.00, 2),
('SC1001234569', 'Premium', '2024-03-10', '2025-03-10', 3000.00, 3),
('SC1001234570', 'Standard', '2024-04-05', '2025-04-05', 800.00, 4),
('SC1001234571', 'Premium', '2024-05-12', '2025-05-12', 5000.00, 5),
('SC1001234572', 'Standard', '2024-06-18', '2025-06-18', 2000.00, 6);

-- Insert Sample Stations
INSERT INTO Station (Station_Code, Name, Location, Platform_Count) VALUES
('MUM', 'Mumbai Central', 'Mumbai, Maharashtra', 8),
('BOR', 'Borivali', 'Mumbai, Maharashtra', 4),
('AMD', 'Ahmedabad Junction', 'Ahmedabad, Gujarat', 10),
('DEL', 'New Delhi', 'Delhi', 16),
('JP', 'Jaipur Junction', 'Jaipur, Rajasthan', 6),
('KOL', 'Kolkata', 'Kolkata, West Bengal', 12),
('CHE', 'Chennai Central', 'Chennai, Tamil Nadu', 10),
('BBS', 'Bhubaneswar', 'Bhubaneswar, Odisha', 6),
('PUN', 'Pune Junction', 'Pune, Maharashtra', 8),
('BLR', 'Bangalore City', 'Bangalore, Karnataka', 10);

-- Insert Sample Trains
INSERT INTO Train (Train_Name, Train_Number, Type, Total_Seats) VALUES
('Rajdhani Express', '12951', 'Superfast', 500),
('Shatabdi Express', '12002', 'Superfast', 400),
('Duronto Express', '12259', 'Superfast', 450),
('Express Local', '12345', 'Express', 300),
('Chennai Mail', '12163', 'Mail', 600),
('Mumbai Rajdhani', '12952', 'Superfast', 500);

-- Insert Sample Train Schedules
INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) VALUES
-- Rajdhani Express (Mumbai to Delhi)
(1, 1, '00:00:00', '16:35:00', 1, 1, 0),
(1, 2, '17:05:00', '17:10:00', 2, 2, 30),
(1, 3, '22:30:00', '22:45:00', 1, 3, 492),
(1, 4, '08:10:00', '00:00:00', 3, 4, 1384),

-- Shatabdi Express (Delhi to Jaipur)
(2, 4, '00:00:00', '06:05:00', 1, 1, 0),
(2, 5, '10:30:00', '00:00:00', 2, 2, 308),

-- Duronto Express (Kolkata to Mumbai)
(3, 6, '00:00:00', '14:45:00', 1, 1, 0),
(3, 8, '22:00:00', '22:15:00', 2, 2, 441),
(3, 1, '13:30:00', '00:00:00', 3, 3, 2014);

-- Insert Sample Loco Pilots
INSERT INTO Loco_Pilot (Name, License_Number, Experience_Years, Contact_No, Date_of_Joining) VALUES
('Rajesh Sharma', 'LP001', 15, '9876543210', '2010-05-15'),
('Amit Kumar', 'LP002', 12, '9876543211', '2012-08-20'),
('Suresh Patil', 'LP003', 10, '9876543212', '2014-03-10'),
('Vikram Singh', 'LP004', 8, '9876543213', '2016-07-25'),
('Ramesh Verma', 'LP005', 6, '9876543214', '2018-11-30');

-- Link Pilots to Trains
INSERT INTO Operates (Pilot_ID, Train_ID, Assignment_Date) VALUES
(1, 1, '2024-01-01'),
(2, 2, '2024-01-01'),
(3, 3, '2024-01-01'),
(4, 4, '2024-01-01'),
(5, 5, '2024-01-01');

-- Insert Sample Routes
INSERT INTO Route (Route_Name, Start_Station, End_Station, Distance_KM, Route_Type) VALUES
('Mumbai-Delhi Route', 1, 4, 1384, 'Long Distance'),
('Delhi-Jaipur Route', 4, 5, 308, 'Medium Distance'),
('Kolkata-Mumbai Route', 6, 1, 2014, 'Long Distance');

-- =========================================
-- CREATE VIEWS
-- =========================================

-- Passenger Dashboard View
CREATE VIEW passenger_dashboard AS
SELECT 
    p.Passenger_ID,
    p.Name,
    p.Email,
    p.Age,
    s.Card_Number,
    s.Balance,
    COUNT(t.Ticket_ID) AS Total_Bookings
FROM Passenger p
LEFT JOIN Smartcard s ON p.Passenger_ID = s.Passenger_ID
LEFT JOIN Ticket t ON p.Passenger_ID = t.Passenger_ID
GROUP BY p.Passenger_ID, p.Name, p.Email, p.Age, s.Card_Number, s.Balance;

-- Admin Statistics View
CREATE VIEW admin_statistics AS
SELECT 
    (SELECT COUNT(*) FROM Passenger) AS Total_Passengers,
    (SELECT COUNT(*) FROM Train) AS Total_Trains,
    (SELECT COUNT(*) FROM Station) AS Total_Stations,
    (SELECT COUNT(*) FROM Ticket WHERE Status = 'Confirmed') AS Active_Bookings,
    (SELECT SUM(Fare) FROM Ticket WHERE Status = 'Confirmed') AS Total_Revenue;

-- Train Schedule View
CREATE VIEW train_schedule_view AS
SELECT 
    t.Train_Name,
    t.Train_Number,
    s.Name AS Station_Name,
    s.Station_Code,
    ts.Arrival_Time,
    ts.Departure_Time,
    ts.Platform_Number,
    ts.Stop_Number,
    ts.Distance_From_Source
FROM Train_Schedule ts
JOIN Train t ON ts.Train_ID = t.Train_ID
JOIN Station s ON ts.Station_ID = s.Station_ID
ORDER BY ts.Train_ID, ts.Stop_Number;

-- =========================================
-- CREATE TRIGGERS
-- =========================================

-- Trigger 1: Audit Log for Ticket Status Changes
DELIMITER //
CREATE TRIGGER ticket_audit_trigger
AFTER UPDATE ON Ticket
FOR EACH ROW
BEGIN
    IF OLD.Status != NEW.Status THEN
        INSERT INTO Ticket_Audit_Log (
            Ticket_ID, Change_Type, Old_Value, New_Value, Changed_At, Changed_By
        ) VALUES (
            NEW.Ticket_ID, 
            'Status Change', 
            OLD.Status, 
            NEW.Status, 
            NOW(),
            CONCAT('Passenger_', NEW.Passenger_ID)
        );
    END IF;
END//
DELIMITER ;

-- Trigger 2: Prevent Negative Smartcard Balance
DELIMITER //
CREATE TRIGGER check_smartcard_balance
BEFORE UPDATE ON Smartcard
FOR EACH ROW
BEGIN
    IF NEW.Balance < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Smartcard balance cannot be negative';
    END IF;
END//
DELIMITER ;

-- =========================================
-- CREATE STORED PROCEDURES
-- =========================================

-- Procedure 1: Book Ticket
DELIMITER //
CREATE PROCEDURE BookTicket(
    IN p_passenger_id INT,
    IN p_train_id INT,
    IN p_journey_date DATE,
    IN p_class VARCHAR(20),
    IN p_fare DECIMAL(10,2)
)
BEGIN
    DECLARE v_ticket_id INT;
    DECLARE v_seat_no VARCHAR(10);
    
    -- Generate seat number
    SET v_seat_no = CONCAT(p_class, '-', FLOOR(RAND() * 100 + 1));
    
    -- Insert ticket
    INSERT INTO Ticket (
        Booking_Date, Journey_Date, Fare, Status, Class, Seat_No, Passenger_ID
    ) VALUES (
        CURDATE(), p_journey_date, p_fare, 'Confirmed', p_class, v_seat_no, p_passenger_id
    );
    
    SET v_ticket_id = LAST_INSERT_ID();
    
    -- Link ticket to train
    INSERT INTO Linked_To (Ticket_ID, Train_ID, Journey_Date)
    VALUES (v_ticket_id, p_train_id, p_journey_date);
    
    -- Return ticket details
    SELECT v_ticket_id AS Ticket_ID, v_seat_no AS Seat_Number, p_fare AS Fare;
END//
DELIMITER ;

-- Procedure 2: Recharge Smartcard
DELIMITER //
CREATE PROCEDURE RechargeSmartcard(
    IN p_card_id INT,
    IN p_amount DECIMAL(10,2)
)
BEGIN
    DECLARE v_old_balance DECIMAL(10,2);
    DECLARE v_new_balance DECIMAL(10,2);
    
    -- Get current balance
    SELECT Balance INTO v_old_balance FROM Smartcard WHERE Card_ID = p_card_id;
    
    -- Update balance
    UPDATE Smartcard
    SET Balance = Balance + p_amount
    WHERE Card_ID = p_card_id;
    
    -- Get new balance
    SELECT Balance INTO v_new_balance FROM Smartcard WHERE Card_ID = p_card_id;
    
    -- Return details
    SELECT 
        p_card_id AS Card_ID, 
        v_old_balance AS Old_Balance,
        p_amount AS Recharge_Amount,
        v_new_balance AS New_Balance;
END//
DELIMITER ;

-- =========================================
-- CREATE FUNCTIONS
-- =========================================

-- Function: Calculate Fare Based on Distance and Class
DELIMITER //
CREATE FUNCTION CalculateFare(
    distance DECIMAL(10,2),
    class_type VARCHAR(20)
) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE base_rate DECIMAL(10,2);
    
    CASE class_type
        WHEN 'Sleeper' THEN SET base_rate = 0.50;
        WHEN '3AC' THEN SET base_rate = 1.00;
        WHEN '2AC' THEN SET base_rate = 1.50;
        WHEN '1AC' THEN SET base_rate = 2.00;
        ELSE SET base_rate = 0.40;
    END CASE;
    
    RETURN ROUND(distance * base_rate, 2);
END//
DELIMITER ;

-- =========================================
-- CREATE INDEXES FOR OPTIMIZATION
-- =========================================

CREATE INDEX idx_ticket_booking_date ON Ticket(Booking_Date);
CREATE INDEX idx_schedule_stop_order ON Train_Schedule(Stop_Number);
CREATE INDEX idx_smartcard_expiry ON Smartcard(Expiry_Date);
CREATE INDEX idx_passenger_age ON Passenger(Age);

-- =========================================
-- VERIFICATION QUERIES
-- =========================================

SELECT 'Database Schema Created Successfully!' AS Status;
SELECT COUNT(*) AS Total_Tables FROM information_schema.tables WHERE table_schema = 'train_reservation';
SELECT COUNT(*) AS Total_Passengers FROM Passenger;
SELECT COUNT(*) AS Total_Trains FROM Train;
SELECT COUNT(*) AS Total_Stations FROM Station;
SELECT 'All tables, views, triggers, procedures, and functions are ready!' AS Message;
