const axios = require('../utils/axiosInstance');
const {getToken} = require('../utils/token');
const {API_ROUTE} = require('../utils/routes');

module.exports = (program) => {
    program
    .command('chargesby')
    .description('Analize passes according to station and period')
    .option('-o, --opid <opid>', 'Specify the stationop (op1)')
    .option('-f, --from <from> ', 'Specify the starting date (datefrom)')
    .option('-t, --to <to>', 'Specify the ending date (dateto)')
    .option('-f, --format <format>', 'Specify the output format (json or csv)', (value) => {
      
      if (!validFormats.includes(value.toLowerCase())) {
        throw new Error('Invalid format! Use "json" or "csv".');
      }
      return value.toLowerCase();
    }, 'csv')
    .action(async (options) => {
      try {
  
        const { opid, from, to, format} = options;
  
        if (!opid) {
          console.error('Please provide a station using --opid.');
          return;
        }
  
        if (!from) {
          console.error('Please provide a starting date using --from.');
          return;
        }
        if (!to) {
          console.error('Please provide an ending date using --to.');
          return;
        }
  
        const token = getToken();
  
        // Send format as a query parameter
        const response = await axios.get(`${API_ROUTE}/chargesBy`, {
          params: { opid, from, to, format },
          headers: { 'x-observatory-auth': token } //  Send token in the request
        });
  
        console.log(response.data); // API already returns the correct format
      } catch (error) {
        console.error('ChargesBy failed:', error.response?.data || error.message);
      }
    });
};  