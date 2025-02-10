const express = require('express');
const debtCalculatorController = require('../controllers/debtCalculator');

const router = express.Router();

<<<<<<< HEAD
router.get('/:month_year', debtCalculatorController.getDebt);
=======
router.get('/:operatorID/:date_from/:date_to', debtCalculatorController.getDebt);
>>>>>>> 556345e33a08e5680a80ddee204a7ae0220d3e3a

router.all('*', (req, res)=>
    res.status(404).json({ error: "Invalid endpoint"})
)

module.exports = router;
