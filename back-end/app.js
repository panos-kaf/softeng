const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authenticate = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');

const loginRouter = require('./api/routes/log');
const mainRouter = require('./api/routes/index');
const adminRouter = require('./api/admin/index');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Mount routers
app.use('/', loginRouter);
app.use('/admin', authenticate, adminAuth, adminRouter);
app.use('/routes', authenticate, mainRouter);

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