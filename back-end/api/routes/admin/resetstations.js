const express = require('express');
const authenticate = require('../../../middleware/auth');
const resetstationsController = require('../../../controllers/resetstations');

const router = express.Router();

router.post('/', authenticate, resetstationsController.resetStations);

module.exports = router;