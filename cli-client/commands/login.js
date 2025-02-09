const axios = require('../utils/axiosInstance');
const fs = require('fs');
const {TOKEN_PATH} = require('../utils/token');

const HOST = process.env.HOST_IP;
const PORT = process.env.HTTPS_PORT;

module.exports = (program) => {
  program
    .command('login')
    .option('-u, --username <username>', 'Enter username')
    .option('-p, --password <password>', 'Enter password')
    .description('Authenticate the user and store the token')
    .action(async (options) => {
      try {
        const { username, password } = options;
        const response = await axios.post(`https://${HOST}:${PORT}/login`, {
          username,
          password
        });

        // Extract the token from the response
        const { token } = response.data;
        if (!token) throw new Error('Authentication failed: No token received.');

        // Save the token
        fs.writeFileSync(TOKEN_PATH, JSON.stringify({ token }));
        console.log('Login successful! Token saved.');
      } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
      }
    });
};