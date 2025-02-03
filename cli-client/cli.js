#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');


const validFormats = ['json', 'csv'];
// Path to store the token
const TOKEN_PATH = path.join(__dirname, 'token.json');
// Read the token from the file

const getToken = () => {
  try {
    if (!fs.existsSync(TOKEN_PATH)) return null; // 🔴 Ensure file exists

    const data = fs.readFileSync(TOKEN_PATH, 'utf-8').trim(); // 🔴 Trim spaces to prevent errors
    if (!data) return null; // 🔴 Handle empty file case

    const parsedData = JSON.parse(data); // 🔴 Catch JSON errors
    return parsedData.token || null;
  } catch (error) {
    console.error("❌ Error reading token:", error.message);
    return null;
  }
};

const program = new Command();

program
  .command('login')
  .option('-u, --username <username>', 'Enter username')
  .option('-p, --password <password>', 'Enter password')
  .description('Authenticate the user and store the token')
  .action(async (options) => {
    try {
      
      const { username, password } = options;
      const response = await axios.post('http://localhost:9115/api/log', {
        username,
        password
      });

      // Extract the token from the response
      const { token } = response.data;
      if (!token) throw new Error('Authentication failed: No token received.');

      // Save the token
      fs.writeFileSync(TOKEN_PATH, JSON.stringify({ token }));
      //saveToken(token);
      console.log('Login successful! Token saved.');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  });


  program
  .command('logout')
  .description('Clear the stored token')
  .action(() => {
    if (fs.existsSync(TOKEN_PATH)) {
      fs.unlinkSync(TOKEN_PATH);
    }
    console.log('Logout successful! Token cleared.');
  });



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

      // Send format as a query parameter
      const response = await axios.get('http://localhost:9115/api/admin/healthcheck', {
        params: { format }
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('Healthcheck failed:', error.message);
      console.log(JSON.stringify({ status: 'failed' }, null, 2));
    }
  });



program
  .command('resetstations')
  .description('Initialize stations')
  .option('-f, --format <format>', 'Specify the output format (json or csv)', (value) => {
    
    if (!validFormats.includes(value.toLowerCase())) {
      throw new Error('Invalid format! Use "json" or "csv".');
    }
    return value.toLowerCase();
  }, 'csv')
  .action(async (options) => {
    try {
      const { format } = options;

      // Send format as a query parameter
      const response = await axios.get('http://localhost:9115/api/admin/resetstations', {
        params: { format }
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
     
      if (error.response) {
        // The request was made, and the server responded with an error status
        console.error('ResetStations failed:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // The request was made but no response was received
        console.error('ResetStations failed: No response received from the server.');
      } else {
        // Something happened while setting up the request
        console.error('ResetStations failed:', error.message);
    }
  }
  });




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

      // Send format as a query parameter
      const response = await axios.get('http://localhost:9115/api/admin/resetpasses', {
        params: { format }
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('ResetPasses failed:', error.message);
      console.log(JSON.stringify({ status: 'failed' }, null, 2));
    }
  });



  program
  .command('admin')
  .description('Admin Operations')
  .option('-s, --source <source>', 'Specify the source csv file')
  .option('-f, --format <format>', 'Specify the output format (json or csv)', (value) => {
    
    if (!validFormats.includes(value.toLowerCase())) {
      throw new Error('Invalid format! Use "json" or "csv".');
    }
    return value.toLowerCase();
  }, 'csv')
  .action(async (options) => {
    try {
      const { source, format } = options;

      // Send format as a query parameter
      const response = await axios.get('http://localhost:9115/api/admin', {
        params: { source, format }
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('AddPasses failed:', error.message);
      console.log(JSON.stringify({ status: 'failed' }, null, 2));
    }
  });

  const token = getToken(); // Retrieve the token

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

      console.log("🔹 Checking for stored token...");
      //const token = getToken(); // Retrieve the token

      if (!token) {
        console.error('You must be logged in to access this command. Use `se2411 login --username --password`.');
        return;
      }

      console.log("✅ Token found, proceeding with request...");


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

      console.log(`📡 Sending request to API with station=${station}, from=${from}, to=${to}, format=${format}`);
      // Send format as a query parameter
      const response = await axios.get('http://localhost:9115/api/tollStationPasses', {
        params: { station, from, to, format },
        headers: { Authorization: `Bearer ${token}` } //  Send token in the request
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('TollStationPasses failed:', error.message);
      console.log(JSON.stringify({ status: 'failed' }, null, 2));
    }
  });


  program
  .command('passanalysis')
  .description('Analize passes according to station and period')
  .option('-s, --stationop <stationop>', 'Specify the stationop (op1)')
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

      

      if (!token) {
        console.error('You must be logged in to access this command. Use `se2411 login --username --password`.');
        return;
      }

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

      
      if (!token) {
        throw new Error('Authorization failed: Please log in first using `se2411 login`.');
      }

      // Send format as a query parameter
      const response = await axios.get('http://localhost:9115/api/passAnalysis', {
        params: { station, from, to, format },
        headers: { Authorization: `Bearer ${token}` } //  Send token in the request
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('PassAnalysis failed:', error.response?.data || error.message);
    }
  });



  program.parse(process.argv);