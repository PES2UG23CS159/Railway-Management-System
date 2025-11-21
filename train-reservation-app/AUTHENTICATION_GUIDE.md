# 🚂 Railway Reservation System - Authentication Guide

## ✅ What's Been Implemented

### 1. Database Changes
- ✅ Added `Password VARCHAR(255)` column to Passenger table
- ✅ Updated all sample passengers with password: `pass123`
- ✅ SQL migration file created for easy database update

### 2. Backend (Node.js/Express)
- ✅ Authentication controller (`authController.js`)
  - `register()` - Create new passenger account
  - `login()` - Authenticate passenger
  - `getCurrentUser()` - Get user by ID
- ✅ Authentication routes (`authRoutes.js`)
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/auth/user/:id`
- ✅ Routes mounted in `server.js`

### 3. Frontend (React)
- ✅ Login page (`Login.js`)
  - Role selection: Passenger or Admin
  - Admin: Hardcoded credentials
  - Passenger: Database validation
- ✅ Register page (`Register.js`)
  - Full registration form with validation
  - Password confirmation
- ✅ Updated Navbar
  - Shows Login/Register when logged out
  - Shows username and Logout button when logged in
  - Admin menu only visible to admin users
- ✅ Protected admin route in App.js
- ✅ Auto-updates navbar on login/logout

---

## 🔑 Login Credentials

### Admin Login
- **Email:** `admin@railway.com`
- **Password:** `admin123`
- **Access:** Admin Dashboard with Passengers, Trains, Stations management

### Passenger Login (Sample Accounts)
All passengers have password: `pass123`

1. **Rajesh Kumar**
   - Email: `rajesh.kumar@email.com`
   - Password: `pass123`

2. **Priya Sharma**
   - Email: `priya.sharma@email.com`
   - Password: `pass123`

3. **Amit Patel**
   - Email: `amit.patel@email.com`
   - Password: `pass123`

4. **Sneha Reddy**
   - Email: `sneha.reddy@email.com`
   - Password: `pass123`

5. **Vikram Singh**
   - Email: `vikram.singh@email.com`
   - Password: `pass123`

---

## 📋 Steps to Run the Application

### Step 1: Update Database
You need to add the Password column to your existing database.

**Option A - Migration Script (Recommended):**
```sql
-- Run this file in MySQL Workbench
SOURCE C:/Users/yoges/OneDrive/Desktop/project dbms/train-reservation-app/backend/database/add_password_column.sql
```

**Option B - Recreate Database:**
```sql
-- Drop existing database
DROP DATABASE IF EXISTS train_reservation;

-- Import the updated tables_only.sql file
SOURCE C:/Users/yoges/OneDrive/Desktop/project dbms/train-reservation-app/backend/database/tables_only.sql
```

### Step 2: Start Backend Server
```powershell
cd "C:\Users\yoges\OneDrive\Desktop\project dbms\train-reservation-app\backend"
node server.js
```
✅ Backend should run on: http://localhost:5000

### Step 3: Start Frontend
```powershell
cd "C:\Users\yoges\OneDrive\Desktop\project dbms\train-reservation-app\frontend"
npm start
```
✅ Frontend should run on: http://localhost:3000

---

## 🧪 Testing the Authentication System

### Test 1: Register New Passenger
1. Navigate to http://localhost:3000
2. Click **"Login / Register"** in navbar
3. Click **"Register here"** link at bottom
4. Fill in registration form:
   - Name: Your Name
   - Email: your.email@test.com
   - Password: minimum 6 characters
   - Confirm Password: must match
   - Age, Gender, Contact
5. Click **Register**
6. Should redirect to Login page with success message

### Test 2: Login as Passenger
1. Go to http://localhost:3000/login
2. Select **"👤 Passenger"** radio button
3. Enter email: `rajesh.kumar@email.com`
4. Enter password: `pass123`
5. Click **Login**
6. Should redirect to Home page
7. Navbar should show: **"👤 Rajesh Kumar"** and **"Logout"** button

### Test 3: Login as Admin
1. Go to http://localhost:3000/login
2. Select **"👨‍💼 Admin"** radio button
3. Enter email: `admin@railway.com`
4. Enter password: `admin123`
5. Click **Login**
6. Should redirect to Admin Dashboard
7. Navbar should show: **"👤 Admin"**, **"👨‍💼 Admin"** link, and **"Logout"** button

### Test 4: Access Control
1. Login as passenger
2. Try to access http://localhost:3000/admin
3. Should redirect to Login page (admin access only)

### Test 5: Logout
1. While logged in, click **"Logout"** button in navbar
2. Should redirect to Login page
3. Navbar should show **"Login / Register"** link again

---

## 🎯 User Flows

### Passenger Flow
```
Visit Site → Login/Register → Login as Passenger
    ↓
