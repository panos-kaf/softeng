const db = require('../utils/db');
const {logToFile, logToBoth, logToBothErr} = require('../utils/logToFile');

exports.getAll = async(req, res, next) => {
    logToBoth('hi');
};

exports.makePayment = async (req, res, next) => {
    const { OpID } = req.params;
    const payments = await db.query();
};