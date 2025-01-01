const express = require('express');
const healthcheckController = require('../../controllers/healthcheck');

const router = express.Router();

router.get('/', authenticate, healthcheckController.getHealthcheck);

module.exports = router;