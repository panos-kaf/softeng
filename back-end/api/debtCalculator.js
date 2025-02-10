const express = require('express');
const debtCalculatorController = require('../controllers/debtCalculator');

const router = express.Router();

router.get('/', debtCalculatorController.getAll);
router.get('/:operatorID/:date_from/:date_to', debtCalculatorController.getDebt);

router.all('*', (req, res)=>
    res.status(404).json({ error: "Invalid endpoint"})
)

module.exports = router;
