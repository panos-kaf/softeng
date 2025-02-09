const express = require('express');
const cors = require('cors');

const authenticate = require('./middleware/auth');

const loginRouter = require('./api/log');
const apiRouter = require('./api/index');

const HOST_IP = process.env.HOST_IP;
const FRONT_PORT = process.env.FRONTEND_PORT;
const LAN_ORIGIN = `https://${HOST_IP}:${FRONT_PORT}`;
const LOCALHOST_ORIGIN = `https://localhost:${FRONT_PORT}`;

const app = express();

require('./cron/scheduleJobs');

app.use(cors({
<<<<<<< HEAD
    origin: LAN_ORIGIN,
=======
    origin: [LAN_ORIGIN, LOCALHOST_ORIGIN, `https://${LAN_HOSTNAME}:${FRONT_PORT}`],
    //origin: "https://192.168.2.5:9000", // Αυτο το εχω βαλει για να μην το προσθέτω κάθε φορά που κάνω pull
>>>>>>> 7ac620b3462fe9f23e2570510bbd5932a2c5fb62
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