const express = require('express');
const dashboardController = require('../controllers/dashboard');

const router = express.Router();

router.post("/", dashboardController.getDashboardStats);

module.exports = router;
