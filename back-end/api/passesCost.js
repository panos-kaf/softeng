const express = require('express');
const passesCostController = require('../controllers/passesCost');

const router = express.Router();

router.get('/', passesCostController.getAll);
router.get('/:tollOpID/:tagOpID/:date_from/:date_to', passesCostController.getPassesCost);

module.exports = router;