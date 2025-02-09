const axios = require('../utils/axiosInstance');
const {getToken} = require('../utils/token');

const HOST = process.env.HOST_IP;
const PORT = process.env.HTTPS_PORT;

module.exports = (program) => {
    program
  .command('healthcheck')
  .description('Check the database connection status')
  .option('-f, --format <format>', 'Specify the output format (json or csv)', (value) => {

    if (!validFormats.includes(value.toLowerCase())) {
      throw new Error('Invalid format! Use "json" or "csv".');
    }
    return value.toLowerCase();
  }, 'csv')
  .action(async (options) => {
    try {
      const { format } = options;

      const token = getToken();

      // Send format as a query parameter
      const response = await axios.get(`${ADMIN_ROUTE}/healthcheck`, {
        params: { format },
        headers: { 'x-observatory-auth': token}}
      );

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('Healthcheck failed:', error.response?.data || error.message);
      }
  });

};