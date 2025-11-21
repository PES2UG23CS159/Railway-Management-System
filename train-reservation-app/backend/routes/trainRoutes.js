const express = require('express');
const router = express.Router();
const trainController = require('../controllers/trainController');

// GET all trains
router.get('/', trainController.getAllTrains);

// GET search trains (must be before /:id)
router.get('/search', trainController.searchTrains);

// GET train schedule
router.get('/:id/schedule', trainController.getTrainSchedule);

// GET train by ID
router.get('/:id', trainController.getTrainById);

// POST create new train
router.post('/', trainController.createTrain);

module.exports = router;
