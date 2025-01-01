const express = require('express');
const addpassesController = require('../../controllers/addpasses');

const router = express.Router();

router.post('/', authenticate, addpassesController.addPasses);

module.exports = router;