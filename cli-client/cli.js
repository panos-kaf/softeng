#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const db = require('../back-end/utils/db');

const PORT = 443;
const HOST = 'localhost';
const ROUTE = `https://${HOST}:${PORT}/api`;
const ADMIN_ROUTE = `${ROUTE}/admin`;

const validFormats = ['json', 'csv'];
const TOKEN_PATH = path.join(__dirname, 'token.json'); // Path to store the token

// Read the token from the file
const getToken = () => {
  try {
    if (!fs.existsSync(TOKEN_PATH)) return null; // Ensure file exists

    const data = fs.readFileSync(TOKEN_PATH, 'utf-8').trim(); // Trim spaces to prevent errors
    if (!data) return null; //  Handle empty file case

    const parsedData = JSON.parse(data); //  Catch JSON errors
    return parsedData.token || null;
  } catch (error) {
    console.error("Error reading token:", error.message);
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
      const response = await axios.post(`${ROUTE}/login`, {
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
      const response = await axios.get(`${ADMIN_ROUTE}/healthcheck`, {
        params: { format }
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('Healthcheck failed:', error.response?.data || error.message);
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
      const response = await axios.get(`${ROUTE}resetstations`, {
        params: { format }
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {

        console.error('ResetStations failed:', error.response?.data || error.message);
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
      const response = await axios.get(`${ADMIN_ROUTE}/resetpasses`, {
        params: { format }
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('ResetPasses failed:', error.response?.data || error.message);
    
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

      
      const token = getToken(); // Retrieve the token

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

      // Send format as a query parameter

      const response = await axios.get(`${ROUTE}/tollStationPasses`, {
        params: { station, from, to, format },
        headers: { Authorization: `Bearer ${token}` } //  Send token in the request
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('TollStationPasses failed:', error.response?.data || error.message);

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

      // Send format as a query parameter
      const response = await axios.get(`${ROUTE}/passAnalysis`, {
        params: { station, from, to, format },
        headers: { Authorization: `Bearer ${token}` } //  Send token in the request
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('PassAnalysis failed:', error.response?.data || error.message);
    }
  });

  program
  .command('passescost')
  .description('Analize passes according to station and period')
  .option('-s, --stationop <stationop>', 'Specify the stationop (op1)')
  .option('-f, --from <from> ', 'Specify the starting date (datefrom)')
  .option('-t, --to <to>', 'Specify the ending date (dateto)')
  .action(async (options) => {
    try {

      

      if (!token) {
        console.error('You must be logged in to access this command. Use `se2411 login --username --password`.');
        return;
      }

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

      const format = 'csv';
      // Send format as a query parameter
      const response = await axios.get(`${ROUTE}/passesCost`, {
        params: { station, from, to, format },
        headers: { Authorization: `Bearer ${token}` } //  Send token in the request
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('PassesCost failed:', error.response?.data || error.message);
    }
  });

  program
  .command('chargesby')
  .description('Analize passes according to station and period')
  .option('-o, --opid <opid>', 'Specify the stationop (op1)')
  .option('-f, --from <from> ', 'Specify the starting date (datefrom)')
  .option('-t, --to <to>', 'Specify the ending date (dateto)')
  .action(async (options) => {
    try {


      if (!token) {
        console.error('You must be logged in to access this command. Use `se2411 login --username --password`.');
        return;
      }

      const { op, from, to} = options;


      if (!op) {
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

      const format = 'csv';
      // Send format as a query parameter
      const response = await axios.get(`${ROUTE}/chargesBy`, {
        params: { op, from, to, format },
        headers: { Authorization: `Bearer ${token}` } //  Send token in the request
      });

      console.log(response.data); // API already returns the correct format
    } catch (error) {
      console.error('PassesCost failed:', error.response?.data || error.message);
    }
  });


  program
  .command('admin')
  .description('Admin operations (usermod, users, addpasses)')
  .option('--usermod', 'Create or update a user')
  .option('--username <username>', 'Specify the username (required with --usermod)')
  .option('--passw <password>', 'Specify the new password (required with --usermod)')
  .option('--users', 'List all usernames')
  .option('--addpasses', 'Add passes from a CSV file')
  .option('--source <filepath>', 'Specify the CSV file path (required with --addpasses)')
  .action(async (options) => {
    try {
      const token = getToken();
      if (!token) {
        console.error('You must be logged in as an admin to perform this action.');
        return;
      }


      if (options.usermod) {
        const { username, password } = options;
        if (!username || !password) {
          console.error("Username and password are required.");
          return;
        }

        try {
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          await db.execute(
            'INSERT INTO users (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
            [username, hashedPassword]
          );
          console.log("User created or updated successfully.");
        } catch (err) {
          console.error("Error:", err.message);
        }
      } 
      
      else if (options.users) {
        try {
          const [users] = await db.execute('SELECT username FROM users');
          console.log("Users:", users.map(user => user.username).join(', '));
        } catch (err) {
          console.error("Error:", err.message);
        }
      } 
      
      else if (options.addpasses) {
        if (!options.source) {
          console.error('--source is required for --addpasses.');
          return;
        }

        if (!fs.existsSync(options.source)) {
          console.error('CSV file not found:', options.source);
          return;
        }

       const formData = new FormData();
        formData.append('csv', fs.createReadStream(options.source));

        const response = await axios.post(`${ADMIN_ROUTE}/addpasses`,formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            ...formData.getHeaders()
           } 
        });

        console.log(response.data.message || 'Passes added successfully.');
      } else {
        console.error('Invalid admin command. Use --usermod, --users, or --addpasses.');
      }
    } catch (error) {
      console.error('Admin command failed:', error.response?.data || error.message);
    }
  });
    

program.parse(process.argv);
