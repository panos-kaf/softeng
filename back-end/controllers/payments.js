const db = require('../utils/db');

exports.getAll = async(req, res, next) => {
    console.log('hi');
};

exports.makePayment = async (req, res, next) => {
    const { OpID } = req.params;
    const payments = await db.query();
};