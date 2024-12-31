const express = require('express');
const auth = require('../../middleware/auth');
const healthcheckController = require('../../controllers/healthcheck');

const router = express.Router();

router.get('/', auth, healthcheckController.getHealthcheck);

module.exports = router;