const axios = require('../utils/axiosInstance');
const {getToken} = require('../utils/token');
const {API_ROUTE} = require('../utils/routes');


module.exports = (program) => {
    program
    .command('passescost')
    .description('Analize passes according to station and period')
    .option('-s, --stationop <stationop>', 'Specify the stationop (op1)')
    .option('-f, --from <from> ', 'Specify the starting date (datefrom)')
    .option('-t, --to <to>', 'Specify the ending date (dateto)')
    .action(async (options) => {
      try {
  
        const { station, from, to} = options;
  
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
  
        const token = getToken();
  
        const format = 'csv';
        // Send format as a query parameter
        const response = await axios.get(`${API_ROUTE}/passesCost`, {
          params: { station, from, to, format },
          headers: { 'x-observatory-auth': token } //  Send token in the request
        });
  
        console.log(response.data); // API already returns the correct format
      } catch (error) {
        console.error('PassesCost failed:', error.response?.data || error.message);
      }
    });
};  