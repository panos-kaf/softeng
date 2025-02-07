const express = require('express');
const paymentsController = require('../controllers/payments');

const router = express.Router();

router.get('/', paymentsController.getAll);
router.get('/:OpID', paymentsController.makePayment);

module.exports = router;