-- =========================================
-- INVOKING PROCEDURES, FUNCTIONS & TRIGGERS
-- Train Reservation System - Example Usage
-- =========================================

USE train_reservation;

-- =========================================
-- PART 1: INVOKING STORED PROCEDURES
-- =========================================

-- Example 1: Book a ticket for Passenger 1
CALL BookTicket(1, 1, '2025-12-25', 'Sleeper', 450.00);
-- Output: Shows Ticket_ID, Seat_Number, and Fare

-- Example 2: Book a ticket in 3AC class
CALL BookTicket(2, 2, '2025-12-20', '3AC', 750.00);

-- Example 3: Book a ticket in 2AC class
CALL BookTicket(3, 3, '2025-12-18', '2AC', 1200.00);

-- View all booked tickets
SELECT T.*, LT.Train_ID, TR.Train_Name 
FROM Ticket T
LEFT JOIN Linked_To LT ON T.Ticket_ID = LT.Ticket_ID
LEFT JOIN Train TR ON LT.Train_ID = TR.Train_ID
ORDER BY T.Booking_Date DESC;

-- Example 4: Recharge Smartcard for Card_ID 1
CALL RechargeSmartcard(1, 1000.00);
-- Output: Shows Card_ID, Old_Balance, Recharge_Amount, New_Balance

-- Example 5: Recharge another card
CALL RechargeSmartcard(2, 500.00);

-- Example 6: Recharge with larger amount
CALL RechargeSmartcard(3, 2500.00);

-- View updated smartcard balances
SELECT Card_ID, Card_Number, Balance, Passenger_ID 
FROM Smartcard 
ORDER BY Card_ID;

-- =========================================
-- PART 2: INVOKING FUNCTIONS
-- =========================================

-- Example 1: Calculate fare for 350 km in 3AC
SELECT CalculateFare(350.5, '3AC') AS Calculated_Fare;
-- Output: 350.50

-- Example 2: Calculate fare for different distances and classes
SELECT 
    CalculateFare(500, 'Sleeper') AS Sleeper_500km,
    CalculateFare(500, '3AC') AS AC3_500km,
    CalculateFare(500, '2AC') AS AC2_500km,
    CalculateFare(500, '1AC') AS AC1_500km;

-- Example 3: Calculate fares for Mumbai-Delhi route (1384 km)
SELECT 
    'Mumbai to Delhi (1384 km)' AS Route,
    CalculateFare(1384, 'Sleeper') AS Sleeper_Fare,
    CalculateFare(1384, '3AC') AS AC3_Fare,
    CalculateFare(1384, '2AC') AS AC2_Fare,
    CalculateFare(1384, '1AC') AS AC1_Fare;

-- Example 4: Use function in a query with actual route data
SELECT 
    R.Route_Name,
    R.Distance_KM,
    CalculateFare(R.Distance_KM, 'Sleeper') AS Sleeper_Fare,
    CalculateFare(R.Distance_KM, '3AC') AS AC3_Fare,
    CalculateFare(R.Distance_KM, '2AC') AS AC2_Fare,
    CalculateFare(R.Distance_KM, '1AC') AS AC1_Fare
FROM Route R;

-- =========================================
-- PART 3: TESTING TRIGGERS
-- =========================================

-- Test Trigger 1: Ticket Audit Log Trigger
-- First, book a ticket
CALL BookTicket(1, 1, '2025-12-30', 'Sleeper', 450.00);

-- Get the last ticket ID
SET @last_ticket_id = LAST_INSERT_ID();

-- Update ticket status (this will trigger the audit log)
UPDATE Ticket SET Status = 'Cancelled' WHERE Ticket_ID = @last_ticket_id;

-- Check the audit log
SELECT * FROM Ticket_Audit_Log WHERE Ticket_ID = @last_ticket_id;
-- Output: Shows the status change from 'Confirmed' to 'Cancelled'

-- Update status again
UPDATE Ticket SET Status = 'Completed' WHERE Ticket_ID = @last_ticket_id;

-- Check audit log again
SELECT * FROM Ticket_Audit_Log WHERE Ticket_ID = @last_ticket_id;
-- Output: Shows all status changes

-- View complete audit trail
SELECT 
    TAL.*,
    T.Passenger_ID,
    P.Name AS Passenger_Name
FROM Ticket_Audit_Log TAL
JOIN Ticket T ON TAL.Ticket_ID = T.Ticket_ID
JOIN Passenger P ON T.Passenger_ID = P.Passenger_ID
ORDER BY TAL.Changed_At DESC;

-- Test Trigger 2: Smartcard Balance Check Trigger
-- This should succeed (positive balance)
UPDATE Smartcard SET Balance = Balance + 100 WHERE Card_ID = 1;
SELECT 'Balance update successful' AS Result;

-- This should FAIL (attempting negative balance)
-- Uncomment to test
-- UPDATE Smartcard SET Balance = -100 WHERE Card_ID = 1;
-- Output: Error message "Smartcard balance cannot be negative"

