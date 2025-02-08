const express = require("express");
const authenticate = require("../middleware/auth"); // Προστασία με JWT token
const tollStations = require("../controllers/tollstations");

const router = express.Router();

// Endpoint: GET /api/tollStations
router.get("/", authenticate, tollstations.getTollStations);

module.exports = router;
