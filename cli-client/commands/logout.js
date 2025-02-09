const axios = require('../utils/axiosInstance');
const fs = require('fs');
const {TOKEN_PATH} = require('../utils/token');

const HOST = process.env.HOST_IP;
const PORT = process.env.HTTPS_PORT;

module.exports = (program) => {
      program
      .command('logout')
      .description('Clear the stored token')
      .action(() => {
        if (fs.existsSync(TOKEN_PATH)) {
          fs.unlinkSync(TOKEN_PATH);
        }
        console.log('Logout successful! Token cleared.');
      });
};