const express = require('express');
const dashboardController = require('../controllers/dashboard');

const router = express.Router();

router.get("/api", dashboardController.getDashboardStats);

module.exports = router;
