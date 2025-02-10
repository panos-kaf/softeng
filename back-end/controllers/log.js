const db = require('../utils/db');
const bcrypt = require('bcrypt');
const {logToFile, logToBoth, logToBothErr} = require('../utils/logToFile');
const jwt = require('jsonwebtoken');

exports.getAll = async (req, res) => {
    res.status(200).json({ message: 'Hi' });
};

exports.in = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Query the database for the user
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: `User '${username}' does not exist.` });
        }
        
        // ------------------------------------------------------
        // encrypt bug check password
        logToFile(`Username από frontend: ${username}`);
        logToFile(`Password από frontend: ${password}`);
        logToFile(`Hashed password από DB: ${user.password}`);
        //-------------------------------------------------------

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logToBoth(`wrong password: ${password}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' } // Token expires in 1 hour
        );

        res.cookie('token', token, {
            httpOnly: true,  // Prevents client-side access to the cookie
            secure: true,    // Ensures cookie is only sent over HTTPS
            sameSite: 'None', // Allows cross-origin requests with credentials
            maxAge: 12 * 60 * 60 * 1000,  // Cookie expiration (12 hours)
        });

        res.status(200).json({ token, role: user.role, operator_name: user.username}); // Κρατάμε και τον ρόλο για τα end points στο front end
    } catch (err) {
        logToBothErr(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.out = async (req, res) => {
    res.status(200).send();
}