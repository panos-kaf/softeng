const express = require('express');
const auth = require('../../middleware/auth');
const tollStationPassesController = require('../../controllers/tollStationPasses');

const router = express.Router();

router.get('/', auth, tollStationPassesController.getAll);
router.get('/:tollStationID/:date_from/:date_to', auth, tollStationPassesController.getPassesInDateRange);

module.exports = router;