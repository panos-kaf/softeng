const HOST = process.env.HOST_IP;
const PORT = process.env.HTTPS_PORT;

const ROUTE = `https://${HOST}:${PORT}`;
const API_ROUTE = `${ROUTE}/api`;
const ADMIN_ROUTE = `${API_ROUTE}/admin`;
const connection_string = `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}
// :${process.env.DB_PORT}/${process.env.DB}`;

module.exports =  {ROUTE, API_ROUTE, ADMIN_ROUTE,connection_string};