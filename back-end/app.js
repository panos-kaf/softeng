const express = require('express');
const cors = require('cors');

const tollStationPassesRouter = require('./api/routes/tollStationPasses.js');
const passAnalysisRouter = require('./api/routes/passAnalysis');
const passesCostRouter = require('./api/routes/passesCost');
const chargesByRouter = require('./api/routes/chargesBy');
const healthcheckRouter = require('./api/admin/healthcheck');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Mount routers
app.use('/api/tollStationPasses', tollStationPassesRouter);
app.use('/api/passAnalysis', passAnalysisRouter);

app.use('/admin/healthcheck', healthcheckRouter);

app.use((req, res, next) => {
    res.status(404).json({message: 'Endpoint not implemented...'})
});

module.exports = app;