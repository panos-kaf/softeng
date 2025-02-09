const axios = require('../utils/axiosInstance');
const {getToken} = require('../utils/token');
const {API_ROUTE} = require('../utils/routes');

module.exports = (program) => {
    program
    .command('tollstationpasses')
    .description('Analize passes according to station and period')
    .option('-s, --station <station>', 'Specify the stationID')
    .option('-r, --from <from> ', 'Specify the starting date (datefrom)')
    .option('-t, --to <to>', 'Specify the ending date (dateto)')
    .option('-f, --format <format>', 'Specify the output format (json or csv)', (value) => {
      
      if (!validFormats.includes(value.toLowerCase())) {
        throw new Error('Invalid format! Use "json" or "csv".');
      }
      return value.toLowerCase();
    }, 'csv')
    .action(async (options) => {
      try {
  
        const token = getToken(); // Retrieve the token
  
        const { station, from, to, format } = options;
  
        if (!station) {
          console.error('Please provide a station using --station.');
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
  
        // Send format as a query parameter
  
        const response = await axios.get(`${API_ROUTE}/tollStationPasses`, {
          params: { station, from, to, format },
          headers: { 'x-observatory-auth': token } //  Send token in the request
        });
  
        console.log(response.data); // API already returns the correct format
      } catch (error) {
        console.error('TollStationPasses failed:', error.response?.data || error.message);
  
      }
    });
};