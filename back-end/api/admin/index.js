const express = require('express');
const router = express.Router();

const healthcheckRouter = require('./healthcheck');
const resetStationsRouter = require('./resetstations');
const resetPassesRouter = require('./resetpasses');
const addPassesRouter = require('./addpasses');

router.use('/healthcheck', healthcheckRouter);
router.use('/resetstations', resetStationsRouter);
router.use('/resetpasses', resetPassesRouter);
router.use('/addpasses', addPassesRouter);

module.exports = router;