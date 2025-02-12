
const axiosInit = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Load dotenv

const certPath = path.resolve(__dirname, process.env.CLI_SSL_CERT);
console.log('Resolved cert path:', certPath);

// Load your self-signed certificate
const cert = fs.readFileSync(process.env.CLI_SSL_CERT);

// Create an https.Agent to trust the self-signed certificate
const agent = new https.Agent({
  ca: cert,  // Add the certificate to the trusted list
});

// Create a custom Axios instance with the agent
const axiosInstance = axiosInit.create({
  httpsAgent: agent,
});

// Export the custom instance for use throughout the app
module.exports = axiosInstance;