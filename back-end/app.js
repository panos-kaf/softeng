const express = require('express');
const cors = require('cors');

const tollStationPassesRouter = require('./api/routes/tollStationPasses.js');
const passAnalysisRouter = require('./api/routes/passAnalysis');
const passesCostRouter = require('./api/routes/passesCost');
const chargesByRouter = require('./api/routes/chargesBy');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Mount routers
app.use('/api/tollStationPasses', tollStationPassesRouter);

// 404 middleware (place this after all other routes)
app.use((req, res, next) => {
    res.status(404).json({message: 'Endpoint not implemented...'})
});

module.exports = app;