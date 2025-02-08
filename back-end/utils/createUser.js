const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'softeng',
    password: 'root',
    port: '3306'
});

async function createUser(username, password, role = 'user') {
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt
        const [result] = await pool.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );
        console.log('User created successfully with ID:', result.insertId);
    } catch (err) {
        console.error('Error creating user:', err.message);
    } finally {
        // Close the connection pool
        await pool.end();
        console.log('Database connection pool closed.');
    }
}

// Call the function to create the user
createUser('admin', 'admin', 'admin');
createUser('aegeanmotorway', 'aegeanmotorway', 'user');
createUser('egnatia', 'egnatia', 'user');
createUser('gefyra', 'gefyra', 'user');
createUser('kentrikiodos', 'kentrikiodos', 'user');
createUser('moreas', 'moreas', 'user');
createUser('naodos', 'naodos', 'user');
createUser('neaodos', 'neaodos', 'user');
createUser('olympiaodos', 'olympiaodos', 'user');
