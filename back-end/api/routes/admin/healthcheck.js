const express = require('express');
const authenticate = require('../../../middleware/auth');
const healthcheckController = require('../../../controllers/healthcheck');

const router = express.Router();

router.get('/', authenticate, healthcheckController.getHealthcheck);

module.exports = router;