# Train Reservation System - Full Stack Project

## Project Overview
A complete Train Reservation Management System with frontend (React) and backend (Node.js/Express) connecting to MySQL database.

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **React Router** - Navigation
- **Bootstrap/Tailwind CSS** - Styling

### Database
- **MySQL** - Relational database

---

## Project Structure

```
train-reservation-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── passengerController.js
│   │   ├── ticketController.js
│   │   ├── trainController.js
│   │   ├── routeController.js
│   │   ├── stationController.js
│   │   └── smartcardController.js
│   ├── routes/
│   │   ├── passengerRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── trainRoutes.js
│   │   ├── routeRoutes.js
│   │   ├── stationRoutes.js
│   │   └── smartcardRoutes.js
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── models/                  # SQL queries (optional)
│   ├── .env                     # Environment variables
│   ├── server.js                # Main server file
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── PassengerList.js
│   │   │   ├── TicketBooking.js
│   │   │   ├── TrainList.js
│   │   │   ├── RouteList.js
│   │   │   └── SmartcardManagement.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── services/
│   │   │   └── api.js           # API calls
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL Server
- npm or yarn

### 1. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE train_reservation;

# Run the SQL schema
mysql -u root -p train_reservation < tables_only.sql
```

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with your credentials
# (See backend/.env.example)

# Start the server
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend will run on: `http://localhost:3000`

---

## API Endpoints

### Passengers
- `GET /api/passengers` - Get all passengers
- `GET /api/passengers/:id` - Get passenger by ID
- `POST /api/passengers` - Create new passenger
- `PUT /api/passengers/:id` - Update passenger
- `DELETE /api/passengers/:id` - Delete passenger

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Book new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Cancel ticket

### Trains
- `GET /api/trains` - Get all trains
- `GET /api/trains/:id` - Get train by ID
- `POST /api/trains` - Add new train
- `PUT /api/trains/:id` - Update train
- `DELETE /api/trains/:id` - Delete train

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route by ID
- `POST /api/routes` - Add new route

### Stations
- `GET /api/stations` - Get all stations
- `GET /api/stations/:id` - Get station by ID
- `POST /api/stations` - Add new station

### Smartcards
- `GET /api/smartcards` - Get all smartcards
- `GET /api/smartcards/passenger/:id` - Get smartcard by passenger
- `POST /api/smartcards` - Issue new smartcard
- `PUT /api/smartcards/:id/recharge` - Recharge smartcard

---

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=train_reservation
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Features to Implement

### Phase 1 - Basic CRUD
- ✅ Passenger Management
- ✅ Ticket Booking
- ✅ Train Management
- ✅ Route Management
- ✅ Station Management
- ✅ Smartcard Management

### Phase 2 - Advanced Features
- [ ] User Authentication (Login/Register)
- [ ] Search Trains by Route
- [ ] Real-time Seat Availability
- [ ] Smartcard Balance Check
- [ ] Booking History
- [ ] Senior Citizen Discount (Auto-apply)

### Phase 3 - Enhanced Features
- [ ] Payment Gateway Integration
- [ ] Email/SMS Notifications
- [ ] Train Schedule Display
- [ ] Route Map Visualization
- [ ] Admin Dashboard
- [ ] Reports & Analytics

---

## Development Tips

1. **Start with Backend**: Set up all API endpoints first
2. **Test with Postman**: Test each endpoint before connecting frontend
3. **Use React Hooks**: useState, useEffect for state management
4. **Error Handling**: Implement proper error messages
5. **Validation**: Validate inputs on both frontend and backend
6. **Security**: Never commit .env files to Git

---

## Troubleshooting

### Database Connection Issues
- Check MySQL is running
- Verify credentials in .env
- Check port 3306 is not blocked

### CORS Errors
- Ensure CORS is enabled in backend
- Check frontend API URL is correct

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

---

## Contributing
This is a student project for DBMS course.

---

## License
MIT License - Educational Project

---

## Contact
For questions or issues, contact your project team.
