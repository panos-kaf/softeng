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
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );
        console.log('User created successfully with ID:', result.insertId);
    } catch (err) {
        console.error(`Error creating user ${username}:`, err.message);
    }
}

// Function to create multiple users in sequence
async function createUsers() {
    const users = [
        ['admin', 'admin', 'admin'],
        ['aegeanmotorway', 'aegeanmotorway', 'user'],
        ['egnatia', 'egnatia', 'user'],
        ['gefyra', 'gefyra', 'user'],
        ['kentrikiodos', 'kentrikiodos', 'user'],
        ['moreas', 'moreas', 'user'],
        ['naodos', 'naodos', 'user'],
        ['neaodos', 'neaodos', 'user'],
        ['olympiaodos', 'olympiaodos', 'user'],
    ];

    for (const [username, password, role] of users) {
        await createUser(username, password, role);
    }

    // Close the connection pool **after all users are created**
    await pool.end();
    console.log('Database connection pool closed.');
}

// Call the function to create users
createUsers();