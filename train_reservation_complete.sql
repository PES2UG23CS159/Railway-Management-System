-- ============================================================================
-- TRAIN RESERVATION SYSTEM - COMPLETE DATABASE
-- ============================================================================
-- This is a comprehensive railway/train reservation system with:
-- - 13 Tables (8 main + 5 associative)
-- - 12 Triggers for business logic
-- - 4 Functions for calculations
-- - 7 Stored Procedures for operations
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
    Email VARCHAR(100)
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
    Route_Type VARCHAR(50) -- Express, Superfast, Passenger
);

-- 2.4 Train Table
CREATE TABLE Train (
    Train_ID INT AUTO_INCREMENT PRIMARY KEY,
    Train_Name VARCHAR(100) NOT NULL,
    Train_Number VARCHAR(10) UNIQUE,
    Capacity INT,
    Total_Coaches INT,
    Train_Type VARCHAR(50) -- Express, Local, Metro, etc.
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
    Class VARCHAR(20), -- General, Sleeper, AC-3, AC-2, AC-1
    Seat_Number VARCHAR(10),
    Coach_Number VARCHAR(10),
    Status VARCHAR(20) DEFAULT 'Confirmed', -- Confirmed, Waiting, RAC, Cancelled
    Passenger_ID INT,
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.7 Smartcard Table (Railway Card)
CREATE TABLE Smartcard (
    Card_ID INT AUTO_INCREMENT PRIMARY KEY,
    Card_Number VARCHAR(20) UNIQUE NOT NULL,
    Card_Type VARCHAR(30), -- Regular, Senior Citizen, Student
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

-- 2.9 Ticket Audit Log Table (for trigger logging)
CREATE TABLE Ticket_Audit_Log (
    Log_ID INT AUTO_INCREMENT PRIMARY KEY,
    Ticket_ID INT,
    Action_Type VARCHAR(20), -- INSERT, UPDATE, CANCEL
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
    Shift VARCHAR(20), -- Morning, Evening, Night
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
INSERT INTO Passenger (Name, Age, Contact_No, Gender, Email) VALUES
('Arjun Mehta', 28, '9876543210', 'Male', 'arjun.mehta@email.com'),
('Sneha Rao', 25, '9876509876', 'Female', 'sneha.rao@email.com'),
('Rohit Sharma', 30, '9123456789', 'Male', 'rohit.sharma@email.com'),
('Priya Kumar', 35, '9988776655', 'Female', 'priya.kumar@email.com'),
('Vikram Singh', 65, '8899776655', 'Male', 'vikram.singh@email.com');

-- 4.2 Stations
INSERT INTO Station (Name, Location, Station_Code, Platform_Count) VALUES
('Majestic', 'Bangalore', 'MJS', 6),
('Silkboard', 'Bangalore', 'SLK', 4),
('Whitefield', 'Bangalore', 'WTF', 5),
('K R Pura', 'Bangalore', 'KRP', 3),
('Indiranagar', 'Bangalore', 'ING', 4),
('Mysuru Road', 'Bangalore', 'MYS', 3),
('Yeshwanthpur', 'Bangalore', 'YPR', 8),
('Krantivira', 'Bangalore', 'KRV', 2);

-- 4.3 Routes
INSERT INTO Route (Route_Name, Start_Station, End_Station, Distance_KM, Route_Type) VALUES
('South Express', 'Bangalore', 'Chennai', 362.0, 'Express'),
('West Express', 'Mumbai', 'Bangalore', 1035.0, 'Superfast'),
('East Express', 'Kolkata', 'Chennai', 1659.0, 'Express'),
('Purple Line', 'Whitefield', 'Mysuru Road', 42.5, 'Metro'),
('Green Line', 'Silkboard', 'Yeshwanthpur', 30.0, 'Metro');

-- 4.4 Trains
INSERT INTO Train (Train_Name, Train_Number, Capacity, Total_Coaches, Train_Type) VALUES
('Namma Metro Purple', 'METRO01', 500, 6, 'Metro'),
('Namma Metro Green', 'METRO02', 450, 6, 'Metro'),
('Bangalore Express', 'EXP101', 1200, 20, 'Express'),
('City Local', 'LOCAL01', 800, 12, 'Local');

-- 4.5 Loco Pilots
INSERT INTO Loco_Pilot (Name, Role, Age, License_Number, Experience_Years, Station_ID) VALUES
('Manoj Kumar', 'Chief Pilot', 45, 'LP-2018-001', 20, 1),
('Sujatha Rao', 'Assistant Pilot', 38, 'LP-2020-042', 12, 2),
('Ramesh Verma', 'Senior Driver', 42, 'LP-2019-125', 15, 3),
('Prakash Joshi', 'Trainee', 28, 'LP-2023-089', 3, 4);

-- 4.6 Tickets
INSERT INTO Ticket (PNR_Number, Date_Time, Journey_Date, Fare, Source_Station, Destination_Station, Class, Seat_Number, Coach_Number, Status, Passenger_ID) VALUES
('2510123456', '2025-10-20 10:30:00', '2025-11-05', 550.00, 'Majestic', 'Silkboard', 'General', '45', 'G1', 'Confirmed', 1),
('2510123457', '2025-10-21 08:00:00', '2025-11-08', 750.00, 'Indiranagar', 'Mysuru Road', 'AC-3', '12', 'A1', 'Confirmed', 2),
('2510123458', '2025-10-22 15:00:00', '2025-11-10', 900.00, 'Whitefield', 'K R Pura', 'Sleeper', '28', 'S2', 'Confirmed', 3),
('2510123459', '2025-10-23 16:30:00', '2025-11-12', 400.00, 'Silkboard', 'Yeshwanthpur', 'General', '52', 'G3', 'RAC', 4),
('2510123460', '2025-10-24 11:00:00', '2025-11-15', 650.00, 'Majestic', 'Whitefield', 'AC-3', '34', 'A2', 'Waiting', 5);

-- 4.7 Smartcards
INSERT INTO Smartcard (Card_Number, Card_Type, Issue_Date, Expiry_Date, Balance, Passenger_ID) VALUES
('SC-2025-001234', 'Regular', '2025-01-01', '2026-01-01', 2000.00, 1),
('SC-2025-001235', 'Student', '2025-03-15', '2026-03-15', 1500.00, 2),
('SC-2025-001236', 'Regular', '2025-05-20', '2026-05-20', 3000.00, 3),
('SC-2025-001237', 'Regular', '2025-06-10', '2026-06-10', 2500.00, 4),
('SC-2025-001238', 'Senior Citizen', '2025-07-15', '2026-07-15', 4000.00, 5);

-- 4.8 Train Schedule
INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) VALUES
-- Metro Purple Line Schedule
(1, 3, NULL, '06:00:00', 1, 1, 0),        -- Whitefield (Start)
(1, 4, '06:15:00', '06:17:00', 2, 2, 8.5),  -- K R Pura
(1, 1, '06:35:00', '06:37:00', 3, 3, 22.0), -- Majestic
(1, 6, '06:50:00', NULL, 2, 4, 42.5),       -- Mysuru Road (End)
-- Metro Green Line Schedule
(2, 2, NULL, '07:00:00', 1, 1, 0),        -- Silkboard (Start)
(2, 1, '07:20:00', '07:22:00', 4, 2, 12.0), -- Majestic
(2, 7, '07:45:00', NULL, 3, 3, 30.0);       -- Yeshwanthpur (End)

-- 4.9 Associative Tables

-- Passenger_Smartcard
INSERT INTO Passenger_Smartcard (Passenger_ID, Card_ID) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5);

-- Linked_To (Ticket - Train)
INSERT INTO Linked_To (Ticket_ID, Train_ID) VALUES
(1, 1), (2, 2), (3, 1), (4, 2), (5, 3);

-- Follows (Train - Route)
INSERT INTO Follows (Train_ID, Route_ID) VALUES
(1, 4), (2, 5), (3, 1), (4, 5);

-- Consists_Of (Route - Station)
INSERT INTO Consists_Of (Route_ID, Station_ID, Stop_Sequence, Distance_From_Start) VALUES
-- Purple Line Stations
(4, 3, 1, 0),      -- Whitefield
(4, 4, 2, 8.5),    -- K R Pura
(4, 1, 3, 22.0),   -- Majestic
(4, 6, 4, 42.5),   -- Mysuru Road
-- Green Line Stations
(5, 2, 1, 0),      -- Silkboard
(5, 1, 2, 12.0),   -- Majestic
(5, 7, 3, 30.0);   -- Yeshwanthpur

-- Operates (Loco_Pilot - Train)
INSERT INTO Operates (Loco_Pilot_ID, Train_ID, Duty_Date, Shift) VALUES
(1, 1, '2025-11-05', 'Morning'),
(2, 2, '2025-11-08', 'Morning'),
(3, 3, '2025-11-10', 'Evening'),
(4, 4, '2025-11-12', 'Morning');

-- ============================================================================
-- 5. TRIGGERS (12 Business Logic Triggers)
-- ============================================================================

-- TRIGGER 1: Check Smartcard Balance Before Booking
DELIMITER $$
CREATE TRIGGER check_smartcard_balance BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    DECLARE bal DECIMAL(10,2);
    DECLARE card_exists INT;
    
    SELECT COUNT(*) INTO card_exists FROM Smartcard WHERE Passenger_ID = NEW.Passenger_ID;
    
    IF card_exists > 0 THEN
        SELECT Balance INTO bal FROM Smartcard WHERE Passenger_ID = NEW.Passenger_ID;
        IF bal < NEW.Fare THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Insufficient balance in smartcard for ticket purchase.';
        END IF;
    END IF;
END $$
DELIMITER ;

-- TRIGGER 2: Deduct Balance After Confirmed Booking
DELIMITER $$
CREATE TRIGGER update_smartcard_balance AFTER INSERT ON Ticket
FOR EACH ROW
BEGIN
    DECLARE card_exists INT;
    SELECT COUNT(*) INTO card_exists FROM Smartcard WHERE Passenger_ID = NEW.Passenger_ID;
    
    IF card_exists > 0 AND NEW.Status = 'Confirmed' THEN
        UPDATE Smartcard SET Balance = Balance - NEW.Fare 
        WHERE Passenger_ID = NEW.Passenger_ID;
    END IF;
END $$
DELIMITER ;

-- TRIGGER 3: Auto-Generate PNR Number
DELIMITER $$
CREATE TRIGGER generate_pnr BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    IF NEW.PNR_Number IS NULL OR NEW.PNR_Number = '' THEN
        SET NEW.PNR_Number = CONCAT('25', LPAD(FLOOR(RAND() * 10000000), 8, '0'));
    END IF;
END $$
DELIMITER ;

-- TRIGGER 4: Validate Journey Date
DELIMITER $$
CREATE TRIGGER validate_journey_date BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    IF NEW.Journey_Date < CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Journey date cannot be in the past.';
    END IF;
    
    IF NEW.Journey_Date > DATE_ADD(CURDATE(), INTERVAL 120 DAY) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Tickets can only be booked up to 120 days in advance.';
    END IF;
END $$
DELIMITER ;

-- TRIGGER 5: Check Train Capacity
DELIMITER $$
CREATE TRIGGER check_train_capacity BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    DECLARE total_capacity INT;
    DECLARE booked_seats INT;
    DECLARE train_id_val INT;
    
    -- Get train ID from Linked_To or use a default
    SELECT Train_ID INTO train_id_val FROM Train LIMIT 1;
    
    SELECT Capacity INTO total_capacity FROM Train WHERE Train_ID = train_id_val;
    
    SELECT COUNT(*) INTO booked_seats
    FROM Ticket T
    WHERE T.Journey_Date = NEW.Journey_Date
      AND T.Status IN ('Confirmed', 'RAC');
    
    IF booked_seats >= total_capacity AND NEW.Status = 'Confirmed' THEN
        SET NEW.Status = 'Waiting';
    END IF;
END $$
DELIMITER ;

-- TRIGGER 6: Prevent Station Deletion with Active Bookings
DELIMITER $$
CREATE TRIGGER prevent_station_deletion BEFORE DELETE ON Station
FOR EACH ROW
BEGIN
    DECLARE active_bookings INT;
    
    SELECT COUNT(*) INTO active_bookings
    FROM Ticket
    WHERE (Source_Station = OLD.Name OR Destination_Station = OLD.Name)
      AND Journey_Date >= CURDATE()
      AND Status IN ('Confirmed', 'RAC', 'Waiting');
    
    IF active_bookings > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot delete station with active bookings.';
    END IF;
END $$
DELIMITER ;

-- TRIGGER 7: Check Card Expiry
DELIMITER $$
CREATE TRIGGER check_card_expiry BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    DECLARE card_expiry DATE;
    DECLARE card_exists INT;
    
    SELECT COUNT(*) INTO card_exists FROM Smartcard WHERE Passenger_ID = NEW.Passenger_ID;
    
    IF card_exists > 0 THEN
        SELECT Expiry_Date INTO card_expiry FROM Smartcard WHERE Passenger_ID = NEW.Passenger_ID;
        
        IF card_expiry < CURDATE() THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Smartcard has expired. Please renew before booking.';
        END IF;
    END IF;
END $$
DELIMITER ;

-- TRIGGER 8: Log Ticket Cancellations
DELIMITER $$
CREATE TRIGGER log_ticket_cancellation AFTER UPDATE ON Ticket
FOR EACH ROW
BEGIN
    IF OLD.Status != NEW.Status AND NEW.Status = 'Cancelled' THEN
        INSERT INTO Ticket_Audit_Log (Ticket_ID, Action_Type, Old_Status, New_Status, Changed_By)
        VALUES (NEW.Ticket_ID, 'CANCEL', OLD.Status, NEW.Status, USER());
    END IF;
END $$
DELIMITER ;

-- TRIGGER 9: Validate Loco Pilot Age
DELIMITER $$
CREATE TRIGGER validate_loco_pilot_age BEFORE INSERT ON Loco_Pilot
FOR EACH ROW
BEGIN
    IF NEW.Age < 25 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Loco pilot must be at least 25 years old.';
    END IF;
    
    IF NEW.Age > 60 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Loco pilot cannot be older than 60 years.';
    END IF;
END $$
DELIMITER ;

-- TRIGGER 10: Update Train Schedule on Route Change
DELIMITER $$
CREATE TRIGGER update_train_schedule AFTER UPDATE ON Follows
FOR EACH ROW
BEGIN
    IF OLD.Route_ID != NEW.Route_ID THEN
        DELETE FROM Train_Schedule WHERE Train_ID = NEW.Train_ID;
    END IF;
END $$
DELIMITER ;

-- TRIGGER 11: Validate Passenger Age
DELIMITER $$
CREATE TRIGGER validate_passenger_age BEFORE INSERT ON Passenger
FOR EACH ROW
BEGIN
    IF NEW.Age IS NOT NULL THEN
        IF NEW.Age < 0 OR NEW.Age > 120 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Invalid passenger age. Age must be between 0 and 120.';
        END IF;
    END IF;
END $$
DELIMITER ;

-- TRIGGER 12: Apply Senior Citizen Discount (40% off for 60+ years)
DELIMITER $$
CREATE TRIGGER apply_senior_discount BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    DECLARE passenger_age INT;
    
    SELECT Age INTO passenger_age FROM Passenger WHERE Passenger_ID = NEW.Passenger_ID;
    
    IF passenger_age >= 60 THEN
        SET NEW.Fare = NEW.Fare * 0.60; -- 40% discount
    END IF;
END $$
DELIMITER ;

-- ============================================================================
-- 6. FUNCTIONS (4 Utility Functions)
-- ============================================================================

-- FUNCTION 1: Get Smartcard Balance
DELIMITER $$
CREATE FUNCTION GetSmartcardBalance(p_Passenger_ID INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE bal DECIMAL(10,2);
    SELECT Balance INTO bal FROM Smartcard WHERE Passenger_ID = p_Passenger_ID;
    RETURN IFNULL(bal, 0);
END $$
DELIMITER ;

-- FUNCTION 2: Check Sufficient Balance
DELIMITER $$
CREATE FUNCTION CheckSufficientBalance(p_Passenger_ID INT, p_Fare DECIMAL(10,2))
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE bal DECIMAL(10,2);
    DECLARE card_exists INT;
    
    SELECT COUNT(*) INTO card_exists FROM Smartcard WHERE Passenger_ID = p_Passenger_ID;
    
    IF card_exists = 0 THEN
        RETURN TRUE; -- No card, allow cash payment
    END IF;
    
    SELECT Balance INTO bal FROM Smartcard WHERE Passenger_ID = p_Passenger_ID;
    RETURN (bal >= p_Fare);
END $$
DELIMITER ;

-- FUNCTION 3: Calculate Fare Based on Distance and Class
DELIMITER $$
CREATE FUNCTION fn_calculate_fare(distance_km DECIMAL(10,2), travel_class VARCHAR(20))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE fare DECIMAL(10,2);
    DECLARE base_rate DECIMAL(10,2);
    
    CASE travel_class
        WHEN 'AC-1' THEN SET base_rate = 4.5;
        WHEN 'AC-2' THEN SET base_rate = 3.0;
        WHEN 'AC-3' THEN SET base_rate = 2.0;
        WHEN 'Sleeper' THEN SET base_rate = 1.0;
        WHEN 'General' THEN SET base_rate = 0.5;
        ELSE SET base_rate = 1.5;
    END CASE;
    
    SET fare = distance_km * base_rate;
    
    IF fare < 50 THEN
        SET fare = 50;
    END IF;
    
    RETURN fare;
END $$
DELIMITER ;

-- FUNCTION 4: Get Train Details by Number
DELIMITER $$
CREATE FUNCTION GetTrainByNumber(p_Train_Number VARCHAR(10))
RETURNS VARCHAR(200)
DETERMINISTIC
BEGIN
    DECLARE train_info VARCHAR(200);
    SELECT CONCAT(Train_Name, ' (', Train_Type, ')') INTO train_info 
    FROM Train WHERE Train_Number = p_Train_Number;
    RETURN IFNULL(train_info, 'Train not found');
END $$
DELIMITER ;

-- ============================================================================
-- 7. STORED PROCEDURES (7 Common Operations)
-- ============================================================================

-- PROCEDURE 1: Book Ticket with Balance Check
DELIMITER $$
CREATE PROCEDURE BookTicket(
    IN p_PNR_Number VARCHAR(10),
    IN p_Journey_Date DATE,
    IN p_Fare DECIMAL(10,2),
    IN p_Source VARCHAR(100),
    IN p_Destination VARCHAR(100),
    IN p_Class VARCHAR(20),
    IN p_Seat_Number VARCHAR(10),
    IN p_Coach_Number VARCHAR(10),
    IN p_Passenger_ID INT,
    IN p_Train_ID INT
)
BEGIN
    IF CheckSufficientBalance(p_Passenger_ID, p_Fare) THEN
        INSERT INTO Ticket(PNR_Number, Date_Time, Journey_Date, Fare, Source_Station, Destination_Station, Class, Seat_Number, Coach_Number, Status, Passenger_ID)
        VALUES(p_PNR_Number, NOW(), p_Journey_Date, p_Fare, p_Source, p_Destination, p_Class, p_Seat_Number, p_Coach_Number, 'Confirmed', p_Passenger_ID);
        
        -- Link ticket to train
        INSERT INTO Linked_To(Ticket_ID, Train_ID) VALUES(LAST_INSERT_ID(), p_Train_ID);
        
        SELECT 'Ticket booked successfully!' AS Message;
    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Insufficient balance in smartcard for ticket purchase.';
    END IF;
END $$
DELIMITER ;

-- PROCEDURE 2: Recharge Smartcard
DELIMITER $$
CREATE PROCEDURE RechargeSmartcard(
    IN p_Passenger_ID INT,
    IN p_Amount DECIMAL(10,2)
)
BEGIN
    DECLARE card_exists INT;
    SELECT COUNT(*) INTO card_exists FROM Smartcard WHERE Passenger_ID = p_Passenger_ID;
    
    IF card_exists > 0 THEN
        UPDATE Smartcard SET Balance = Balance + p_Amount 
        WHERE Passenger_ID = p_Passenger_ID;
        SELECT CONCAT('Card recharged successfully! New balance: ', 
                     GetSmartcardBalance(p_Passenger_ID)) AS Message;
    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Smartcard not found for this passenger.';
    END IF;
END $$
DELIMITER ;

-- PROCEDURE 3: Get Stations in Route
DELIMITER $$
CREATE PROCEDURE GetStationsInRoute(IN p_Route_ID INT)
BEGIN
    SELECT 
        C.Stop_Sequence,
        S.Station_Code,
        S.Name AS Station_Name,
        S.Location,
        C.Distance_From_Start AS 'Distance (KM)'
    FROM Consists_Of C
    JOIN Station S ON C.Station_ID = S.Station_ID
    WHERE C.Route_ID = p_Route_ID
    ORDER BY C.Stop_Sequence;
END $$
DELIMITER ;

-- PROCEDURE 4: Get Train Schedule
DELIMITER $$
CREATE PROCEDURE GetTrainSchedule(IN p_Train_ID INT)
BEGIN
    SELECT 
        TS.Stop_Number,
        S.Station_Code,
        S.Name AS Station_Name,
        TS.Arrival_Time,
        TS.Departure_Time,
        TS.Platform_Number,
        TS.Distance_From_Source AS 'Distance (KM)'
    FROM Train_Schedule TS
    JOIN Station S ON TS.Station_ID = S.Station_ID
    WHERE TS.Train_ID = p_Train_ID
    ORDER BY TS.Stop_Number;
END $$
DELIMITER ;

-- PROCEDURE 5: Cancel Ticket and Refund
DELIMITER $$
CREATE PROCEDURE CancelTicket(IN p_Ticket_ID INT)
BEGIN
    DECLARE refund_amount DECIMAL(10,2);
    DECLARE passenger_id INT;
    DECLARE ticket_status VARCHAR(20);
    
    SELECT Fare, Passenger_ID, Status INTO refund_amount, passenger_id, ticket_status
    FROM Ticket WHERE Ticket_ID = p_Ticket_ID;
    
    IF ticket_status = 'Cancelled' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Ticket is already cancelled.';
    ELSE
        SET refund_amount = refund_amount * 0.80; -- 80% refund
        
        UPDATE Ticket SET Status = 'Cancelled' WHERE Ticket_ID = p_Ticket_ID;
        
        UPDATE Smartcard SET Balance = Balance + refund_amount 
        WHERE Passenger_ID = passenger_id;
        
        SELECT CONCAT('Ticket cancelled successfully! Refund amount: ', refund_amount) AS Message;
    END IF;
END $$
DELIMITER ;

-- PROCEDURE 6: Search Trains Between Stations
DELIMITER $$
CREATE PROCEDURE SearchTrains(
    IN p_Source_Station VARCHAR(100),
    IN p_Destination_Station VARCHAR(100)
)
BEGIN
    SELECT DISTINCT
        T.Train_Number,
        T.Train_Name,
        T.Train_Type,
        R.Route_Name,
        R.Distance_KM
    FROM Train T
    JOIN Follows F ON T.Train_ID = F.Train_ID
    JOIN Route R ON F.Route_ID = R.Route_ID
    WHERE R.Start_Station = p_Source_Station 
       OR R.End_Station = p_Destination_Station;
END $$
DELIMITER ;

-- PROCEDURE 7: Get Passenger Booking History
DELIMITER $$
CREATE PROCEDURE GetPassengerBookings(IN p_Passenger_ID INT)
BEGIN
    SELECT 
        T.PNR_Number,
        T.Journey_Date,
        T.Fare,
        T.Class,
        T.Status,
        T.Source_Station,
        T.Destination_Station,
        TR.Train_Number,
        TR.Train_Name
    FROM Ticket T
    LEFT JOIN Linked_To LT ON T.Ticket_ID = LT.Ticket_ID
    LEFT JOIN Train TR ON LT.Train_ID = TR.Train_ID
    WHERE T.Passenger_ID = p_Passenger_ID
    ORDER BY T.Journey_Date DESC;
END $$
DELIMITER ;

-- ============================================================================
-- 8. VERIFICATION AND SAMPLE QUERIES
-- ============================================================================

-- Show all tables
SHOW TABLES;

-- Test Function 1: Get Balance
SELECT GetSmartcardBalance(1) AS Balance;

-- Test Function 3: Calculate Fare
SELECT fn_calculate_fare(30.0, 'General') AS Fare;

-- Test Function 4: Get Train Details
SELECT GetTrainByNumber('METRO01') AS Train_Details;

-- Test Procedure 2: Recharge Card
CALL RechargeSmartcard(1, 1000);

-- Test Procedure 3: Get Stations in Route
CALL GetStationsInRoute(4);

-- Test Procedure 4: Get Train Schedule
CALL GetTrainSchedule(1);

-- Test Procedure 7: Get Passenger Bookings
CALL GetPassengerBookings(1);

-- View All Data
SELECT * FROM Passenger;
SELECT * FROM Station;
SELECT * FROM Train;
SELECT * FROM Ticket;
SELECT * FROM Smartcard;

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

-- View All Confirmed Tickets
SELECT 
    T.PNR_Number,
    P.Name AS Passenger_Name,
    T.Journey_Date,
    T.Source_Station,
    T.Destination_Station,
    TR.Train_Name,
    T.Class,
    T.Fare,
    T.Status
FROM Ticket T
JOIN Passenger P ON T.Passenger_ID = P.Passenger_ID
LEFT JOIN Linked_To LT ON T.Ticket_ID = LT.Ticket_ID
LEFT JOIN Train TR ON LT.Train_ID = TR.Train_ID
WHERE T.Status = 'Confirmed'
ORDER BY T.Journey_Date;

-- View Train Routes
SELECT 
    T.Train_Number,
    T.Train_Name,
    R.Route_Name,
    R.Start_Station,
    R.End_Station,
    R.Distance_KM
FROM Train T
JOIN Follows F ON T.Train_ID = F.Train_ID
JOIN Route R ON F.Route_ID = R.Route_ID;

-- ============================================================================
-- 9. TRIGGER DEMONSTRATIONS (COMMENTED OUT - Run Selectively)
-- ============================================================================

-- ============================================================================
-- TRIGGER 1: check_smartcard_balance
-- Purpose: Prevents ticket booking if smartcard balance is insufficient
-- ============================================================================
-- SELECT '=== TRIGGER 1: Check Smartcard Balance ===' AS Demo;
-- 
-- -- Check current balance
-- SELECT P.Name, SC.Balance FROM Passenger P
-- JOIN Smartcard SC ON P.Passenger_ID = SC.Passenger_ID WHERE P.Passenger_ID = 1;
-- 
-- -- Try booking with insufficient balance (will FAIL)
-- -- INSERT INTO Ticket (PNR_Number, Date_Time, Journey_Date, Fare, Source_Station, Destination_Station, Class, Status, Passenger_ID)
-- -- VALUES ('TEST00001', NOW(), '2025-12-01', 99999.00, 'Majestic', 'Silkboard', 'General', 'Confirmed', 1);

-- ============================================================================
-- TRIGGER 2: update_smartcard_balance
-- Purpose: Auto-deducts fare from smartcard after confirmed booking
-- ============================================================================
-- SELECT '=== TRIGGER 2: Update Smartcard Balance ===' AS Demo;
-- 
-- -- Check balance before
-- SELECT GetSmartcardBalance(2) AS Balance_Before;
-- 
-- -- Book ticket
-- CALL BookTicket('DEMO00001', '2025-12-05', 300.00, 'Majestic', 'Whitefield', 'General', '10', 'G1', 2, 1);
-- 
-- -- Check balance after
-- SELECT GetSmartcardBalance(2) AS Balance_After;

-- ============================================================================
-- TRIGGER 4: validate_journey_date
-- Purpose: Ensures journey date is valid
-- ============================================================================
-- SELECT '=== TRIGGER 4: Validate Journey Date ===' AS Demo;
-- 
-- -- Try past date (will FAIL)
-- -- INSERT INTO Ticket (PNR_Number, Date_Time, Journey_Date, Fare, Source_Station, Destination_Station, Status, Passenger_ID)
-- -- VALUES ('PAST00001', NOW(), '2025-01-01', 500.00, 'Majestic', 'Silkboard', 'Confirmed', 3);

-- ============================================================================
-- TRIGGER 12: apply_senior_discount
-- Purpose: Auto-applies 40% discount for passengers 60+ years
-- ============================================================================
-- SELECT '=== TRIGGER 12: Senior Citizen Discount ===' AS Demo;
-- 
-- -- Book ticket for senior citizen (Passenger 5, Age 65)
-- INSERT INTO Ticket (PNR_Number, Date_Time, Journey_Date, Fare, Source_Station, Destination_Station, Class, Status, Passenger_ID)
-- VALUES ('SENIOR001', NOW(), '2025-12-20', 1000.00, 'Majestic', 'Whitefield', 'AC-3', 'Confirmed', 5);
-- 
-- -- Check discounted fare (should be 600.00)
-- SELECT PNR_Number, Fare AS 'Discounted_Fare' FROM Ticket WHERE PNR_Number = 'SENIOR001';

-- ============================================================================
-- END OF TRAIN RESERVATION SYSTEM
-- ============================================================================
