const express = require('express');
const log = require('../controllers/log');
const router = express.Router();

router.get('/', log.getAll);
router.post('/login', log.in);
router.post('/logout', log.out);

module.exports = router;