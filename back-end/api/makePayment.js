const express = require('express');
const makePaymentController = require('../controllers/makePayment');

const router = express.Router();

router.post('/', makePaymentController.makePayment);

module.exports = router;