const express = require('express');
const authenticate = require('../../middleware/auth');
const createuserController = require('../../controllers/createuser');

const router = express.Router();

router.post('/', authenticate, createuserController.createuser);

module.exports = router;