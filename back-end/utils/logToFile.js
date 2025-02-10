const fs = require('fs');
const path = require('path');

function logToFile(message, type = "generic") {
    
    const logDir = path.resolve(__dirname, '../logs'); 
    const logFile = path.join(logDir, `${type}.log`);

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

function logToBoth(message, type) {
    console.log(message);
    logToFile(message, type);
}

function logToBothErr(message, type = "errors") {
    console.error(message);
    logToFile(message, type);
}

module.exports = {logToFile, logToBoth, logToBothErr};