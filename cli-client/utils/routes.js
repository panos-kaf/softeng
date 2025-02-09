const HOST = process.env.HOST_IP;
const PORT = process.env.HTTPS_PORT;

const ROUTE = `https://${HOST}:${PORT}`;
const API_ROUTE = `${ROUTE}/api`;
const ADMIN_ROUTE = `${API_ROUTE}/admin`;

module.exports = {ROUTE, API_ROUTE, ADMIN_ROUTE};