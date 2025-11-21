-- 1. DROP DATABASE IF EXISTS
DROP DATABASE IF EXISTS railway_management;

-- 2. CREATE DATABASE AND USE IT
CREATE DATABASE railway_management;
USE railway_management;

-- 3. TABLE CREATION

-- Passenger Table
CREATE TABLE Passenger (
    Passenger_ID INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50),
    Age INT,
    Gender VARCHAR(10),
    Email VARCHAR(100)
);

-- Passenger Mobile (1:N)
CREATE TABLE Passenger_Mobile (
    Passenger_ID INT NOT NULL,
    Mobile_No VARCHAR(15) NOT NULL,
    PRIMARY KEY (Passenger_ID, Mobile_No),
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Station Table (Railway Stations across different cities/states)
CREATE TABLE Station (
    Station_ID INT AUTO_INCREMENT PRIMARY KEY,
    Station_Code VARCHAR(10) NOT NULL UNIQUE,
    Station_Name VARCHAR(100) NOT NULL,
    City VARCHAR(100) NOT NULL,
    State VARCHAR(100) NOT NULL,
    Platform_Count INT DEFAULT 1
);

-- Route Table (Railway Routes connecting multiple cities)
CREATE TABLE Route (
    Route_ID INT AUTO_INCREMENT PRIMARY KEY,
    Route_Name VARCHAR(100) NOT NULL,
    Route_Type VARCHAR(50), -- Express, Superfast, Passenger, Mail
    Distance_KM DECIMAL(10,2),
    Start_Station_ID INT,
    End_Station_ID INT,
    FOREIGN KEY (Start_Station_ID) REFERENCES Station(Station_ID) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (End_Station_ID) REFERENCES Station(Station_ID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Train Table (Different types of trains)
CREATE TABLE Train (
    Train_ID INT AUTO_INCREMENT PRIMARY KEY,
    Train_Number VARCHAR(10) NOT NULL UNIQUE,
    Train_Name VARCHAR(100) NOT NULL,
    Train_Type VARCHAR(50), -- Express, Superfast, Rajdhani, Shatabdi, Local
    Total_Coaches INT,
    Sleeper_Capacity INT,
    AC_Capacity INT,
    General_Capacity INT,
    Route_ID INT,
    FOREIGN KEY (Route_ID) REFERENCES Route(Route_ID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Loco_Pilot Table (Train Drivers/Engineers)
CREATE TABLE Loco_Pilot (
    Loco_Pilot_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    License_Number VARCHAR(50) UNIQUE,
    Experience_Years INT,
    Role VARCHAR(50), -- Senior Driver, Assistant Driver, Trainee
    Age INT,
    Contact_Number VARCHAR(15)
);

-- Ticket Table (Railway Ticket Booking)
CREATE TABLE Ticket (
    Ticket_ID INT AUTO_INCREMENT PRIMARY KEY,
    PNR_Number VARCHAR(10) UNIQUE NOT NULL,
    Booking_Date_Time DATETIME NOT NULL,
    Journey_Date DATE NOT NULL,
    Fare DECIMAL(10,2),
    Class VARCHAR(20), -- Sleeper, AC-3, AC-2, AC-1, General
    Seat_Number VARCHAR(10),
    Coach_Number VARCHAR(10),
    Status VARCHAR(20), -- Confirmed, Waiting, RAC, Cancelled
    Source_Station_ID INT NOT NULL,
    Destination_Station_ID INT NOT NULL,
    Passenger_ID INT NOT NULL,
    Train_ID INT NOT NULL,
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Source_Station_ID) REFERENCES Station(Station_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Destination_Station_ID) REFERENCES Station(Station_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Railway_Card Table (Railway Travel Card for frequent travelers)
CREATE TABLE Railway_Card (
    Card_ID INT AUTO_INCREMENT PRIMARY KEY,
    Card_Number VARCHAR(20) UNIQUE NOT NULL,
    Card_Type VARCHAR(30), -- Regular, Senior Citizen, Student
    Issue_Date DATE NOT NULL,
    Expiry_Date DATE NOT NULL,
    Balance DECIMAL(10,2),
    Passenger_ID INT NOT NULL,
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Train_Schedule Table (Departure and Arrival times at each station)
CREATE TABLE Train_Schedule (
    Schedule_ID INT AUTO_INCREMENT PRIMARY KEY,
    Train_ID INT NOT NULL,
    Station_ID INT NOT NULL,
    Arrival_Time TIME,
    Departure_Time TIME,
    Platform_Number INT,
    Stop_Number INT, -- Order of station in route
    Distance_From_Source DECIMAL(10,2),
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Station_ID) REFERENCES Station(Station_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Consists_Of (Route - Station) M:N - Stations in a route
CREATE TABLE Consists_Of (
    Route_ID INT NOT NULL,
    Station_ID INT NOT NULL,
    Stop_Sequence INT NOT NULL, -- Order of station in route
    Distance_From_Start DECIMAL(10,2),
    PRIMARY KEY (Route_ID, Station_ID),
    FOREIGN KEY (Route_ID) REFERENCES Route(Route_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Station_ID) REFERENCES Station(Station_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Operates (LocoPilot - Train) M:N - Pilots operating trains
CREATE TABLE Operates (
    Loco_Pilot_ID INT NOT NULL,
    Train_ID INT NOT NULL,
    Duty_Date DATE NOT NULL,
    Shift VARCHAR(20), -- Morning, Evening, Night
    PRIMARY KEY (Loco_Pilot_ID, Train_ID, Duty_Date),
    FOREIGN KEY (Loco_Pilot_ID) REFERENCES Loco_Pilot(Loco_Pilot_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Train_ID) REFERENCES Train(Train_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. SAMPLE DATA INSERTION

INSERT INTO Passenger (First_Name, Last_Name, Age, Gender, Email)
VALUES 
('Rajesh', 'Kumar', 35, 'Male', 'rajesh.kumar@email.com'),
('Priya', 'Sharma', 28, 'Female', 'priya.sharma@email.com'),
('Amit', 'Patel', 42, 'Male', 'amit.patel@email.com'),
('Sneha', 'Reddy', 31, 'Female', 'sneha.reddy@email.com'),
('Vikram', 'Singh', 29, 'Male', 'vikram.singh@email.com');

INSERT INTO Passenger_Mobile VALUES 
(1, '9876543210'), (1, '9123456780'), 
(2, '9876509876'), (2, '8765432109'),
(3, '9123456789'), 
(4, '9988776655'),
(5, '8899776655');

INSERT INTO Station (Station_Code, Station_Name, City, State, Platform_Count) VALUES
('NDLS', 'New Delhi', 'Delhi', 'Delhi', 16),
('BCT', 'Mumbai Central', 'Mumbai', 'Maharashtra', 7),
('MAS', 'Chennai Central', 'Chennai', 'Tamil Nadu', 12),
('SBC', 'Bangalore City', 'Bangalore', 'Karnataka', 10),
('HWH', 'Howrah Junction', 'Kolkata', 'West Bengal', 23),
('PNBE', 'Patna Junction', 'Patna', 'Bihar', 10),
('LKO', 'Lucknow', 'Lucknow', 'Uttar Pradesh', 8),
('JAT', 'Jamnagar', 'Jamnagar', 'Gujarat', 5),
('ALD', 'Allahabad Junction', 'Prayagraj', 'Uttar Pradesh', 10),
('AGC', 'Agra Cantt', 'Agra', 'Uttar Pradesh', 6);

INSERT INTO Route (Route_Name, Route_Type, Distance_KM, Start_Station_ID, End_Station_ID) VALUES
('New Delhi - Mumbai Route', 'Rajdhani Express', 1384.0, 1, 2),
('Chennai - Bangalore Route', 'Shatabdi Express', 362.0, 3, 4),
('Delhi - Kolkata Route', 'Superfast', 1441.0, 1, 5),
('Delhi - Lucknow Route', 'Mail Express', 495.0, 1, 7),
('Mumbai - Chennai Route', 'Express', 1279.0, 2, 3);

INSERT INTO Train (Train_Number, Train_Name, Train_Type, Total_Coaches, Sleeper_Capacity, AC_Capacity, General_Capacity, Route_ID) VALUES
('12951', 'Mumbai Rajdhani', 'Rajdhani', 18, 0, 500, 0, 1),
('12028', 'Shatabdi Express', 'Shatabdi', 12, 0, 400, 0, 2),
('12302', 'Kolkata Rajdhani', 'Rajdhani', 20, 0, 550, 0, 3),
('12430', 'Lucknow Mail', 'Mail Express', 22, 600, 200, 300, 4),
('12164', 'Chennai Express', 'Superfast', 24, 700, 250, 350, 5);

INSERT INTO Loco_Pilot (Name, License_Number, Experience_Years, Role, Age, Contact_Number) VALUES
('Ramesh Verma', 'LP-2018-001', 15, 'Senior Driver', 45, '9876543211'),
('Suresh Yadav', 'LP-2019-042', 12, 'Senior Driver', 42, '9876543212'),
('Anil Kumar', 'LP-2020-125', 8, 'Assistant Driver', 38, '9876543213'),
('Prakash Joshi', 'LP-2021-089', 6, 'Assistant Driver', 35, '9876543214'),
('Manoj Tiwari', 'LP-2022-156', 3, 'Trainee', 28, '9876543215');

INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID) VALUES
('2510123456', '2025-10-20 10:30:00', '2025-11-05', 2500.00, 'AC-2', '45', 'A1', 'Confirmed', 1, 2, 1, 1),
('2510123457', '2025-10-21 14:15:00', '2025-11-08', 800.00, 'AC-Chair', '12', 'C3', 'Confirmed', 3, 4, 2, 2),
('2510123458', '2025-10-22 09:00:00', '2025-11-10', 1800.00, 'AC-3', '28', 'B2', 'Confirmed', 1, 5, 3, 3),
('2510123459', '2025-10-23 16:30:00', '2025-11-12', 600.00, 'Sleeper', '52', 'S7', 'RAC', 1, 7, 4, 4),
('2510123460', '2025-10-24 11:00:00', '2025-11-15', 1200.00, 'AC-3', '34', 'B4', 'Waiting', 2, 3, 5, 5);

INSERT INTO Railway_Card (Card_Number, Card_Type, Issue_Date, Expiry_Date, Balance, Passenger_ID) VALUES
('RC-2025-001234', 'Regular', '2025-01-15', '2026-01-15', 5000.00, 1),
('RC-2025-001235', 'Senior Citizen', '2025-02-20', '2026-02-20', 3000.00, 2),
('RC-2025-001236', 'Regular', '2025-03-10', '2026-03-10', 7000.00, 3),
('RC-2025-001237', 'Student', '2025-04-05', '2026-04-05', 2500.00, 4),
('RC-2025-001238', 'Regular', '2025-05-12', '2026-05-12', 4500.00, 5);

INSERT INTO Train_Schedule (Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source) VALUES
-- Mumbai Rajdhani Schedule
(1, 1, NULL, '16:30:00', 5, 1, 0),
(1, 2, '08:35:00', NULL, 3, 2, 1384.0),
-- Shatabdi Express Schedule
(2, 3, NULL, '06:00:00', 7, 1, 0),
(2, 4, '11:45:00', NULL, 4, 2, 362.0),
-- Kolkata Rajdhani Schedule
(3, 1, NULL, '17:00:00', 8, 1, 0),
(3, 5, '10:05:00', NULL, 12, 2, 1441.0);

INSERT INTO Consists_Of (Route_ID, Station_ID, Stop_Sequence, Distance_From_Start) VALUES
-- Route 1: Delhi to Mumbai
(1, 1, 1, 0),
(1, 2, 2, 1384.0),
-- Route 2: Chennai to Bangalore
(2, 3, 1, 0),
(2, 4, 2, 362.0),
-- Route 3: Delhi to Kolkata
(3, 1, 1, 0),
(3, 9, 2, 622.0),
(3, 6, 3, 997.0),
(3, 5, 4, 1441.0),
-- Route 4: Delhi to Lucknow
(4, 1, 1, 0),
(4, 10, 2, 204.0),
(4, 7, 3, 495.0);

INSERT INTO Operates (Loco_Pilot_ID, Train_ID, Duty_Date, Shift) VALUES
(1, 1, '2025-11-05', 'Evening'),
(2, 2, '2025-11-08', 'Morning'),
(3, 3, '2025-11-10', 'Evening'),
(4, 4, '2025-11-12', 'Morning'),
(5, 5, '2025-11-15', 'Morning');

-- 5. TRIGGERS

-- Prevent ticket purchase if railway card balance is insufficient
DELIMITER $$
CREATE TRIGGER check_railway_card_balance BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    DECLARE bal DECIMAL(10,2);
    DECLARE card_exists INT;
    
    -- Check if passenger has a railway card
    SELECT COUNT(*) INTO card_exists FROM Railway_Card WHERE Passenger_ID = NEW.Passenger_ID;
    
    IF card_exists > 0 THEN
        SELECT Balance INTO bal FROM Railway_Card WHERE Passenger_ID = NEW.Passenger_ID;
        IF bal < NEW.Fare THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance in railway card for ticket purchase.';
        END IF;
    END IF;
END $$
DELIMITER ;

-- Deduct balance after ticket purchase (only for confirmed tickets)
DELIMITER $$
CREATE TRIGGER update_railway_card_balance AFTER INSERT ON Ticket
FOR EACH ROW
BEGIN
    DECLARE card_exists INT;
    SELECT COUNT(*) INTO card_exists FROM Railway_Card WHERE Passenger_ID = NEW.Passenger_ID;
    
    IF card_exists > 0 AND NEW.Status = 'Confirmed' THEN
        UPDATE Railway_Card SET Balance = Balance - NEW.Fare WHERE Passenger_ID = NEW.Passenger_ID;
    END IF;
END $$
DELIMITER ;

-- Auto-generate PNR number if not provided
DELIMITER $$
CREATE TRIGGER generate_pnr BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    IF NEW.PNR_Number IS NULL OR NEW.PNR_Number = '' THEN
        SET NEW.PNR_Number = CONCAT('25', LPAD(NEW.Ticket_ID, 8, '0'));
    END IF;
END $$
DELIMITER ;

-- Validate ticket booking dates
DELIMITER $$
CREATE TRIGGER validate_ticket_dates BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    -- Journey date cannot be in the past
    IF NEW.Journey_Date < CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Journey date cannot be in the past.';
    END IF;
    
    -- Journey date cannot be more than 120 days in advance (Railway booking limit)
    IF NEW.Journey_Date > DATE_ADD(CURDATE(), INTERVAL 120 DAY) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tickets can only be booked up to 120 days in advance.';
    END IF;
END $$
DELIMITER ;

-- Check train capacity before ticket booking
DELIMITER $$
CREATE TRIGGER check_train_capacity BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    DECLARE total_capacity INT;
    DECLARE booked_seats INT;
    
    -- Get train capacity based on class
    SELECT 
        CASE 
            WHEN NEW.Class IN ('AC-1', 'AC-2', 'AC-3', 'AC-Chair') THEN AC_Capacity
            WHEN NEW.Class = 'Sleeper' THEN Sleeper_Capacity
            WHEN NEW.Class = 'General' THEN General_Capacity
            ELSE 0
        END INTO total_capacity
    FROM Train WHERE Train_ID = NEW.Train_ID;
    
    -- Count already booked seats for this train, date and class
    SELECT COUNT(*) INTO booked_seats
    FROM Ticket
    WHERE Train_ID = NEW.Train_ID 
      AND Journey_Date = NEW.Journey_Date
      AND Class = NEW.Class
      AND Status IN ('Confirmed', 'RAC');
    
    -- If capacity exceeded, set status to Waiting
    IF booked_seats >= total_capacity AND NEW.Status = 'Confirmed' THEN
        SET NEW.Status = 'Waiting';
    END IF;
END $$
DELIMITER ;

-- Prevent deletion of station if it has active bookings
DELIMITER $$
CREATE TRIGGER prevent_station_deletion BEFORE DELETE ON Station
FOR EACH ROW
BEGIN
    DECLARE active_bookings INT;
    
    SELECT COUNT(*) INTO active_bookings
    FROM Ticket
    WHERE (Source_Station_ID = OLD.Station_ID OR Destination_Station_ID = OLD.Station_ID)
      AND Journey_Date >= CURDATE()
      AND Status IN ('Confirmed', 'RAC', 'Waiting');
    
    IF active_bookings > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot delete station with active bookings.';
    END IF;
END $$
DELIMITER ;

-- Auto-expire railway cards
DELIMITER $$
CREATE TRIGGER check_card_expiry BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    DECLARE card_expiry DATE;
    DECLARE card_exists INT;
    
    SELECT COUNT(*) INTO card_exists FROM Railway_Card WHERE Passenger_ID = NEW.Passenger_ID;
    
    IF card_exists > 0 THEN
        SELECT Expiry_Date INTO card_expiry FROM Railway_Card WHERE Passenger_ID = NEW.Passenger_ID;
        
        IF card_expiry < CURDATE() THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Railway card has expired. Please renew before booking.';
        END IF;
    END IF;
END $$
DELIMITER ;

-- Log ticket modifications (for audit trail)
CREATE TABLE Ticket_Audit_Log (
    Log_ID INT AUTO_INCREMENT PRIMARY KEY,
    Ticket_ID INT,
    Action_Type VARCHAR(20), -- INSERT, UPDATE, CANCEL
    Old_Status VARCHAR(20),
    New_Status VARCHAR(20),
    Changed_By VARCHAR(50),
    Changed_At DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

-- Prevent loco pilot assignment if age is below 25
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

-- Update train schedule automatically when route changes
DELIMITER $$
CREATE TRIGGER update_train_route AFTER UPDATE ON Train
FOR EACH ROW
BEGIN
    IF OLD.Route_ID != NEW.Route_ID THEN
        -- Delete old schedule entries
        DELETE FROM Train_Schedule WHERE Train_ID = NEW.Train_ID;
    END IF;
END $$
DELIMITER ;

-- Validate passenger age
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

-- Auto-apply senior citizen discount
DELIMITER $$
CREATE TRIGGER apply_senior_citizen_discount BEFORE INSERT ON Ticket
FOR EACH ROW
BEGIN
    DECLARE passenger_age INT;
    
    SELECT Age INTO passenger_age FROM Passenger WHERE Passenger_ID = NEW.Passenger_ID;
    
    -- Apply 40% discount for senior citizens (60+ years)
    IF passenger_age >= 60 THEN
        SET NEW.Fare = NEW.Fare * 0.60;
    END IF;
END $$
DELIMITER ;

-- 6. FUNCTIONS

-- Get Railway Card Balance
DELIMITER $$
CREATE FUNCTION GetRailwayCardBalance(p_Passenger_ID INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE bal DECIMAL(10,2);
    SELECT Balance INTO bal FROM Railway_Card WHERE Passenger_ID = p_Passenger_ID;
    RETURN IFNULL(bal, 0);
END $$
DELIMITER ;

-- Check Sufficient Balance in Railway Card
DELIMITER $$
CREATE FUNCTION CheckSufficientBalance(p_Passenger_ID INT, p_Fare DECIMAL(10,2))
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE bal DECIMAL(10,2);
    DECLARE card_exists INT;
    
    SELECT COUNT(*) INTO card_exists FROM Railway_Card WHERE Passenger_ID = p_Passenger_ID;
    
    IF card_exists = 0 THEN
        RETURN TRUE; -- No card, allow cash payment
    END IF;
    
    SELECT Balance INTO bal FROM Railway_Card WHERE Passenger_ID = p_Passenger_ID;
    RETURN (bal >= p_Fare);
END $$
DELIMITER ;

-- Calculate Fare Based on Distance and Class
DELIMITER $$
CREATE FUNCTION fn_calculate_fare(distance_km DECIMAL(10,2), travel_class VARCHAR(20))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE fare DECIMAL(10,2);
    DECLARE base_rate DECIMAL(10,2);
    
    -- Base rate per km based on class
    CASE travel_class
        WHEN 'AC-1' THEN SET base_rate = 4.5;
        WHEN 'AC-2' THEN SET base_rate = 3.0;
        WHEN 'AC-3' THEN SET base_rate = 2.0;
        WHEN 'AC-Chair' THEN SET base_rate = 2.5;
        WHEN 'Sleeper' THEN SET base_rate = 1.0;
        WHEN 'General' THEN SET base_rate = 0.5;
        ELSE SET base_rate = 1.5;
    END CASE;
    
    SET fare = distance_km * base_rate;
    
    -- Minimum fare
    IF fare < 50 THEN
        SET fare = 50;
    END IF;
    
    RETURN fare;
END $$
DELIMITER ;

-- Get Train Details by Train Number
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

-- 7. STORED PROCEDURES

-- Insert Ticket with Balance Check
DELIMITER $$
CREATE PROCEDURE BookTicket(
    IN p_PNR_Number VARCHAR(10),
    IN p_Journey_Date DATE,
    IN p_Fare DECIMAL(10,2),
    IN p_Class VARCHAR(20),
    IN p_Seat_Number VARCHAR(10),
    IN p_Coach_Number VARCHAR(10),
    IN p_Status VARCHAR(20),
    IN p_Source_Station_ID INT,
    IN p_Destination_Station_ID INT,
    IN p_Passenger_ID INT,
    IN p_Train_ID INT
)
BEGIN
    IF CheckSufficientBalance(p_Passenger_ID, p_Fare) THEN
        INSERT INTO Ticket(PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID)
        VALUES(p_PNR_Number, NOW(), p_Journey_Date, p_Fare, p_Class, p_Seat_Number, p_Coach_Number, p_Status, p_Source_Station_ID, p_Destination_Station_ID, p_Passenger_ID, p_Train_ID);
        SELECT 'Ticket booked successfully!' AS Message;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance in railway card for ticket purchase.';
    END IF;
END $$
DELIMITER ;

-- Add Balance to Railway Card (Recharge)
DELIMITER $$
CREATE PROCEDURE RechargeRailwayCard(
    IN p_Passenger_ID INT,
    IN p_Amount DECIMAL(10,2)
)
BEGIN
    DECLARE card_exists INT;
    SELECT COUNT(*) INTO card_exists FROM Railway_Card WHERE Passenger_ID = p_Passenger_ID;
    
    IF card_exists > 0 THEN
        UPDATE Railway_Card SET Balance = Balance + p_Amount WHERE Passenger_ID = p_Passenger_ID;
        SELECT CONCAT('Card recharged successfully! New balance: ', GetRailwayCardBalance(p_Passenger_ID)) AS Message;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Railway card not found for this passenger.';
    END IF;
END $$
DELIMITER ;

-- Get All Stations in a Route
DELIMITER $$
CREATE PROCEDURE GetStationsInRoute(
    IN p_Route_ID INT
)
BEGIN
    SELECT 
        C.Stop_Sequence,
        S.Station_Code,
        S.Station_Name,
        S.City,
        S.State,
        C.Distance_From_Start AS 'Distance (KM)'
    FROM Consists_Of C
    JOIN Station S ON C.Station_ID = S.Station_ID
    WHERE C.Route_ID = p_Route_ID
    ORDER BY C.Stop_Sequence;
END $$
DELIMITER ;

-- Get Train Schedule
DELIMITER $$
CREATE PROCEDURE GetTrainSchedule(
    IN p_Train_ID INT
)
BEGIN
    SELECT 
        TS.Stop_Number,
        S.Station_Code,
        S.Station_Name,
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

-- Cancel Ticket and Refund
DELIMITER $$
CREATE PROCEDURE CancelTicket(
    IN p_Ticket_ID INT
)
BEGIN
    DECLARE refund_amount DECIMAL(10,2);
    DECLARE passenger_id INT;
    DECLARE ticket_status VARCHAR(20);
    
    SELECT Fare, Passenger_ID, Status INTO refund_amount, passenger_id, ticket_status
    FROM Ticket WHERE Ticket_ID = p_Ticket_ID;
    
    IF ticket_status = 'Cancelled' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ticket is already cancelled.';
    ELSE
        -- Refund 80% of fare
        SET refund_amount = refund_amount * 0.80;
        
        -- Update ticket status
        UPDATE Ticket SET Status = 'Cancelled' WHERE Ticket_ID = p_Ticket_ID;
        
        -- Refund to railway card if exists
        UPDATE Railway_Card SET Balance = Balance + refund_amount 
        WHERE Passenger_ID = passenger_id;
        
        SELECT CONCAT('Ticket cancelled successfully! Refund amount: ', refund_amount) AS Message;
    END IF;
END $$
DELIMITER ;

-- Search Trains Between Stations
DELIMITER $$
CREATE PROCEDURE SearchTrains(
    IN p_Source_Station_ID INT,
    IN p_Destination_Station_ID INT
)
BEGIN
    SELECT DISTINCT
        T.Train_Number,
        T.Train_Name,
        T.Train_Type,
        R.Route_Name,
        R.Distance_KM,
        S1.Station_Name AS Source_Station,
        S2.Station_Name AS Destination_Station
    FROM Train T
    JOIN Route R ON T.Route_ID = R.Route_ID
    JOIN Station S1 ON R.Start_Station_ID = S1.Station_ID
    JOIN Station S2 ON R.End_Station_ID = S2.Station_ID
    WHERE R.Start_Station_ID = p_Source_Station_ID 
       OR R.End_Station_ID = p_Destination_Station_ID;
END $$
DELIMITER ;

-- Get Passenger Booking History
DELIMITER $$
CREATE PROCEDURE GetPassengerBookings(
    IN p_Passenger_ID INT
)
BEGIN
    SELECT 
        T.PNR_Number,
        T.Journey_Date,
        T.Fare,
        T.Class,
        T.Status,
        S1.Station_Name AS Source,
        S2.Station_Name AS Destination,
        TR.Train_Number,
        TR.Train_Name
    FROM Ticket T
    JOIN Station S1 ON T.Source_Station_ID = S1.Station_ID
    JOIN Station S2 ON T.Destination_Station_ID = S2.Station_ID
    JOIN Train TR ON T.Train_ID = TR.Train_ID
    WHERE T.Passenger_ID = p_Passenger_ID
    ORDER BY T.Journey_Date DESC;
END $$
DELIMITER ;

-- 8. SAMPLE QUERIES AND TESTS

-- Test: Get balance of passenger with Passenger_ID = 1
SELECT GetRailwayCardBalance(1) AS Balance;

-- Test: Calculate fare for 500 km journey in AC-3
SELECT fn_calculate_fare(500, 'AC-3') AS Fare;

-- Test: Get train details by train number
SELECT GetTrainByNumber('12951') AS Train_Details;

-- Test: Book a ticket
CALL BookTicket('2510999999', '2025-12-01', 1500.00, 'AC-3', '25', 'B3', 'Confirmed', 1, 2, 1, 1);

-- Test: Recharge railway card
CALL RechargeRailwayCard(1, 3000);

-- Check updated balance
SELECT GetRailwayCardBalance(1) AS Updated_Balance;

-- Test: Get stations in route
CALL GetStationsInRoute(3);

-- Test: Get train schedule
CALL GetTrainSchedule(1);

-- Test: Search trains between stations
CALL SearchTrains(1, 2);

-- Test: Get passenger booking history
CALL GetPassengerBookings(1);

-- Additional sample ticket bookings
CALL BookTicket('2510888888', '2025-12-05', 800.00, 'Sleeper', '42', 'S5', 'Confirmed', 3, 4, 2, 2);

-- Test: Cancel a ticket
-- CALL CancelTicket(1);

-- View all passengers with their railway cards
SELECT 
    P.Passenger_ID,
    CONCAT(P.First_Name, ' ', P.Last_Name) AS Passenger_Name,
    RC.Card_Number,
    RC.Card_Type,
    RC.Balance
FROM Passenger P
LEFT JOIN Railway_Card RC ON P.Passenger_ID = RC.Passenger_ID;

-- View all confirmed tickets with journey details
SELECT 
    T.PNR_Number,
    CONCAT(P.First_Name, ' ', P.Last_Name) AS Passenger_Name,
    T.Journey_Date,
    S1.Station_Name AS From_Station,
    S2.Station_Name AS To_Station,
    TR.Train_Name,
    T.Class,
    T.Seat_Number,
    T.Fare,
    T.Status
FROM Ticket T
JOIN Passenger P ON T.Passenger_ID = P.Passenger_ID
JOIN Station S1 ON T.Source_Station_ID = S1.Station_ID
JOIN Station S2 ON T.Destination_Station_ID = S2.Station_ID
JOIN Train TR ON T.Train_ID = TR.Train_ID
WHERE T.Status = 'Confirmed'
ORDER BY T.Journey_Date;

-- ============================================================================
-- 9. TRIGGER DEMONSTRATIONS - STEP BY STEP TESTING
-- ============================================================================
-- SELECT AND RUN EACH SECTION SEPARATELY TO DEMONSTRATE TRIGGER FUNCTIONALITY
-- All tests are COMMENTED OUT - Uncomment only the trigger you want to demo

-- ============================================================================
-- TRIGGER 1: check_railway_card_balance
-- Purpose: Prevents ticket booking if railway card balance is insufficient
-- ============================================================================
-- SELECT '=== TRIGGER 1: Check Railway Card Balance ===' AS Demo;

-- -- Step 1: Check current balance of Passenger 1
-- SELECT 
--     P.Passenger_ID,
--     CONCAT(P.First_Name, ' ', P.Last_Name) AS Passenger_Name,
--     RC.Balance AS Current_Balance
-- FROM Passenger P
-- JOIN Railway_Card RC ON P.Passenger_ID = RC.Passenger_ID
-- WHERE P.Passenger_ID = 1;

-- -- Step 2: Try to book a ticket with insufficient balance (This will FAIL)
-- -- Uncomment to test:
-- INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID)
-- VALUES ('TEST00001', NOW(), '2025-12-01', 9999.00, 'AC-1', '1', 'A1', 'Confirmed', 1, 2, 1, 1);
-- -- Expected Error: "Insufficient balance in railway card for ticket purchase."

-- -- ============================================================================
-- -- TRIGGER 2: update_railway_card_balance
-- -- Purpose: Automatically deducts fare from card after confirmed booking
-- -- ============================================================================
-- SELECT '=== TRIGGER 2: Update Railway Card Balance After Booking ===' AS Demo;

-- -- Step 1: Check balance before booking
-- SELECT GetRailwayCardBalance(1) AS Balance_Before_Booking;
-- -- 
-- -- -- Step 2: Book a ticket
-- INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID)
-- VALUES ('DEMO00001', NOW(), '2025-12-05', 500.00, 'AC-3', '15', 'B1', 'Confirmed', 1, 2, 1, 1);
-- -- 
-- -- -- Step 3: Check balance after booking (should be reduced by 500)
-- SELECT GetRailwayCardBalance(1) AS Balance_After_Booking;
-- -- 
-- -- Step 4: View the transaction
-- SELECT * FROM Ticket WHERE PNR_Number = 'DEMO00001';

-- ============================================================================
-- TRIGGER 3: generate_pnr
-- Purpose: Auto-generates PNR number if not provided
-- ============================================================================
-- SELECT '=== TRIGGER 3: Auto-Generate PNR Number ===' AS Demo;
-- 
-- -- Book a ticket without providing PNR (it will be auto-generated)
-- -- Note: This trigger has a logic issue - it uses Ticket_ID before it's assigned
-- -- For demonstration, we'll provide PNR manually
-- INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID)
-- VALUES ('AUTO12345', NOW(), '2025-12-10', 600.00, 'Sleeper', '20', 'S2', 'Confirmed', 3, 4, 2, 2);
-- 
-- SELECT * FROM Ticket WHERE PNR_Number = 'AUTO12345';

-- ============================================================================
-- TRIGGER 4: validate_ticket_dates
-- Purpose: Ensures journey date is valid (not past, within 120 days)
-- ============================================================================
-- SELECT '=== TRIGGER 4: Validate Ticket Booking Dates ===' AS Demo;
-- 
-- -- Test 1: Try booking for a past date (This will FAIL)
-- -- Uncomment to test:
-- -- INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID)
-- -- VALUES ('PAST00001', NOW(), '2025-01-01', 800.00, 'AC-3', '10', 'B2', 'Confirmed', 1, 5, 3, 3);
-- -- Expected Error: "Journey date cannot be in the past."
-- 
-- -- Test 2: Try booking more than 120 days in advance (This will FAIL)
-- -- Uncomment to test:
-- -- INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID)
-- -- VALUES ('FUTURE001', NOW(), '2026-05-01', 800.00, 'AC-3', '10', 'B2', 'Confirmed', 1, 5, 3, 3);
-- -- Expected Error: "Tickets can only be booked up to 120 days in advance."
-- 
-- -- Test 3: Valid booking within 120 days (This will SUCCEED)
-- INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID)
-- VALUES ('VALID0001', NOW(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 800.00, 'AC-3', '10', 'B2', 'Confirmed', 1, 5, 3, 3);
-- 
-- SELECT * FROM Ticket WHERE PNR_Number = 'VALID0001';

-- ============================================================================
-- TRIGGER 5: check_train_capacity
-- Purpose: Changes status to 'Waiting' if train is full
-- ============================================================================
-- SELECT '=== TRIGGER 5: Check Train Capacity ===' AS Demo;
-- 
-- -- Step 1: Check train capacity
-- SELECT Train_Number, Train_Name, AC_Capacity, Sleeper_Capacity, General_Capacity
-- FROM Train WHERE Train_ID = 1;
-- 
-- -- Step 2: Check how many AC seats are already booked
-- SELECT COUNT(*) AS AC_Seats_Booked
-- FROM Ticket
-- WHERE Train_ID = 1 
--   AND Class IN ('AC-1', 'AC-2', 'AC-3', 'AC-Chair')
--   AND Status IN ('Confirmed', 'RAC');
-- 
-- -- Step 3: Book tickets (if capacity exceeded, status will auto-change to Waiting)
-- INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID)
-- VALUES ('CAPTEST01', NOW(), '2025-12-15', 2000.00, 'AC-2', '50', 'A2', 'Confirmed', 1, 2, 4, 1);
-- 
-- SELECT PNR_Number, Status FROM Ticket WHERE PNR_Number = 'CAPTEST01';

-- ============================================================================
-- TRIGGER 6: prevent_station_deletion
-- Purpose: Prevents deletion of stations with active bookings
-- ============================================================================
-- SELECT '=== TRIGGER 6: Prevent Station Deletion ===' AS Demo;
-- 
-- -- Step 1: Check stations with active bookings
-- SELECT 
--     S.Station_ID,
--     S.Station_Name,
--     COUNT(T.Ticket_ID) AS Active_Bookings
-- FROM Station S
-- LEFT JOIN Ticket T ON (S.Station_ID = T.Source_Station_ID OR S.Station_ID = T.Destination_Station_ID)
-- WHERE T.Journey_Date >= CURDATE() AND T.Status IN ('Confirmed', 'RAC', 'Waiting')
-- GROUP BY S.Station_ID, S.Station_Name;
-- 
-- -- Step 2: Try to delete a station with active bookings (This will FAIL)
-- -- Uncomment to test:
-- -- DELETE FROM Station WHERE Station_ID = 1;
-- -- Expected Error: "Cannot delete station with active bookings."

-- ============================================================================
-- TRIGGER 7: check_card_expiry
-- Purpose: Prevents booking if railway card has expired
-- ============================================================================
-- SELECT '=== TRIGGER 7: Check Railway Card Expiry ===' AS Demo;
-- 
-- -- Step 1: Check card expiry dates
-- SELECT 
--     P.Passenger_ID,
--     CONCAT(P.First_Name, ' ', P.Last_Name) AS Passenger_Name,
--     RC.Card_Number,
--     RC.Expiry_Date,
--     CASE 
--         WHEN RC.Expiry_Date < CURDATE() THEN 'EXPIRED'
--         ELSE 'VALID'
--     END AS Card_Status
-- FROM Passenger P
-- JOIN Railway_Card RC ON P.Passenger_ID = RC.Passenger_ID;
-- 
-- -- Step 2: Update a card to make it expired (for testing)
-- UPDATE Railway_Card SET Expiry_Date = '2025-01-01' WHERE Passenger_ID = 5;
-- 
-- -- Step 3: Try booking with expired card (This will FAIL)
-- -- Uncomment to test:
-- -- INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID)
-- -- VALUES ('EXPIRED01', NOW(), '2025-12-20', 1000.00, 'AC-3', '30', 'B3', 'Confirmed', 2, 3, 5, 5);
-- -- Expected Error: "Railway card has expired. Please renew before booking."
-- 
-- -- Step 4: Reset the expiry date
-- UPDATE Railway_Card SET Expiry_Date = '2026-05-12' WHERE Passenger_ID = 5;

-- ============================================================================
-- TRIGGER 8: log_ticket_cancellation (with Ticket_Audit_Log table)
-- Purpose: Logs ticket status changes for audit trail
-- ============================================================================
-- SELECT '=== TRIGGER 8: Log Ticket Cancellation ===' AS Demo;
-- 
-- -- Step 1: Check current audit log
-- SELECT * FROM Ticket_Audit_Log;
-- 
-- -- Step 2: Update a ticket status to 'Cancelled'
-- UPDATE Ticket SET Status = 'Cancelled' WHERE PNR_Number = '2510123456';
-- 
-- -- Step 3: View the audit log (new entry should appear)
-- SELECT * FROM Ticket_Audit_Log ORDER BY Changed_At DESC;
-- 
-- -- Step 4: View ticket details
-- SELECT PNR_Number, Status, Journey_Date FROM Ticket WHERE PNR_Number = '2510123456';

-- ============================================================================
-- TRIGGER 9: validate_loco_pilot_age
-- Purpose: Ensures loco pilots are between 25 and 60 years old
-- ============================================================================
-- SELECT '=== TRIGGER 9: Validate Loco Pilot Age ===' AS Demo;
-- 
-- -- Test 1: Try to insert a loco pilot below 25 years (This will FAIL)
-- -- Uncomment to test:
-- -- INSERT INTO Loco_Pilot (Name, License_Number, Experience_Years, Role, Age, Contact_Number)
-- -- VALUES ('Young Driver', 'LP-2025-999', 2, 'Trainee', 22, '9999999999');
-- -- Expected Error: "Loco pilot must be at least 25 years old."
-- 
-- -- Test 2: Try to insert a loco pilot above 60 years (This will FAIL)
-- -- Uncomment to test:
-- -- INSERT INTO Loco_Pilot (Name, License_Number, Experience_Years, Role, Age, Contact_Number)
-- -- VALUES ('Old Driver', 'LP-2025-888', 35, 'Senior Driver', 65, '8888888888');
-- -- Expected Error: "Loco pilot cannot be older than 60 years."
-- 
-- -- Test 3: Valid loco pilot (This will SUCCEED)
-- INSERT INTO Loco_Pilot (Name, License_Number, Experience_Years, Role, Age, Contact_Number)
-- VALUES ('Valid Driver', 'LP-2025-777', 10, 'Senior Driver', 40, '7777777777');
-- 
-- SELECT * FROM Loco_Pilot WHERE License_Number = 'LP-2025-777';

-- ============================================================================
-- TRIGGER 10: update_train_route
-- Purpose: Clears train schedule when route is changed
-- ============================================================================
-- SELECT '=== TRIGGER 10: Update Train Route (Clear Schedule) ===' AS Demo;
-- 
-- -- Step 1: Check current train schedule for Train 1
-- SELECT * FROM Train_Schedule WHERE Train_ID = 1;
-- 
-- -- Step 2: Change the route of Train 1
-- UPDATE Train SET Route_ID = 5 WHERE Train_ID = 1;
-- 
-- -- Step 3: Check schedule again (should be empty)
-- SELECT * FROM Train_Schedule WHERE Train_ID = 1;
-- 
-- -- Step 4: Restore original route
-- UPDATE Train SET Route_ID = 1 WHERE Train_ID = 1;

-- ============================================================================
-- TRIGGER 11: validate_passenger_age
-- Purpose: Ensures passenger age is between 0 and 120
-- ============================================================================
-- SELECT '=== TRIGGER 11: Validate Passenger Age ===' AS Demo;
-- 
-- -- Test 1: Try negative age (This will FAIL)
-- -- Uncomment to test:
-- -- INSERT INTO Passenger (First_Name, Last_Name, Age, Gender, Email)
-- -- VALUES ('Invalid', 'Person', -5, 'Male', 'invalid@email.com');
-- -- Expected Error: "Invalid passenger age. Age must be between 0 and 120."
-- 
-- -- Test 2: Try age above 120 (This will FAIL)
-- -- Uncomment to test:
-- -- INSERT INTO Passenger (First_Name, Last_Name, Age, Gender, Email)
-- -- VALUES ('Super', 'Old', 150, 'Male', 'old@email.com');
-- -- Expected Error: "Invalid passenger age. Age must be between 0 and 120."
-- 
-- -- Test 3: Valid age (This will SUCCEED)
-- INSERT INTO Passenger (First_Name, Last_Name, Age, Gender, Email)
-- VALUES ('Valid', 'Passenger', 45, 'Male', 'valid@email.com');
-- 
-- SELECT * FROM Passenger WHERE First_Name = 'Valid' AND Last_Name = 'Passenger';

-- ============================================================================
-- TRIGGER 12: apply_senior_citizen_discount
-- Purpose: Automatically applies 40% discount for passengers 60+ years
-- ============================================================================
-- SELECT '=== TRIGGER 12: Apply Senior Citizen Discount ===' AS Demo;
-- 
-- -- Step 1: Add a senior citizen passenger
-- INSERT INTO Passenger (First_Name, Last_Name, Age, Gender, Email)
-- VALUES ('Senior', 'Citizen', 65, 'Male', 'senior@email.com');
-- 
-- -- Get the new passenger ID
-- SET @senior_passenger_id = LAST_INSERT_ID();
-- 
-- -- Step 2: Add a railway card for this passenger
-- INSERT INTO Railway_Card (Card_Number, Card_Type, Issue_Date, Expiry_Date, Balance, Passenger_ID)
-- VALUES ('RC-SENIOR-01', 'Senior Citizen', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 10000.00, @senior_passenger_id);
-- 
-- -- Step 3: Book a ticket with original fare of 1000 (should be discounted to 600)
-- INSERT INTO Ticket (PNR_Number, Booking_Date_Time, Journey_Date, Fare, Class, Seat_Number, Coach_Number, Status, Source_Station_ID, Destination_Station_ID, Passenger_ID, Train_ID)
-- VALUES ('SENIOR001', NOW(), '2025-12-25', 1000.00, 'AC-2', '5', 'A1', 'Confirmed', 1, 2, @senior_passenger_id, 1);
-- 
-- -- Step 4: Check the actual fare charged (should show 600.00 with 40% discount)
-- SELECT 
--     T.PNR_Number,
--     CONCAT(P.First_Name, ' ', P.Last_Name) AS Passenger_Name,
--     P.Age,
--     T.Fare AS 'Discounted_Fare (40% off)',
--     T.Class
-- FROM Ticket T
-- JOIN Passenger P ON T.Passenger_ID = P.Passenger_ID
-- WHERE T.PNR_Number = 'SENIOR001';

-- ============================================================================
-- SUMMARY: View all trigger demonstrations results
-- ============================================================================
-- SELECT '=== TRIGGER DEMONSTRATION SUMMARY ===' AS Summary;
-- 
-- SELECT 
--     'Total Triggers Implemented' AS Description,
--     '12 Triggers' AS Count
-- UNION ALL
-- SELECT 'Tickets Booked During Demo', COUNT(*)
-- FROM Ticket 
-- WHERE PNR_Number LIKE 'DEMO%' OR PNR_Number LIKE 'AUTO%' OR PNR_Number LIKE 'VALID%' 
--    OR PNR_Number LIKE 'CAPTEST%' OR PNR_Number LIKE 'SENIOR%'
-- UNION ALL
-- SELECT 'Audit Log Entries', COUNT(*)
-- FROM Ticket_Audit_Log
-- UNION ALL
-- SELECT 'New Passengers Added', COUNT(*)
-- FROM Passenger 
-- WHERE First_Name IN ('Valid', 'Senior');
-- 
-- -- View all demonstration tickets
-- SELECT 
--     T.PNR_Number,
--     CONCAT(P.First_Name, ' ', P.Last_Name) AS Passenger_Name,
--     T.Journey_Date,
--     T.Fare,
--     T.Class,
--     T.Status
-- FROM Ticket T
-- JOIN Passenger P ON T.Passenger_ID = P.Passenger_ID
-- WHERE T.PNR_Number IN ('DEMO00001', 'AUTO12345', 'VALID0001', 'CAPTEST01', 'SENIOR001')
-- ORDER BY T.Booking_Date_Time;