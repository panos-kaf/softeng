const express = require('express');
const passAnalysisController = require('../../controllers/passAnalysis');

const router = express.Router();

router.get('/', passAnalysisController.getAll);
router.get('/:stationOpID/:tagOpID/:date_from/:date_to', passAnalysisController.getPassAnalysis);

module.exports = router;