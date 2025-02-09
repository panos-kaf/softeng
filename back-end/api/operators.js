const express = require('express');
const authenticate = require('../middleware/auth');
const operatorsController = require('../controllers/operators');

const router = express.Router();

router.get('/', authenticate, operatorsController.getOperators);

module.exports = router;