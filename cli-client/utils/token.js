// utils/token.js
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(__dirname, '../token.json'); // Path to store the token

// Read the token from the file
const getToken = () => {
  try {
    if (!fs.existsSync(TOKEN_PATH)) return null;

    const data = fs.readFileSync(TOKEN_PATH, 'utf-8').trim();
    if (!data) return null;

    const parsedData = JSON.parse(data);
    return parsedData.token || null;
  } catch (error) {
    console.error("Error reading token:", error.message);
    return null;
  }
};

module.exports = {getToken, TOKEN_PATH};