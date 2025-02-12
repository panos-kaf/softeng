const axios = require('../utils/axiosInstance');
const {getToken} = require('../utils/token');
const {API_ROUTE} = require('../utils/routes');

const validFormats = ['json', 'csv']; // Define valid formats here based on your API's requirements

module.exports = (program) => {
    program
    .command('passanalysis')
    .description('Analize passes according to station and period')
    .option('-s, --stationop <stationop>', 'Specify the stationop (op1)')
    .option('--tagop <tagop>', 'Specify the tagop (op2)')
    .option('-d, --from <from> ', 'Specify the starting date (datefrom)')
    .option('-t, --to <to>', 'Specify the ending date (dateto)')
    .option('-f, --format <format>', 'Specify the output format (json or csv)', (value) => {
      
      if (!validFormats.includes(value.toLowerCase())) {
        throw new Error('Invalid format! Use "json" or "csv".');
      }
      return value.toLowerCase();
    }, 'csv')
    .action(async (options) => {
      try {
  
        const { stationop, tagop, from, to, format } = options;
  
        if (!stationop) {
          console.error('Please provide a station using --station.');
          return;
        }

        if (!tagop) {
          console.error('Please provide a tag using --tagop.');
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
        const response = await axios.get(`${API_ROUTE}/passAnalysis`, {
          params: { stationop, tagop, from, to, format },
          headers: { 'x-observatory-auth': token } //  Send token in the request
        });
  
        console.log(response.data); // API already returns the correct format
      } catch (error) {
        console.error('PassAnalysis failed:', error.response?.data || error.message);
      }
    });
  
};