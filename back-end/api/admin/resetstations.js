const express = require('express');
const resetstationsController = require('../../controllers/resetstations');

const router = express.Router();

router.post('/', authenticate, resetstationsController.reset);

module.exports = router;