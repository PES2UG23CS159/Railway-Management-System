# Railway Management System

This repository contains a full-stack Railway Management System (Node.js + Express backend, React frontend) with MySQL database.

## Overview
- Backend: `train-reservation-app/backend` (Express, MySQL)
- Frontend: `train-reservation-app/frontend` (React)
- Database: MySQL (database name: `railway_management`)
- SQL schema and seed: `railway_management.sql`

## Prerequisites
- Node.js (16+)
- npm
- MySQL 8+
- (Optional) Git and GitHub account

## Setup — Database
1. Create a MySQL database named `railway_management`.
2. Run the SQL script to create tables and sample data:

```sql
-- from project root (or open the file in MySQL client)
SOURCE railway_management.sql;
```

Or import via MySQL Workbench / CLI.

## Setup — Backend
1. Open terminal and go to backend folder:

```powershell
cd "c:\Users\yoges\OneDrive\Desktop\project dbms\train-reservation-app\backend"
```

2. Install dependencies:

```powershell
npm install
```

3. Copy `.env.example` to `.env` and update DB credentials if needed. At minimum set:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=railway_management
PORT=5000
```

4. Start the backend server:

```powershell
node server.js
# or
npm start
```

The backend will run on `http://localhost:5000`.

## Setup — Frontend
1. Open a new terminal and go to frontend folder:

```powershell
cd "c:\Users\yoges\OneDrive\Desktop\project dbms\train-reservation-app\frontend"
```

2. Install dependencies:

```powershell
npm install
```

3. Start the React dev server:

```powershell
npm start
```

The frontend will run on `http://localhost:3000`.

## Demo Accounts
- Admin: `admin@railway.com` (login identifies admin by email; password not required for testing)
- Create passenger accounts using the Register page.

## Useful Commands
From project root (PowerShell):

```powershell
# Start backend
cd "train-reservation-app\backend" ; npm start

# Start frontend
cd "train-reservation-app\frontend" ; npm start

# Run DB restore scripts (if present)
cd "train-reservation-app\backend" ; node final_restore.js

# Run tests and checks
cd "train-reservation-app\backend" ; node test_all.js
```

## Troubleshooting
- If backend can't connect to DB, check `.env` values and ensure MySQL is running.
- If ports 3000/5000 are in use, stop other processes or change ports.

## Notes
- Password-based auth is disabled for quick testing in this copy — login uses email only. For production, implement secure password hashing and authentication.

---
If you want, I can also add a `CONTRIBUTING.md`, expand run scripts, or create a Docker setup for one-command startup. Let me know which you prefer.
