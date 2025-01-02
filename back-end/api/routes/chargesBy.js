const express = require('express');
const chargesByController = require('../../controllers/chargesBy');

const router = express.Router();

router.get('/', chargesByController.getAll);
router.get('/:tollOpID/:date_from/:date_to', chargesByController.getChargesBy);

module.exports = router;