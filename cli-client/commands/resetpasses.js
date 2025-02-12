const axios = require('../utils/axiosInstance');
const {getToken} = require('../utils/token');
const {ADMIN_ROUTE} = require('../utils/routes');

const validFormats = ['json', 'csv']; // Define valid formats here based on your API's requirements

module.exports = (program) => {
    program
  .command('resetpasses')
  .description('Initialise passes')
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
      const response = await axios.post(`${ADMIN_ROUTE}/resetpasses`, 
        {},{
        params: { format },
        headers: { 'x-observatory-auth': token }
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('ResetPasses failed:', error.response?.data || error.message);
    
    }
  });
};