const express = require("express");
const authenticate = require("../middleware/auth"); // Προστασία με JWT token
const { getTollStations } = require("../controllers/tollStations");

const router = express.Router();

// Endpoint: GET /api/tollStations
router.get("/", authenticate, getTollStations);

module.exports = router;
