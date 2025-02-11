const db = require('../utils/db');
const {logToFile, logToBoth, logToBothErr} = require('../utils/logToFile');

exports.resetPasses = async(req, res, next) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
       
        await connection.query("DELETE FROM transactions");
        await connection.query("ALTER TABLE transactions AUTO_INCREMENT = 1");
        
        await connection.query("DELETE FROM tags");
        await connection.query("ALTER TABLE tags AUTO_INCREMENT = 1");
        
        await connection.query("DELETE FROM settlements");
        await connection.query("ALTER TABLE settlements AUTO_INCREMENT = 1");
        
        await connection.query("DELETE FROM payments");
        await connection.query("ALTER TABLE payments AUTO_INCREMENT = 1");

        await connection.commit();
        logToBoth("Passes have been reset.");
        res.status(200).json({"status":"OK"});        

    } catch(error){
        await connection.rollback();
        logToBothErr(error);
        res.status(500).json({"status":"failed","info":error.message});
    } finally {
        connection.release();
    }
};