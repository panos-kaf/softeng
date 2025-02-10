const db = require('../utils/db');
const {logToFile, logToBoth, logToBothErr} = require('../utils/logToFile');

const bcrypt = require('bcrypt');

exports.createuser = async(req, res, next) => {
    const { username, password, role = 'user' } = req.body;
        const connection = await db.getConnection(); // Get a connection from the pool

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash password
            await connection.beginTransaction(); // Start transaction
    
            const [result] = await connection.execute(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, role]
            );
    
            await connection.commit(); // Commit transaction if successful
            logToBoth(`User created successfully with ID: ${result.insertId}`);
            res.status(200).json({status:'OK'});
        } catch (err) {
            await connection.rollback(); // Rollback transaction on error
            logToBothErr(`Error creating user: ${err.message}`);
            res.status(400).json({'Error creating user':err.message});
        } finally {
            connection.release(); // Return connection to pool
        }
    }