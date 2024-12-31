const express = require('express');
const auth = require('../../middleware/auth');
const passAnalysisController = require('../../controllers/passAnalysis');

const router = express.Router();

router.get('/', auth, passAnalysisController.getAll);
router.get('/:stationOpID/:tagOpID/:date_from/:date_to', auth, passAnalysisController.getPassAnalysis);

module.exports = router;