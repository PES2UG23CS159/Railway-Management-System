# TRAIN RESERVATION SYSTEM - ER DIAGRAM

## Entity-Relationship Diagram (Based on Railway Management System)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              TRAIN RESERVATION SYSTEM - ER DIAGRAM                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


        ┌──────────┐         ┌──────────┐         ┌──────────┐
        │   Age    │         │ Card_ID  │         │Contact_No│
        └─────┬────┘         └─────┬────┘         └─────┬────┘
              │                    │                    │
         ┌────┴─────────────┬─────┴──────┐        ┌────┴─────┐
         │                  │            │        │          │
    ┌────▼────┐       ┌─────▼─────┐     │   ┌────▼────┐ ┌──▼─────┐
    │Passenger│◄──────┤ SmartCard │     │   │Passenger│ │  Name  │
    │         │       │           │     │   │   _ID   │ └────────┘
    │         │       │           │     │   │  (PK)   │
    └────┬────┘       └─────┬─────┘     │   └─────────┘
         │ 1                │           │
         │                  │           │
         │      Uses        │   Owns    │
         │        ◇         │     ◇     │
         │       / \        │    / \    │
         └──────/   \───────┴───/   \───┘
               /     \         /     \
              / M   N \       / 1   1 \
                                        
         ┌──────────┐                  ┌──────────┐
         │ Ticket_ID│                  │  Fare    │
         │   (PK)   │                  └─────┬────┘
         └─────┬────┘                        │
         ┌─────▼────────────┬────────────────┴────┬─────────────┐
         │                  │                     │             │
    ┌────▼────┐      ┌──────▼──────┐      ┌──────▼──────┐  ┌──▼──────┐
    │ Ticket  │      │Date_Time    │      │Passenger_ID │  │PNR_No   │
    │         │      │             │      │   (FK)      │  │         │
    └────┬────┘      └─────────────┘      └─────────────┘  └─────────┘
         │                                                             
         │ N         ┌────────────────┐    ┌───────────────┐          
         │           │Source_Station  │    │Destination_   │          
         │           │                │    │  Station      │          
         │           └────────────────┘    └───────────────┘          
         │                                                             
         │          ◇ Linked_to                                       
         │         / \                                                 
         └────────/   \────────┐                                       
                 / M   N \     │                                       
                              │ N                                      
                         ┌────▼────┐        ┌──────────┐              
                         │  Train  │        │Train_Name│              
                    ┌────┤         ├────┐   └─────┬────┘              
                    │    └────┬────┘    │         │                   
             ┌──────▼──┐      │      ┌──▼─────┐   │                   
             │Capacity │      │      │Train_ID│   │                   
             └─────────┘      │      │  (PK)  │   │                   
                              │      └────────┘   │                   
                              │                   │                   
                    ◇ Follows │                   │                   
                   / \        │                   │                   
                  /   \       │                   │                   
                 / M N \      │ N                 │                   
                              │                   │                   
                         ┌────▼────┐        ┌─────▼──────┐            
                         │  Route  │        │ Route_Name │            
                    ┌────┤         ├────┐   └────────────┘            
                    │    └────┬────┘    │                             
             ┌──────▼──┐      │      ┌──▼─────────┐                   
             │Route_ID │      │      │Start_Station│                  
             │  (PK)   │      │      └────────────┘                   
             └─────────┘      │      ┌────────────┐                   
                              │      │End_Station │                   
                              │      └────────────┘                   
                              │                                        
                   ◇ Consists_of                                      
                  / \                                                  
                 /   \                                                 
                / M N \                                                
                       \                                               
                        │ N        ┌──────────┐                       
                   ┌────▼────┐     │  Name    │                       
                   │ Station │◄────┴──────────┘                       
              ┌────┤         ├────┐                                   
              │    └────┬────┘    │                                   
       ┌──────▼──┐      │      ┌──▼─────────┐                         
       │Station_ID│     │      │  Location  │                         
       │   (PK)   │     │      └────────────┘                         
       └──────────┘     │ 1                                           
                        │                                              
                        │      ◇ Operates                             
                        │     / \                                     
                        │    /   \                                    
                        │   / M N \                                   
                        │          \                                  
                   ┌────▼────┐     │                                  
                   │Employee │     │                                  
                   │(Loco    │◄────┘                                  
                   │ Pilot)  │                                        
              ┌────┤         ├────┐                                   
              │    └────┬────┘    │                                   
       ┌──────▼──┐      │      ┌──▼─────┐                             
       │Emp_ID   │      │      │  Name  │                             
       │Assigned_│      │      └────────┘                             
       │   ID    │      │      ┌────────┐                             
       │Station_ID│     │      │  Role  │                             
       │  (FK)   │      │      └────────┘                             
       └─────────┘      └──────────────────                           


       Additional Attributes for Reference:
       
       SmartCard: Balance, Issue_Date, Expiry_Date, Card_Type
       Ticket: Journey_Date, Class, Seat_Number, Coach_Number, Status
       Train: Train_Number, Total_Coaches, Train_Type
       Route: Distance_KM, Route_Type
       Station: Station_Code, Platform_Count
       Employee (Loco_Pilot): Age, License_Number, Experience_Years
       
