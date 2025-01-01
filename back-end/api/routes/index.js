const express = require('express');
const router = express.Router();

const tollStationPassesRouter = require('./api/routes/tollStationPasses.js');
const passAnalysisRouter = require('./api/routes/passAnalysis');
const passesCostRouter = require('./api/routes/passesCost');
const chargesByRouter = require('./api/routes/chargesBy');

router.use('/healthcheck', healthcheckRouter);
router.use('/resetStations', resetStationsRouter);
router.use('/resetPasses', resetPassesRouter);
router.use('/addPasses', addPassesRouter);

module.exports = router;