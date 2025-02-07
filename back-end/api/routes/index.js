const express = require('express');
const adminAuth = require('../../middleware/adminAuth');
const router = express.Router();

const adminRouter = require('./admin/index');
const tollStationPassesRouter = require('./tollStationPasses');
const passAnalysisRouter = require('./passAnalysis');
const passesCostRouter = require('./passesCost');
const chargesByRouter = require('./chargesBy');
const paymentsRouter = require('./payments');

router.use('/admin', adminAuth, adminRouter);
router.use('/tollStationPasses', tollStationPassesRouter);
router.use('/passAnalysis', passAnalysisRouter);
router.use('/passesCost', passesCostRouter);
router.use('/chargesBy', chargesByRouter);
router.use('/payments', paymentsRouter);

router.all('*', (req, res)=>
    res.status(404).json({ error: "Invalid endpoint."})
)

module.exports = router;