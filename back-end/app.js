const express = require('express');
const cors = require('cors');

const authenticate = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');

const loginRouter = require('./api/log');
const mainRouter = require('./api/routes/index');
const adminRouter = require('./api/admin/index');

const app = express();

//Εγινε Αλλαγή στο παρακάτω
app.use(cors({
    origin: "http://localhost:5173", // Επιτρέπει requests από το Frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Mount routers
app.use('/api', loginRouter);  // Έγινε αλλαγή εδώ
app.use('/api', authenticate, mainRouter);
app.use('/admin', authenticate, adminAuth, adminRouter);

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