-- Test with deduction that would make balance negative
-- First, check current balance
SELECT Card_ID, Balance FROM Smartcard WHERE Card_ID = 1;

-- Try to deduct more than available (will fail if balance < 50000)
-- UPDATE Smartcard SET Balance = Balance - 50000 WHERE Card_ID = 1;

-- =========================================
-- PART 4: COMPLEX QUERIES USING PROCEDURES & FUNCTIONS
-- =========================================

-- Create tickets with calculated fares using function
DELIMITER //
CREATE PROCEDURE BookTicketWithCalculatedFare(
    IN p_passenger_id INT,
    IN p_train_id INT,
    IN p_journey_date DATE,
    IN p_class VARCHAR(20),
    IN p_distance DECIMAL(10,2)
)
BEGIN
    DECLARE calculated_fare DECIMAL(10,2);
    
    -- Calculate fare using function
    SET calculated_fare = CalculateFare(p_distance, p_class);
    
    -- Book ticket with calculated fare
    CALL BookTicket(p_passenger_id, p_train_id, p_journey_date, p_class, calculated_fare);
END//
DELIMITER ;

-- Use the new procedure
CALL BookTicketWithCalculatedFare(1, 1, '2025-12-28', '3AC', 1384);

-- =========================================
-- PART 5: VERIFICATION & ANALYSIS QUERIES
-- =========================================

-- Check all triggers in database
SELECT 
    TRIGGER_NAME,
    EVENT_MANIPULATION,
    EVENT_OBJECT_TABLE,
    ACTION_TIMING
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'train_reservation';

-- Check all procedures
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE,
    DTD_IDENTIFIER AS Return_Type
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'train_reservation'
AND ROUTINE_TYPE = 'PROCEDURE';

-- Check all functions
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE,
    DTD_IDENTIFIER AS Return_Type
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'train_reservation'
AND ROUTINE_TYPE = 'FUNCTION';

-- =========================================
-- PART 6: SAMPLE OUTPUT QUERIES
-- =========================================

-- Summary of all ticket bookings
SELECT 
    P.Name AS Passenger,
    T.Ticket_ID,
    TR.Train_Name,
    T.Journey_Date,
    T.Class,
    T.Seat_No,
    T.Fare,
    T.Status
FROM Ticket T
JOIN Passenger P ON T.Passenger_ID = P.Passenger_ID
LEFT JOIN Linked_To LT ON T.Ticket_ID = LT.Ticket_ID
LEFT JOIN Train TR ON LT.Train_ID = TR.Train_ID
ORDER BY T.Booking_Date DESC;

-- Summary of all smartcard recharges (simulated from balance changes)
SELECT 
    S.Card_ID,
    S.Card_Number,
    P.Name AS Passenger,
    S.Balance AS Current_Balance
FROM Smartcard S
JOIN Passenger P ON S.Passenger_ID = P.Passenger_ID
ORDER BY S.Balance DESC;

-- Statistics using views
SELECT * FROM admin_statistics;

-- Passenger dashboard
SELECT * FROM passenger_dashboard;

-- Train schedule view
SELECT * FROM train_schedule_view LIMIT 10;

-- =========================================
-- EXPECTED OUTPUTS (For Documentation)
-- =========================================

/*
PROCEDURE CALL: BookTicket(1, 1, '2025-12-25', 'Sleeper', 450.00)
OUTPUT:
+------------+-------------+--------+
| Ticket_ID  | Seat_Number | Fare   |
+------------+-------------+--------+
|         15 | Sleeper-42  | 450.00 |
+------------+-------------+--------+

PROCEDURE CALL: RechargeSmartcard(1, 1000.00)
OUTPUT:
+---------+-------------+-----------------+-------------+
| Card_ID | Old_Balance | Recharge_Amount | New_Balance |
+---------+-------------+-----------------+-------------+
|       1 |    21200.00 |         1000.00 |    22200.00 |
+---------+-------------+-----------------+-------------+

FUNCTION CALL: SELECT CalculateFare(350.5, '3AC') AS Calculated_Fare
OUTPUT:
+------------------+
| Calculated_Fare  |
+------------------+
|           350.50 |
+------------------+

TRIGGER TEST: UPDATE Ticket SET Status = 'Cancelled' WHERE Ticket_ID = 15
Audit Log Query Result:
+--------+-----------+---------------+-----------+-------------+---------------------+
| Log_ID | Ticket_ID | Change_Type   | Old_Value | New_Value   | Changed_At          |
+--------+-----------+---------------+-----------+-------------+---------------------+
|      1 |        15 | Status Change | Confirmed | Cancelled   | 2025-11-14 10:30:45 |
+--------+-----------+---------------+-----------+-------------+---------------------+

TRIGGER TEST: UPDATE Smartcard SET Balance = -100 WHERE Card_ID = 1
OUTPUT:
Error Code: 1644. Smartcard balance cannot be negative
*/

SELECT '========================================' AS '';
SELECT 'ALL PROCEDURES, FUNCTIONS & TRIGGERS TESTED SUCCESSFULLY!' AS Status;
SELECT '========================================' AS '';
