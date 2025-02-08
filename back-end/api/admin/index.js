const express = require('express');
const router = express.Router();

const healthcheckRouter = require('./healthcheck');
const resetstationsRouter = require('./resetstations');
const resetpassesRouter = require('./resetpasses');
const addpassesRouter = require('./addpasses');
const createuserRouter = require('./createuser');
const operatorsRouter = require('./operators');

router.use('/healthcheck', healthcheckRouter);
router.use('/resetstations', resetstationsRouter);
router.use('/resetpasses', resetpassesRouter);
router.use('/addpasses', addpassesRouter);
router.use('/createuser', createuserRouter);
router.use('/operators', operatorsRouter);

module.exports = router;