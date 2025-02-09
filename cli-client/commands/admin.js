const axios = require('../utils/axiosInstance');
const {getToken} = require('../utils/token');
const fs = require('fs');

const HOST = process.env.HOST_IP;
const PORT = process.env.HTTPS_PORT;

module.exports = (program) => {
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
  
        if (options.usermod) {
          const { username, password } = options;
          if (!username || !password) {
            console.error("Username and password are required.");
            return;
          }
  
          try {
            const hashedPassword = await bcrypt.hash(password, 10);
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
  
          const response = await axios.post(`${ADMIN_ROUTE}/addpasses`,formData, 
            {}, 
            {
              headers: { 
              'x-observatory-auth': token,
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
};