```

---

## DETAILED ENTITY DESCRIPTIONS (Railway Management System)

### 1. **PASSENGER** (Strong Entity)
- **Primary Key:** Passenger_ID (PK)
- **Attributes:** 
  - Name (Simple attribute)
  - Age (Simple attribute - used for senior citizen discount)
  - Contact_No (Multi-valued - can have multiple contacts)
  - Gender (Simple attribute)
  - Email (Simple attribute)
- **Relationships:**
  - **Books** → Ticket (1:N) - One passenger can book many tickets
  - **Uses** → SmartCard (M:N) - Passengers can have multiple cards, cards can be shared
  - **Owns** → SmartCard (1:1) - Primary ownership

---

### 2. **SMARTCARD (Railway Card)** (Strong Entity)
- **Primary Key:** Card_ID (PK)
- **Attributes:** 
  - Card_Number (Unique identifier - format: RC-YYYY-XXXXXX)
  - Card_Type (Regular, Senior Citizen, Student)
  - Issue_Date (Temporal attribute)
  - Expiry_Date (Temporal attribute)
  - Balance (Derived from recharges and ticket purchases)
- **Foreign Keys:** Passenger_ID (FK)
- **Relationships:**
  - **Owned by** → Passenger (M:N via Passenger_Smartcard junction)
  - **Used for** → Ticket payment

**Business Rules:**
- Balance must be ≥ 0
- Expiry_Date must be > Issue_Date
- Card must be valid (not expired) for ticket booking

---

### 3. **TICKET** (Strong Entity)
- **Primary Key:** Ticket_ID (PK)
- **Attributes:** 
  - PNR_Number (Unique 10-digit identifier)
  - Date_Time (Booking timestamp)
  - Journey_Date (Date of travel)
  - Fare (Calculated based on distance and class)
  - Source_Station (Starting point)
  - Destination_Station (End point)
  - Class (AC-1, AC-2, AC-3, AC-Chair, Sleeper, General)
  - Seat_Number (Allocated seat)
  - Coach_Number (Allocated coach)
  - Status (Confirmed, RAC, Waiting, Cancelled)
- **Foreign Keys:** Passenger_ID (FK)
- **Relationships:**
  - **Booked by** → Passenger (N:1)
  - **Linked to** → Train (M:N via Linked_To junction)
  - **Logged in** → Ticket_Audit_Log (1:N)

**Business Rules:**
- Journey_Date cannot be in past
- Journey_Date cannot be > 120 days from current date
- Fare auto-applies 40% discount for passengers aged 60+
- Status auto-changes to "Waiting" when train capacity is full

---

### 4. **TRAIN** (Strong Entity)
- **Primary Key:** Train_ID (PK)
- **Attributes:** 
  - Train_Name (Rajdhani, Shatabdi, Express names)
  - Train_Number (Unique 5-digit code like 12951)
  - Capacity (Total passenger capacity)
  - Total_Coaches (Number of coaches)
  - Train_Type (Rajdhani, Shatabdi, Express, Superfast, Mail, Local)
- **Relationships:**
  - **Carries** → Ticket (M:N via Linked_To junction)
  - **Follows** → Route (M:N via Follows junction)
  - **Operated by** → Loco_Pilot (M:N via Operates junction)
  - **Has** → Train_Schedule (1:N)

**Business Rules:**
- Train_Number must be unique
- Capacity must be > 0
- Each train must follow at least one route

---

### 5. **ROUTE** (Strong Entity)
- **Primary Key:** Route_ID (PK)
- **Attributes:** 
  - Route_Name (e.g., "New Delhi - Mumbai Route")
  - Start_Station (Origin station name)
  - End_Station (Destination station name)
  - Distance_KM (Total route distance in kilometers)
  - Route_Type (Rajdhani Express, Shatabdi Express, Superfast, Mail Express, Express)
- **Relationships:**
  - **Followed by** → Train (M:N via Follows junction)
  - **Consists of** → Station (M:N via Consists_Of junction)

**Business Rules:**
- Distance_KM must be > 0
- Start_Station ≠ End_Station
- Route must pass through at least 2 stations

---

### 6. **STATION** (Strong Entity)
- **Primary Key:** Station_ID (PK)
- **Attributes:** 
  - Name (Full station name like "New Delhi")
  - Location (City/State)
  - Station_Code (Unique 3-5 letter code like NDLS, BCT, MAS)
  - Platform_Count (Number of platforms)
- **Relationships:**
  - **Part of** → Route (M:N via Consists_Of junction)
  - **Assigned to** → Loco_Pilot (1:N) - Pilots are stationed here
  - **Scheduled in** → Train_Schedule (1:N)

**Business Rules:**
- Station_Code must be unique
- Platform_Count must be ≥ 1
- Cannot delete station with active bookings

---

### 7. **EMPLOYEE (LOCO_PILOT)** (Strong Entity)
- **Primary Key:** Emp_ID / Loco_Pilot_ID (PK)
- **Attributes:** 
  - Name (Pilot's full name)
  - Role (Senior Driver, Assistant Driver, Trainee)
  - Age (Must be between 25-60)
  - License_Number (Unique pilot license)
  - Experience_Years (Years of experience)
- **Foreign Keys:** Assigned_ID / Station_ID (FK)
- **Relationships:**
  - **Assigned to** → Station (N:1) - Home station
  - **Operates** → Train (M:N via Operates junction)

**Business Rules:**
- Age must be between 25 and 60 years
- License_Number must be unique
- Must be assigned to exactly one home station

---

### 8. **TRAIN_SCHEDULE** (Weak Entity)
- **Primary Key:** Schedule_ID (PK)
- **Attributes:** 
  - Arrival_Time (Time train arrives at station)
  - Departure_Time (Time train departs from station)
  - Platform_Number (Assigned platform)
  - Stop_Number (Sequence of stop on route)
  - Distance_From_Source (KM from starting station)
- **Foreign Keys:** Train_ID (FK), Station_ID (FK)
- **Relationships:**
  - **Belongs to** → Train (N:1)
  - **At** → Station (N:1)

**Business Rules:**
- First stop has Arrival_Time = NULL
- Last stop has Departure_Time = NULL
- Arrival_Time < Departure_Time for intermediate stops
- Stop_Number must be sequential

---

### 9. **TICKET_AUDIT_LOG** (Audit Entity)
- **Primary Key:** Log_ID (PK)
- **Attributes:** 
  - Action_Type (INSERT, UPDATE, CANCEL)
  - Old_Status (Previous ticket status)
  - New_Status (New ticket status)
  - Changed_By (User who made change)
  - Changed_At (Timestamp of change)
- **Foreign Keys:** Ticket_ID (FK)
- **Purpose:** Track all changes to tickets for compliance and audit

---

## ASSOCIATIVE (JUNCTION) TABLES

### 1. **PASSENGER_SMARTCARD** (M:N Relationship)
- **Composite Primary Key:** (Passenger_ID, Card_ID)
- **Purpose:** Links passengers with their smartcards

### 2. **LINKED_TO** (M:N Relationship)
- **Composite Primary Key:** (Ticket_ID, Train_ID)
- **Purpose:** Links tickets to trains

### 3. **FOLLOWS** (M:N Relationship)
- **Composite Primary Key:** (Train_ID, Route_ID)
- **Purpose:** Links trains to routes they follow

### 4. **CONSISTS_OF** (M:N Relationship)
- **Composite Primary Key:** (Route_ID, Station_ID)
- **Attributes:** Stop_Sequence, Distance_From_Start
- **Purpose:** Links routes to stations they pass through

### 5. **OPERATES** (M:N Relationship)
- **Composite Primary Key:** (Loco_Pilot_ID, Train_ID)
- **Attributes:** Duty_Date, Shift
- **Purpose:** Links loco pilots to trains they operate

---

## CARDINALITY SUMMARY

| Relationship | Entity 1 | Cardinality | Entity 2 |
|--------------|----------|-------------|----------|
| Books | PASSENGER | 1:N | TICKET |
| Has | PASSENGER | M:N | SMARTCARD |
| Assigned to | TICKET | M:N | TRAIN |
| Follows | TRAIN | M:N | ROUTE |
| Scheduled at | TRAIN | 1:N | TRAIN_SCHEDULE |
| Located at | TRAIN_SCHEDULE | N:1 | STATION |
| Passes through | ROUTE | M:N | STATION |
| Assigned to | LOCO_PILOT | N:1 | STATION |
| Operates | LOCO_PILOT | M:N | TRAIN |
| Logs | TICKET | 1:N | TICKET_AUDIT_LOG |

---

## KEY FEATURES OF THE SYSTEM

1. **Passenger Management**: Track passenger details, contact info, age (for discounts)
2. **Smartcard System**: Prepaid cards with balance tracking for frequent travelers
3. **Ticket Booking**: Complete ticket management with PNR, class, seat, coach details
4. **Train Management**: Train details with capacity, coaches, train numbers
5. **Route Planning**: Routes connecting multiple stations with distances
6. **Station Network**: Station details with platforms and locations
7. **Crew Management**: Loco pilot tracking with licensing and experience
8. **Schedule Management**: Detailed train schedules with arrival/departure times
9. **Audit Trail**: Complete logging of ticket modifications for accountability

---

## ENTITY TYPES

- **Strong Entities:** Passenger, Smartcard, Ticket, Train, Route, Station, Loco_Pilot
- **Weak Entity:** Train_Schedule (depends on Train and Station)
- **Associative Entities:** Passenger_Smartcard, Linked_To, Follows, Consists_Of, Operates
- **Audit Entity:** Ticket_Audit_Log

---

## CONSTRAINTS & BUSINESS RULES

1. **Passenger** must have at least Name and Contact_No
2. **Smartcard** must have unique Card_Number and valid expiry date
3. **Ticket** must have unique PNR_Number
4. **Train** must have unique Train_Number
5. **Station** must have unique Station_Code
6. **Loco_Pilot** must have unique License_Number
7. **Passenger Age** must be between 0-120 (validated by trigger)
8. **Loco Pilot Age** must be between 25-60 (validated by trigger)
9. **Smartcard Balance** must be sufficient for ticket booking (validated by trigger)
10. **Journey Date** cannot be in past or more than 120 days in future (validated by trigger)

---

## ER DIAGRAM SYMBOLS LEGEND

```
┌─────────┐
│ ENTITY  │  = Rectangle (Strong Entity)
└─────────┘

◄────────►  = Many-to-Many Relationship (M:N)

    │
    ▼       = One-to-Many Relationship (1:N)

PK          = Primary Key
FK          = Foreign Key
```

---

## DATABASE NORMALIZATION

This database design is in **3rd Normal Form (3NF)**:
- ✅ No repeating groups (1NF)
- ✅ All non-key attributes depend on the whole primary key (2NF)
- ✅ No transitive dependencies (3NF)

---

**Total Tables:** 14 (9 Main Tables + 5 Associative Tables)
**Total Relationships:** 9 Major Relationships
**Foreign Keys:** 15+
**Junction Tables:** 5

---
