const axios = require('../utils/axiosInstance');
const fs = require('fs');
const {TOKEN_PATH} = require('../utils/token');

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