const express = require('express');
const router = express.Router();

const tollStationPassesRouter = require('./tollStationPasses');
const passAnalysisRouter = require('./passAnalysis');
const passesCostRouter = require('./passesCost');
const chargesByRouter = require('./chargesBy');

router.use('/tollStationPasses', tollStationPassesRouter);
router.use('/passAnalysis', passAnalysisRouter);
router.use('/passesCost', passesCostRouter);
router.use('/chargesBy', chargesByRouter);

module.exports = router;