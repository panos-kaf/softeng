const express = require('express');
const authenticate = require('../../middleware/auth');
const resetpassesController = require('../../controllers/resetpasses');

const router = express.Router();

router.post('/', authenticate, resetpassesController.resetPasses);

module.exports = router;