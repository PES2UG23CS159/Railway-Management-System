-- Migration to add Password column to Passenger table
-- Run this in MySQL Workbench if you already have the database created

USE train_reservation;

-- Add Password column if it doesn't exist
ALTER TABLE Passenger ADD COLUMN IF NOT EXISTS Password VARCHAR(255);

-- Update existing passengers with default password 'pass123'
UPDATE Passenger SET Password = 'pass123' WHERE Email = 'rajesh.kumar@email.com';
UPDATE Passenger SET Password = 'pass123' WHERE Email = 'priya.sharma@email.com';
UPDATE Passenger SET Password = 'pass123' WHERE Email = 'amit.patel@email.com';
UPDATE Passenger SET Password = 'pass123' WHERE Email = 'sneha.reddy@email.com';
UPDATE Passenger SET Password = 'pass123' WHERE Email = 'vikram.singh@email.com';

-- Verify the changes
SELECT Passenger_ID, Name, Email, Password FROM Passenger;
