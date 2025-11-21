const express = require('express');
const router = express.Router();
const passengerController = require('../controllers/passengerController');

// GET all passengers
router.get('/', passengerController.getAllPassengers);

// GET passenger by ID
router.get('/:id', passengerController.getPassengerById);

// GET passenger bookings
router.get('/:id/bookings', passengerController.getPassengerBookings);

// GET railway card
router.get('/:id/card', passengerController.getRailwayCard);

// POST recharge railway card
router.post('/:id/recharge', passengerController.rechargeCard);

// POST create new passenger
router.post('/', passengerController.createPassenger);

// PUT update passenger
router.put('/:id', passengerController.updatePassenger);

// DELETE passenger
router.delete('/:id', passengerController.deletePassenger);

// GET passenger bookings
router.get('/:id/bookings', passengerController.getPassengerBookings);

module.exports = router;
