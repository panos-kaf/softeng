const express = require('express');
const authenticate = require('../../middleware/auth');
const addpassesController = require('../../controllers/addpasses');

const router = express.Router();

router.post('/', authenticate, addpassesController.addPasses);

module.exports = router;