Home Page (Search trains, view features)
    ↓
Search Trains → Book Ticket (with passenger name)
    ↓
My Tickets (View, Cancel, Search by PNR)
    ↓
Profile (View info, Recharge railway card)
    ↓
Fare Calculator (Calculate fares)
    ↓
Logout
```

### Admin Flow
```
Visit Site → Login → Login as Admin
    ↓
Admin Dashboard
    ↓
View Statistics (Total Passengers, Trains, Stations, Bookings)
    ↓
Manage Passengers (View all passengers)
    ↓
Manage Trains (View all trains)
    ↓
Manage Stations (View all stations)
    ↓
Logout
```

---

## 🔧 How Authentication Works

### Session Management
- Uses **localStorage** to store user data
- User object stored as JSON:
  ```javascript
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    role: "passenger" // or "admin"
  }
  ```
- Custom event `loginStateChange` triggers navbar update
- Logout clears localStorage and redirects to login

### Admin Authentication
- **Hardcoded in frontend** (Login.js)
- No database check for admin
- Simple email/password comparison
- Admin credentials:
  - Email: `admin@railway.com`
  - Password: `admin123`

### Passenger Authentication
- **Database validation** via backend API
- POST request to `/api/auth/login`
- Backend checks: `WHERE Email = ? AND Password = ?`
- Returns user data (without password)
- Stores in localStorage with role: "passenger"

### Registration
- **Passengers only** (no admin registration)
- Validates form data in frontend
- POST request to `/api/auth/register`
- Backend checks for existing email
- Inserts new passenger record
- Redirects to login page

---

## 📁 File Structure

```
train-reservation-app/
├── backend/
│   ├── controllers/
│   │   └── authController.js       ✅ NEW - Login/register logic
│   ├── routes/
│   │   └── authRoutes.js          ✅ NEW - Auth API endpoints
│   ├── database/
│   │   ├── tables_only.sql        ✅ UPDATED - Added Password column
│   │   └── add_password_column.sql ✅ NEW - Migration script
│   └── server.js                   ✅ UPDATED - Added auth routes
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js           ✅ NEW - Login page
│   │   │   └── Register.js        ✅ NEW - Registration page
│   │   ├── components/
│   │   │   └── Navbar.js          ✅ UPDATED - Login/Logout UI
│   │   └── App.js                 ✅ UPDATED - Added login/register routes
```

---

## 🚨 Important Notes

### Security
- ⚠️ **Passwords stored in plain text** - For demo purposes only!
- ⚠️ In production, use **bcrypt** to hash passwords
- ⚠️ Admin credentials hardcoded in frontend - Not secure for production
- ⚠️ No JWT tokens - Using localStorage (vulnerable to XSS)

### Database
- ✅ Must run migration script or reimport tables_only.sql
- ✅ Password column added to Passenger table
- ✅ All existing passengers have password: `pass123`

### Functionality
- ✅ Role-based access control (Passenger vs Admin)
- ✅ Protected admin routes
- ✅ Navbar updates automatically on login/logout
- ✅ Login state persists across page refreshes (localStorage)
- ✅ Registration validates email uniqueness

---

## 🎓 Demo Script

### For Presentation:

1. **Show Registration**
   - "Let me register as a new passenger"
   - Fill form and register
   - "System validates and creates account"

2. **Show Passenger Login**
   - "Now I'll login with my credentials"
   - Login with registered account or sample passenger
   - "Notice the navbar shows my name and logout button"

3. **Show Passenger Features**
   - Search trains
   - Book ticket (with passenger name input)
   - View my tickets (with filters)
   - Check profile and recharge card
   - Calculate fares

4. **Logout and Switch to Admin**
   - Click logout
   - "Now let me login as admin"
   - Select Admin role
   - Enter admin credentials
   - "Admin gets access to dashboard"

5. **Show Admin Features**
   - View statistics
   - Manage passengers (view all)
   - Manage trains
   - Manage stations

6. **Highlight Security**
   - "Passengers cannot access admin dashboard"
   - "Role-based access control"
   - "Session management with logout"

---

## 📞 Support

If something doesn't work:

1. **Check database** - Make sure Password column exists
2. **Check backend** - Should be running on port 5000
3. **Check frontend** - Should be running on port 3000
4. **Check console** - Look for error messages in browser console
5. **Check terminal** - Look for errors in backend terminal

Good luck with your demo! 🚀
