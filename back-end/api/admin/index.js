const express = require('express');
const router = express.Router();

const healthcheckRouter = require('./healthcheck');
const resetStationsRouter = require('./resetstations');
const resetPassesRouter = require('./resetpasses');
const addPassesRouter = require('./addpasses');

router.use('/healthcheck', healthcheckRouter);
router.use('/resetStations', resetStationsRouter);
router.use('/resetPasses', resetPassesRouter);
router.use('/addPasses', addPassesRouter);

module.exports = router;