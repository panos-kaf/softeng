const express = require('express');
const resetpassesController = require('../../controllers/resetpasses');

const router = express.Router();

router.post('/', authenticate, resetpassesController.reset);

module.exports = router;