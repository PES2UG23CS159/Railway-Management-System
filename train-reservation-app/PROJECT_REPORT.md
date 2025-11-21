# TRAIN RESERVATION SYSTEM
## DATABASE MANAGEMENT SYSTEM PROJECT REPORT

---

<div align="center">

### **Railway Ticket Booking and Management System**

**A Comprehensive Database-Driven Application for Train Management**

---

#### Team Details

**Project Title:** Train Reservation System  
**Course:** Database Management Systems (DBMS)  
**Academic Year:** 2024-2025  

**Team Members:**
- Yogesh - Roll No: [Your Roll Number]
- [Team Member 2] - Roll No: [Roll Number]
- [Team Member 3] - Roll No: [Roll Number]
- [Team Member 4] - Roll No: [Roll Number]

**Guided By:** [Professor Name]  
**Department:** Computer Science and Engineering  
**Institution:** [Your College/University Name]

---

**Submission Date:** November 14, 2025

</div>

---

## TABLE OF CONTENTS

1. [Abstract](#abstract)
2. [User Requirements Specification](#user-requirements-specification)
3. [Software & Tools Used](#software--tools-used)
4. [ER Diagram](#er-diagram)
5. [Relational Schema](#relational-schema)
6. [DDL Commands](#ddl-commands)
7. [CRUD Operations](#crud-operations)
8. [Application Features & Screenshots](#application-features--screenshots)
9. [Advanced SQL Features](#advanced-sql-features)
10. [SQL Queries & Code](#sql-queries--code)
11. [GitHub Repository](#github-repository)
12. [Conclusion](#conclusion)

---

## 1. ABSTRACT

This project presents a full-stack Train Reservation System that digitizes the end-to-end lifecycle of railway operations from passenger registration to ticket booking completion. Developed using React for the frontend, Node.js/Express for the backend, and MySQL for data persistence, the system demonstrates practical implementation of database management principles including normalization, transaction management, and complex query optimization.

Key features include role-based authentication with secure login mechanisms, automated smartcard generation upon passenger registration, real-time train search and booking workflows, dynamic seat allocation and fare calculation, and comprehensive analytics dashboards for administrators. The system showcases advanced SQL concepts through stored procedures for ticket booking automation, nested subqueries for identifying frequent travelers, multi-table JOIN operations for detailed schedule reports, aggregate functions for revenue analysis and station statistics, triggers for ticket audit logging, and custom SQL functions calculating fare based on distance and class type.

### Description of the Problem Statement

The Train Reservation System is a comprehensive web-based platform designed to streamline the booking, management, and coordination of railway tickets across multiple trains, stations, and routes. The system implements a two-tier role-based architecture serving administrators and passengers, each with tailored functionalities and interfaces.

Administrators maintain centralized control over train management, station operations, route planning, smartcard issuance, loco pilot assignments, and schedule coordination through an intuitive dashboard featuring real-time analytics. Passengers can search trains by source and destination, book tickets with automated seat allocation, manage digital smartcards, view booking history, and access personalized profiles.

The platform addresses common challenges in railway operations including manual booking errors, lack of real-time availability, payment processing inefficiencies, schedule conflicts, and absence of centralized passenger visibility. Built with a robust MySQL database implementing normalized schemas, foreign key constraints, and advanced SQL features including stored procedures, triggers, nested queries, and custom functions, the system ensures data integrity and operational efficiency.

---

## 2. USER REQUIREMENTS SPECIFICATION

### 1. Functional Requirements

#### 1.1 User Management & Authentication
- FR1.1: System shall support two user roles: Administrator and Passenger with role-based access control
- FR1.2: Users shall authenticate using email/password with secure session management and password validation
- FR1.3: Passengers shall self-register with automatic smartcard generation; administrators shall have pre-configured credentials
- FR1.4: System shall maintain unified login portal with role-based redirection post-authentication

#### 1.2 Passenger Management
- FR2.1: Passengers shall create accounts with personal details: name, email, password, age, gender, and contact number
- FR2.2: System shall enforce email uniqueness and validate passenger age (1-120 years)
- FR2.3: Automatic smartcard issuance upon registration with unique card number, issue date, expiry date (1 year), and initial balance (₹0.00)
- FR2.4: Passengers shall view and update profile information including contact details

#### 1.3 Train & Station Management
- FR3.1: Administrators shall create, update, and manage train inventory with details: name, number, type, and total seats
- FR3.2: System shall maintain station database with station code, name, location, and platform count
- FR3.3: Train numbers and station codes shall be unique system-wide
- FR3.4: Administrators shall define routes connecting start and end stations with distance and route type

#### 1.4 Schedule & Route Management
- FR4.1: Administrators shall create train schedules specifying train-station mappings with arrival time, departure time, platform number, stop sequence, and distance from source
- FR4.2: System shall prevent scheduling conflicts on same platform at overlapping times
- FR4.3: Real-time schedule display for passengers with multi-station journey planning
- FR4.4: Route management with source-destination mapping and distance calculation

#### 1.5 Ticket Booking & Management
- FR5.1: Passengers shall search trains by source and destination stations with date filtering
- FR5.2: System shall display available trains with journey details, fare calculation, and class options (Sleeper, 3AC, 2AC, 1AC)
- FR5.3: Automated ticket booking with seat allocation, unique ticket ID, booking confirmation, and journey details
- FR5.4: Ticket status tracking: Confirmed, Cancelled, Completed with automatic seat deallocation on cancellation
- FR5.5: Passengers shall view booking history with train details, seat numbers, and travel dates

#### 1.6 Smartcard & Payment Management
- FR6.1: Passengers shall recharge smartcards with any amount (minimum ₹1.00)
- FR6.2: System shall validate smartcard balance preventing negative balances via SQL triggers
- FR6.3: Administrators shall issue new smartcards to passengers and recharge any card
- FR6.4: Real-time balance tracking with transaction history and expiry date monitoring
- FR6.5: Smartcard-passenger linking with one-to-one relationship

#### 1.7 Loco Pilot Management
- FR7.1: Administrators shall manage locomotive pilots with details: name, license number, experience years, contact, and joining date
- FR7.2: System shall assign pilots to trains with date tracking via Operates relationship
- FR7.3: License numbers shall be unique; experience validation (0-50 years)

#### 1.8 Dashboard & Analytics
- FR8.1: Admin dashboard with real-time statistics: total passengers, trains, stations, tickets booked, revenue generated
- FR8.2: SQL demonstration capabilities showcasing:
  - Stored procedures (BookTicket, RechargeSmartcard with transaction management)
  - Nested queries (frequent travelers, trains through specific stations)
  - JOIN queries (passenger bookings with train details across 5+ tables)
  - Aggregate functions (revenue by train, station statistics: COUNT, SUM, AVG, MAX, MIN)
  - Custom SQL function (CalculateFare based on distance and class)
- FR8.3: Passenger dashboard displaying upcoming journeys, smartcard balance, and booking history
- FR8.4: Analytics for route popularity, peak travel times, and passenger demographics

#### 1.9 Audit & Logging
- FR9.1: System shall maintain ticket audit log tracking status changes with old value, new value, timestamp, and change type
- FR9.2: Automated audit triggers on ticket updates capturing all modifications
- FR9.3: Administrative action logging for train creation, schedule modifications, and smartcard operations

---

### 2. Non-Functional Requirements

#### 2.1 Performance & Scalability
- NFR1.1: Support 100+ concurrent users with page load time < 2 seconds and API response time < 500ms
- NFR1.2: Database queries execute within 2 seconds; connection pooling (10 connections) for efficiency
- NFR1.3: Scalable architecture supporting multiple routes, trains, and growing passenger base
- NFR1.4: Optimized JOIN queries with indexed foreign keys for fast data retrieval

#### 2.2 Security
- NFR2.1: Password storage (production systems should implement bcrypt hashing with 10+ salt rounds)
- NFR2.2: SQL injection prevention using parameterized queries across all database operations
- NFR2.3: Role-based authorization on all API endpoints preventing unauthorized access
- NFR2.4: CORS policies configured for secure frontend-backend communication
- NFR2.5: XSS protection with input sanitization on frontend forms

#### 2.3 Usability & Reliability
- NFR3.1: Responsive UI across mobile, tablet, and desktop devices with Bootstrap 5 framework
- NFR3.2: Real-time form validation with clear error messages and visual feedback
- NFR3.3: Intuitive navigation with gradient-themed modern interface
- NFR3.4: 99% uptime with ACID transaction guarantees and referential integrity via foreign keys
- NFR3.5: Graceful error handling with user-friendly messages and automatic retry mechanisms

#### 2.4 Maintainability & Data Integrity
- NFR4.1: Modular architecture: RESTful APIs, component-based React, 3NF normalized database schema
- NFR4.2: Environment variables (.env) for database configuration and API endpoints
- NFR4.3: Foreign key constraints with CASCADE on delete for smartcards, SET NULL for optional relationships
- NFR4.4: CHECK constraints for data validation (age, balance, seats, experience years)
- NFR4.5: Separation of concerns across presentation (React), business logic (Express), and data layers (MySQL)

---

### 3. Database Requirements

#### 3.1 Core Schema
- 14 tables: Passenger, Smartcard, Train, Station, Route, Train_Schedule, Ticket, Loco_Pilot, Linked_To, Operates, Passenger_Smartcard, Ticket_Audit_Log, Follows, Consists_Of
- Primary/Foreign Keys: All tables with auto-increment PKs; foreign keys with CASCADE/SET NULL/RESTRICT policies
- UNIQUE Constraints: Email, Card_Number, Train_Number, Station_Code, License_Number
- CHECK Constraints: Age (1-120), Balance (>= 0), Total_Seats (> 0), Experience_Years (0-50)
- Indexes: Created on email, station names, train numbers, dates, status fields for query optimization

#### 3.2 Advanced SQL Objects
- Stored Procedures:
  - BookTicket(passenger_id, train_id, journey_date, class, fare) - Automated ticket creation with seat allocation
  - RechargeSmartcard(card_id, amount) - Balance update with transaction safety
  
- Triggers:
  - ticket_audit_trigger - Logs ticket status changes to Ticket_Audit_Log
  - check_smartcard_balance - Prevents negative balance updates
  - prevent_duplicate_booking - Validates unique passenger-train-date combinations
  
- Functions:
  - CalculateFare(distance, class_type) - Returns fare based on distance (km) and travel class with base rates (Sleeper: ₹0.50/km, 3AC: ₹1.00/km, 2AC: ₹1.50/km, 1AC: ₹2.00/km)
  
- Views:
  - passenger_dashboard - Aggregates passenger bookings, smartcard balance, upcoming journeys
  - admin_statistics - Real-time counts of passengers, trains, tickets, revenue

#### 3.3 Relationships & Cardinality
- Passenger ⟶ Smartcard (1:1)
- Passenger ⟶ Ticket (1:M)
- Train ⟶ Train_Schedule (1:M)
- Station ⟶ Train_Schedule (1:M)
- Ticket ⟶ Train (M:M via Linked_To)
- Loco_Pilot ⟶ Train (M:M via Operates)
- Route ⟶ Station (M:M via Consists_Of)

---

## 3. SOFTWARE & TOOLS USED

3.1 Database
- MySQL Server 8.0 - Relational Database Management System
- MySQL Workbench - Database design and administration

3.2 Backend
- Node.js (v18+) - JavaScript runtime environment
- Express.js (v4.18.2) - Web application framework
- mysql2 (v3.6.0) - MySQL client for Node.js
- cors - Cross-Origin Resource Sharing middleware
- dotenv - Environment variable management

3.3 Frontend
- React.js (v18.2.0) - UI library
- React Router DOM (v6.15.0) - Client-side routing
- Bootstrap 5.3.1 - CSS framework
- React-Bootstrap - Bootstrap components for React
- Axios (v1.5.0) - HTTP client

3.4 Development Tools
- Visual Studio Code - Code editor
- Git - Version control
- GitHub - Code repository
- Postman - API testing
- Chrome DevTools - Frontend debugging

3.5 Programming Languages
- JavaScript (ES6+) - Frontend and backend
- SQL - Database queries
- HTML5 - Markup
- CSS3 - Styling

---

## 4. ER DIAGRAM

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Passenger  │─────────│   Smartcard  │         │   Station   │
│             │ 1     1 │              │         │             │
│ *Passenger_ID│         │ *Card_ID     │         │ *Station_ID │
│  Name       │         │  Card_Number │         │  Name       │
│  Email      │         │  Balance     │         │  Location   │
│  Password   │         │  Issue_Date  │         │  Platform_  │
│  Age        │         │  Expiry_Date │         │    Count    │
│  Gender     │         │  Card_Type   │         └──────┬──────┘
│  Contact_No │         │  Passenger_ID│                │
└──────┬──────┘         └──────────────┘                │
       │                                                 │
       │ 1                                              │ M
       │                                                 │
       │                                                 │
       │ M                                               │
┌──────┴──────┐         ┌──────────────┐         ┌──────┴──────┐
│   Ticket    │─────────│   Linked_To  │         │    Route    │
│             │ 1     M │              │         │             │
│ *Ticket_ID  │         │ *Ticket_ID   │         │ *Route_ID   │
│  Booking_   │         │ *Train_ID    │         │  Route_Name │
│    Date     │         │  Journey_    │         │  Start_     │
│  Journey_   │         │    Date      │         │   Station   │
│    Date     │         └──────────────┘         │  End_Station│
│  Fare       │                │                 │  Distance_KM│
│  Status     │                │ M               │  Route_Type │
│  Class      │                │                 └──────┬──────┘
│  Seat_No    │                │                        │
│  Passenger_ │                │ 1                      │ M
│    ID       │         ┌──────┴──────┐                │
└─────────────┘         │    Train    │                │
                        │             │                │
                        │ *Train_ID   │────────────────┘
                        │  Train_Name │ 1         M
                        │  Train_     │
                        │   Number    │
                        │  Type       │
                        │  Total_Seats│
                        └──────┬──────┘
                               │
                               │ 1
                               │
                               │ M
                        ┌──────┴──────┐         ┌─────────────┐
                        │Train_Schedule│         │  Loco_Pilot │
                        │             │         │             │
                        │*Schedule_ID │         │ *Pilot_ID   │
                        │ Train_ID    │         │  Name       │
                        │ Station_ID  │         │  License_   │
                        │ Arrival_    │         │    Number   │
                        │   Time      │         │  Experience_│
                        │ Departure_  │         │    Years    │
                        │   Time      │         │  Contact_No │
                        │ Platform_   │         │  Date_of_   │
                        │   Number    │         │   Joining   │
                        │ Stop_Number │         └─────────────┘
                        │ Distance_   │                │
                        │  From_Source│                │ M
                        └─────────────┘                │
                                                       │ M
                                                ┌──────┴──────┐
                                                │  Operates   │
                                                │             │
                                                │ *Pilot_ID   │
                                                │ *Train_ID   │
                                                │  Date       │
                                                └─────────────┘

Additional Tables:
- Ticket_Audit_Log: Tracks all ticket changes
- Passenger_Smartcard: Links passengers to multiple cards
- Follows: Route to Route relationships
- Consists_Of: Route to Station relationships
```

### Entity Descriptions

1. **Passenger** - Stores user information
2. **Smartcard** - Digital payment cards for passengers
3. **Ticket** - Booking records
4. **Train** - Train information
5. **Station** - Railway station details
6. **Route** - Train routes between stations
7. **Train_Schedule** - Timetable for trains at stations
8. **Loco_Pilot** - Train driver information
9. **Linked_To** - Connects tickets to trains
10. **Operates** - Assigns pilots to trains

---

## 5. RELATIONAL SCHEMA

The following relational schemas are derived from the ER model. Primary keys are underlined.

Passenger (Passenger_ID, Name, Age, Contact_No, Gender, Email, Password)
• UNIQUE: Email

Smartcard (Card_ID, Card_Number, Card_Type, Issue_Date, Expiry_Date, Balance, Passenger_ID)
• FK: Passenger_ID REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE
• UNIQUE: Card_Number

Station (Station_ID, Station_Code, Name, Location, Platform_Count)
• UNIQUE: Station_Code

Route (Route_ID, Route_Name, Start_Station, End_Station, Distance_KM, Route_Type)
• FK: Start_Station REFERENCES Station(Station_ID)
• FK: End_Station REFERENCES Station(Station_ID)

Train (Train_ID, Train_Name, Train_Number, Type, Total_Seats)
• UNIQUE: Train_Number
• CHECK: Total_Seats > 0

Train_Schedule (Schedule_ID, Train_ID, Station_ID, Arrival_Time, Departure_Time, Platform_Number, Stop_Number, Distance_From_Source)
• FK: Train_ID REFERENCES Train(Train_ID) ON DELETE CASCADE
• FK: Station_ID REFERENCES Station(Station_ID)

Ticket (Ticket_ID, Booking_Date, Journey_Date, Fare, Status, Class, Seat_No, Passenger_ID)
• FK: Passenger_ID REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE

Loco_Pilot (Pilot_ID, Name, License_Number, Experience_Years, Contact_No, Date_of_Joining)
• UNIQUE: License_Number
• CHECK: Experience_Years >= 0

Linked_To (Ticket_ID, Train_ID, Journey_Date)
• FK: Ticket_ID REFERENCES Ticket(Ticket_ID) ON DELETE CASCADE
• FK: Train_ID REFERENCES Train(Train_ID) ON DELETE CASCADE

Operates (Pilot_ID, Train_ID, Date)
• FK: Pilot_ID REFERENCES Loco_Pilot(Pilot_ID) ON DELETE CASCADE
• FK: Train_ID REFERENCES Train(Train_ID) ON DELETE CASCADE

Passenger_Smartcard (Passenger_ID, Card_ID, Link_Date)
• FK: Passenger_ID REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE
• FK: Card_ID REFERENCES Smartcard(Card_ID) ON DELETE CASCADE

Ticket_Audit_Log (Log_ID, Ticket_ID, Change_Type, Old_Value, New_Value, Changed_At, Changed_By)
• FK: Ticket_ID REFERENCES Ticket(Ticket_ID) ON DELETE CASCADE

Follows (Route_ID, Next_Route_ID)
• FK: Route_ID REFERENCES Route(Route_ID) ON DELETE CASCADE
• FK: Next_Route_ID REFERENCES Route(Route_ID) ON DELETE CASCADE

Consists_Of (Route_ID, Station_ID, Stop_Order)
• FK: Route_ID REFERENCES Route(Route_ID) ON DELETE CASCADE
• FK: Station_ID REFERENCES Station(Station_ID) ON DELETE CASCADE

### Functional Dependencies

- Passenger_ID → Name, Age, Contact_No, Gender, Email, Password
- Email → Passenger_ID (Candidate Key)
- Card_ID → Card_Number, Card_Type, Issue_Date, Expiry_Date, Balance, Passenger_ID
- Train_ID → Train_Name, Train_Number, Type, Total_Seats
- Station_ID → Station_Code, Name, Location, Platform_Count
- Ticket_ID → Booking_Date, Journey_Date, Fare, Status, Class, Seat_No, Passenger_ID

---

## 6. DDL COMMANDS

6.1 Database Creation
CREATE DATABASE train_reservation;
USE train_reservation;

6.2 Table Creation

Passenger Table
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

Smartcard Table
CREATE TABLE Smartcard (
    Card_ID INT PRIMARY KEY AUTO_INCREMENT,
    Card_Number VARCHAR(20) UNIQUE NOT NULL,
    Card_Type VARCHAR(30),
    Issue_Date DATE NOT NULL,
    Expiry_Date DATE NOT NULL,
    Balance DECIMAL(10, 2) DEFAULT 0.00,
    Passenger_ID INT,
    
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE,
    INDEX idx_smartcard_passenger (Passenger_ID),
    INDEX idx_smartcard_number (Card_Number)
);

Station Table
CREATE TABLE Station (
    Station_ID INT PRIMARY KEY AUTO_INCREMENT,
    Station_Code VARCHAR(10) UNIQUE NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Location VARCHAR(200),
    Platform_Count INT DEFAULT 1,
    
    INDEX idx_station_code (Station_Code),
    INDEX idx_station_name (Name)
);

Route Table
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

Train Table
CREATE TABLE Train (
    Train_ID INT PRIMARY KEY AUTO_INCREMENT,
    Train_Name VARCHAR(100) NOT NULL,
    Train_Number VARCHAR(20) UNIQUE NOT NULL,
    Type VARCHAR(50),
    Total_Seats INT CHECK (Total_Seats > 0),
    
    INDEX idx_train_number (Train_Number),
    INDEX idx_train_type (Type)
);

Train_Schedule Table
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

Ticket Table
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

Loco_Pilot Table
CREATE TABLE Loco_Pilot (
    Pilot_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    License_Number VARCHAR(50) UNIQUE,
    Experience_Years INT CHECK (Experience_Years >= 0),
    Contact_No VARCHAR(15),
    Date_of_Joining DATE,
    
    INDEX idx_pilot_license (License_Number)
);

Linked_To Table (Ticket-Train Relationship)
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

Operates Table (Pilot-Train Assignment)
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

Passenger_Smartcard Table
CREATE TABLE Passenger_Smartcard (
    PS_ID INT PRIMARY KEY AUTO_INCREMENT,
    Passenger_ID INT,
    Card_ID INT,
    Link_Date DATE DEFAULT (CURRENT_DATE),
    
    FOREIGN KEY (Passenger_ID) REFERENCES Passenger(Passenger_ID) ON DELETE CASCADE,
    FOREIGN KEY (Card_ID) REFERENCES Smartcard(Card_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_passenger_card (Passenger_ID, Card_ID)
);

Ticket_Audit_Log Table
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

Follows Table (Route Relationships)
CREATE TABLE Follows (
    Follow_ID INT PRIMARY KEY AUTO_INCREMENT,
    Route_ID INT,
    Next_Route_ID INT,
    
    FOREIGN KEY (Route_ID) REFERENCES Route(Route_ID) ON DELETE CASCADE,
    FOREIGN KEY (Next_Route_ID) REFERENCES Route(Route_ID) ON DELETE CASCADE
);

Consists_Of Table (Route-Station Mapping)
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

6.3 View Creation

Passenger Dashboard View
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

Admin Statistics View
CREATE VIEW admin_statistics AS
SELECT 
    (SELECT COUNT(*) FROM Passenger) AS Total_Passengers,
    (SELECT COUNT(*) FROM Train) AS Total_Trains,
    (SELECT COUNT(*) FROM Station) AS Total_Stations,
    (SELECT COUNT(*) FROM Ticket WHERE Status = 'Confirmed') AS Active_Bookings,
    (SELECT SUM(Fare) FROM Ticket WHERE Status = 'Confirmed') AS Total_Revenue;

Train Schedule View
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

6.4 Index Creation
CREATE INDEX idx_ticket_booking_date ON Ticket(Booking_Date);
CREATE INDEX idx_schedule_stop_order ON Train_Schedule(Stop_Number);
CREATE INDEX idx_smartcard_expiry ON Smartcard(Expiry_Date);
CREATE INDEX idx_passenger_age ON Passenger(Age);

6.5 Table Alterations (if needed)

Add column to existing table
ALTER TABLE Passenger ADD COLUMN Loyalty_Points INT DEFAULT 0;

Modify column
ALTER TABLE Ticket MODIFY COLUMN Seat_No VARCHAR(20);

Drop column
ALTER TABLE Passenger DROP COLUMN Loyalty_Points;

Add constraint
ALTER TABLE Smartcard ADD CONSTRAINT chk_balance CHECK (Balance >= 0);

---

## 7. CRUD OPERATIONS

### Screenshots Demonstrating CRUD

#### CREATE Operations
- ✅ Register New Passenger
- ✅ Issue New Smartcard
- ✅ Add New Train
- ✅ Create New Station
- ✅ Add New Route
- ✅ Book New Ticket
- ✅ Add Loco Pilot
- ✅ Create Train Schedule

#### READ Operations
- ✅ View All Passengers
- ✅ View Smartcard Details
- ✅ Search Trains
- ✅ View Train Schedules
- ✅ View Booking History
- ✅ View Station List
- ✅ View Routes

#### UPDATE Operations
- ✅ Update Passenger Profile
- ✅ Recharge Smartcard Balance
- ✅ Update Train Details
- ✅ Modify Station Information
- ✅ Update Route Details
- ✅ Change Ticket Status

#### DELETE Operations
- ✅ Delete Passenger Account
- ✅ Remove Station
- ✅ Delete Route
- ✅ Cancel Ticket

---

## 8. APPLICATION FEATURES & SCREENSHOTS

### 8.1 Authentication & Authorization
- User Registration with auto-smartcard generation
- Email/Password login
- Role-based access (Admin/Passenger)
- Session management

### 8.2 Passenger Features
- **Home Dashboard** - Welcome page with navigation
- **Search Trains** - Find trains by source/destination
- **Book Tickets** - Reserve seats with fare calculation
- **My Tickets** - View booking history
- **Profile** - View personal details and smartcard
- **Smartcard Management** - View card, recharge balance

### 8.3 Admin Features
- **Admin Dashboard** - System overview with statistics
- **Train Management** - Add/edit/view trains
- **Station Management** - CRUD operations on stations
- **Route Management** - Manage train routes
- **Schedule Management** - Create and view train schedules
- **Smartcard Management** - Issue cards, view all cards
- **Loco Pilot Management** - Manage pilot information

### 8.4 UI/UX Features
- Responsive design (mobile/tablet/desktop)
- Modern gradient color scheme
- Smooth animations and transitions
- Card-based layout
- Interactive tables with hover effects
- Real-time form validation
- Toast notifications for actions
- Loading spinners

---

## 9. ADVANCED SQL FEATURES

### 10.1 Triggers

#### Audit Log Trigger
```sql
DELIMITER //
CREATE TRIGGER ticket_audit_trigger
AFTER UPDATE ON Ticket
FOR EACH ROW
BEGIN
    IF OLD.Status != NEW.Status THEN
        INSERT INTO Ticket_Audit_Log (
            Ticket_ID, Change_Type, Old_Value, New_Value, Changed_At
        ) VALUES (
            NEW.Ticket_ID, 'Status Change', OLD.Status, NEW.Status, NOW()
        );
    END IF;
END//
DELIMITER ;
```

#### Smartcard Balance Check Trigger
```sql
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
```

### 10.2 Stored Procedures

#### Book Ticket Procedure
```sql
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
    
    SELECT v_ticket_id AS Ticket_ID, v_seat_no AS Seat_Number;
END//
DELIMITER ;
```

#### Recharge Smartcard Procedure
```sql
DELIMITER //
CREATE PROCEDURE RechargeSmartcard(
    IN p_card_id INT,
    IN p_amount DECIMAL(10,2)
)
BEGIN
    UPDATE Smartcard
    SET Balance = Balance + p_amount
    WHERE Card_ID = p_card_id;
    
    SELECT Card_ID, Balance
    FROM Smartcard
    WHERE Card_ID = p_card_id;
END//
DELIMITER ;
```

### 10.3 Functions

#### Calculate Fare Function
```sql
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
    
    RETURN distance * base_rate;
END//
DELIMITER ;
```

### 10.4 Nested Queries

#### Find Passengers with Multiple Bookings
```sql
SELECT P.Name, P.Email, COUNT(T.Ticket_ID) as Booking_Count
FROM Passenger P
WHERE P.Passenger_ID IN (
    SELECT Passenger_ID
    FROM Ticket
    GROUP BY Passenger_ID
    HAVING COUNT(Ticket_ID) > 2
)
JOIN Ticket T ON P.Passenger_ID = T.Passenger_ID
GROUP BY P.Passenger_ID;
```

#### Trains Passing Through Specific Station
```sql
SELECT T.Train_Name, T.Train_Number
FROM Train T
WHERE T.Train_ID IN (
    SELECT DISTINCT Train_ID
    FROM Train_Schedule
    WHERE Station_ID = (
        SELECT Station_ID
        FROM Station
        WHERE Name = 'Mumbai Central'
    )
);
```

### 10.5 Join Queries

#### Train Schedule with Station Names
```sql
SELECT 
    T.Train_Name,
    T.Train_Number,
    S.Name AS Station_Name,
    TS.Arrival_Time,
    TS.Departure_Time,
    TS.Platform_Number
FROM Train_Schedule TS
INNER JOIN Train T ON TS.Train_ID = T.Train_ID
INNER JOIN Station S ON TS.Station_ID = S.Station_ID
ORDER BY T.Train_ID, TS.Stop_Number;
```

#### Passenger Bookings with Train Details
```sql
SELECT 
    P.Name AS Passenger_Name,
    T.Ticket_ID,
    T.Journey_Date,
    T.Class,
    T.Seat_No,
    TR.Train_Name,
    TR.Train_Number
FROM Passenger P
INNER JOIN Ticket T ON P.Passenger_ID = T.Passenger_ID
LEFT JOIN Linked_To LT ON T.Ticket_ID = LT.Ticket_ID
LEFT JOIN Train TR ON LT.Train_ID = TR.Train_ID
WHERE P.Email = 'yogesh@gmail.com';
```

### 10.6 Aggregate Queries

#### Revenue by Train
```sql
SELECT 
    T.Train_Name,
    COUNT(TK.Ticket_ID) AS Total_Bookings,
    SUM(TK.Fare) AS Total_Revenue,
    AVG(TK.Fare) AS Average_Fare
FROM Train T
LEFT JOIN Linked_To LT ON T.Train_ID = LT.Train_ID
LEFT JOIN Ticket TK ON LT.Ticket_ID = TK.Ticket_ID
GROUP BY T.Train_ID
HAVING Total_Revenue > 1000
ORDER BY Total_Revenue DESC;
```

#### Station Statistics
```sql
SELECT 
    S.Name AS Station_Name,
    COUNT(DISTINCT TS.Train_ID) AS Trains_Passing,
    COUNT(TS.Schedule_ID) AS Daily_Stops,
    S.Platform_Count
FROM Station S
LEFT JOIN Train_Schedule TS ON S.Station_ID = TS.Station_ID
GROUP BY S.Station_ID;
```

#### Smartcard Statistics
```sql
SELECT 
    COUNT(*) AS Total_Cards,
    SUM(Balance) AS Total_Balance,
    AVG(Balance) AS Average_Balance,
    MAX(Balance) AS Highest_Balance,
    MIN(Balance) AS Lowest_Balance
FROM Smartcard
WHERE Balance > 0;
```

---

## 10. SQL QUERIES & CODE

All SQL queries are available in:
- `database/schema.sql` - DDL commands
- `database/triggers.sql` - Trigger definitions
- `database/procedures.sql` - Stored procedures
- `database/queries.sql` - Sample queries

### Invoking Procedures

```sql
-- Book a ticket
CALL BookTicket(1, 101, '2025-12-01', 'Sleeper', 450.00);

-- Recharge smartcard
CALL RechargeSmartcard(5, 1000.00);

-- Calculate fare
SELECT CalculateFare(350.5, '3AC') AS Calculated_Fare;
```

---

## 11. GITHUB REPOSITORY

**Repository Link:** [To be added]

Repository contains:
- Complete source code (Frontend + Backend)
- Database schema and sample data
- Installation instructions
- API documentation
- Project screenshots

---

## 12. CONCLUSION

The Train Reservation System successfully demonstrates a full-stack database application with:
- Normalized database design (3NF)
- 14 interconnected tables
- Advanced SQL features (triggers, procedures, joins)
- RESTful API architecture
- Modern responsive UI
- Role-based access control
- Real-time data operations

The system can handle passenger management, ticket booking, train scheduling, and payment processing efficiently while maintaining data integrity and security.

---

**END OF REPORT**
