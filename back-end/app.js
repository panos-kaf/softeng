const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authenticate = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');

const authRouter = require('./api/routes/auth');
const mainRouter = require('./api/routes/inxex');
const adminRouter = require('./api/admin/index');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Mount routers
app.use('/', authRouter);
app.use('/admin', authenticate, adminAuth, adminRouter);
app.use('/routes', authenticate, mainRouter);

app.use((req, res, next) => {
    res.status(404).json({message: 'Endpoint not implemented...'})
});

module.exports = app;