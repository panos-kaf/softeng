require('dotenv').config({ path: '../.env'});
const fs = require('fs');
const http = require('http');
const https = require('https');
const app = require('./app');

const HOST_IP = process.env.HOST_IP;
const HTTP_PORT = process.env.HTTP_PORT || 9114;
const HTTPS_PORT = process.env.HTTPS_PORT || 9115;

const options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT)
}

https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(`Server is running on https://${HOST_IP}:${HTTPS_PORT}`);
});

http.createServer((req, res) => {
    console.log(`Redirecting HTTP request: ${req.url}`);
    res.writeHead(301, { "Location": `https://${HOST_IP}:${HTTPS_PORT}${req.url}` });
    res.end();
}).listen(HTTP_PORT, () => {
    console.log(`HTTP to HTTPS Redirect Server running on http://${HOST_IP}:${HTTP_PORT}`);
});