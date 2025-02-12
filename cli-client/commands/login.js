const axios = require('../utils/axiosInstance');
const fs = require('fs');
const {TOKEN_PATH} = require('../utils/token');
const {ROUTE} = require('../utils/routes');

module.exports = (program) => {
  program
    .command('login')
    .option('-u, --username <username>', 'Enter username')
    .option('-p, --passw <password>', 'Enter password')
    .description('Authenticate the user and store the token')
    .action(async (options) => {
      try {
        const { username, passw: password } = options;

        if(!username || !password){
          console.error('Please provide both username and password.');
          return;
        }
        
        const response = await axios.post(`${ROUTE}/login`, {
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