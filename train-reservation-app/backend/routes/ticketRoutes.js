const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// GET all tickets
router.get('/', ticketController.getAllTickets);

// GET ticket by ID
router.get('/:id', ticketController.getTicketById);

// POST book new ticket
router.post('/', ticketController.bookTicket);

// PUT update ticket
router.put('/:id', ticketController.updateTicket);

// PUT cancel ticket
router.put('/:id/cancel', ticketController.cancelTicket);

module.exports = router;
