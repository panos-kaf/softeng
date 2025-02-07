const express = require('express');
const cors = require('cors');

const authenticate = require('./middleware/auth');

const loginRouter = require('./api/log');
const apiRouter = require('./api/index');

const app = express();

require('./cron/scheduleJobs');

//Εγινε Αλλαγή στο παρακάτω
app.use(cors({
    origin: "https://localhost:"+process.env.FRONTEND_PORT, // Επιτρέπει requests από το Frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Mount routers
app.use('/', loginRouter);
app.use('/api', authenticate, apiRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ message });
});

app.use((req, res, next) => {
    res.status(404).json({message: 'Endpoint not implemented...'})
});

module.exports = app;