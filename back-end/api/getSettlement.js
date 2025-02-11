const express = require('express');
const getSettlementController = require('../controllers/getSettlement');

const router = express.Router();

router.get("/:fromOpID/:toOpID/:yyyymm", getSettlementController.getSettlement);

module.exports = router;
