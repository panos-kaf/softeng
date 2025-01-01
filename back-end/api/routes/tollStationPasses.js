const express = require('express');
const tollStationPassesController = require('../../controllers/tollStationPasses');

const router = express.Router();

router.get('/', tollStationPassesController.getAll);
router.get('/:tollStationID/:date_from/:date_to', tollStationPassesController.getPassesInDateRange);

module.exports = router;