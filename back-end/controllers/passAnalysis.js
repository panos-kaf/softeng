const {parse_date, formatDate} = require('../utils/date_conversion');
const db = require('../utils/db');

exports.getAll = async(req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({message: 'Limit query param should be an int'});
    }
}

exports.getPassAnalysis = async(req, res, next) => {
    
}