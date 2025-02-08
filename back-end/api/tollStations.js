const express = require("express");
const authenticate = require("../middleware/auth"); // Προστασία με JWT token
const tollStationsController = require("../controllers/tollStations");

const router = express.Router();

// Endpoint: GET /api/tollStations
router.get("/", authenticate, tollStationsController.getTollStations);

module.exports = router;